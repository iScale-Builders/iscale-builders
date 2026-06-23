"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/drizzle/db"
import {
  category,
  launchStatus,
  project,
  projectToCategory,
  upvote,
  user,
} from "@/drizzle/db/schema"
import { auth } from "@clerk/nextjs/server"
import { and, eq, ne, sql } from "drizzle-orm"

// Returns the current Clerk userId (or null).
async function getCurrentUserId() {
  const { userId } = await auth()
  return userId ?? null
}

// Get project by slug
export async function getProjectBySlug(slug: string) {
  // Get project details - Exclure les projets avec le statut payment_pending
  const [projectData] = await db
    .select()
    .from(project)
    .where(and(eq(project.slug, slug), ne(project.launchStatus, launchStatus.PAYMENT_PENDING)))
    .limit(1)

  if (!projectData) {
    return null
  }

  // Get creator information if available
  let creator = null
  if (projectData.createdBy) {
    const [creatorData] = await db
      .select()
      .from(user)
      .where(eq(user.id, projectData.createdBy))
      .limit(1)
    creator = creatorData
  }

  // Get categories
  const categories = await db
    .select({
      id: category.id,
      name: category.name,
    })
    .from(category)
    .innerJoin(projectToCategory, eq(category.id, projectToCategory.categoryId))
    .where(eq(projectToCategory.projectId, projectData.id))

  // Get upvote count
  const [upvoteCount] = await db
    .select({
      count: sql`count(*)`,
    })
    .from(upvote)
    .where(eq(upvote.projectId, projectData.id))

  // Ne plus récupérer les commentaires ici car ils seront gérés par Fuma Comment

  return {
    ...projectData,
    categories,
    upvoteCount: Number(upvoteCount?.count || 0),
    creator,
    // Ne plus inclure les commentaires dans l'objet retourné
  }
}

// Check if a user has upvoted a project
export async function hasUserUpvoted(projectId: string) {
  const userId = await getCurrentUserId()

  if (!userId) {
    return false
  }

  const userUpvotes = await db
    .select()
    .from(upvote)
    .where(and(eq(upvote.userId, userId), eq(upvote.projectId, projectId)))
    .limit(1)

  return userUpvotes.length > 0
}

// Update project details and categories
// Only allowed for project owners and only if project is in "scheduled" status
export async function updateProject(
  projectId: string,
  data: {
    name: string
    websiteUrl: string
    logoUrl: string
    productImage: string | null
    description: string
    categories: string[]
  },
) {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { success: false, error: "Authentication required" }
  }

  try {
    // Get project to check ownership and status
    const [projectData] = await db.select().from(project).where(eq(project.id, projectId)).limit(1)

    if (!projectData) {
      return { success: false, error: "Project not found" }
    }

    // Check if user is the owner
    if (projectData.createdBy !== userId) {
      return {
        success: false,
        error: "You don't have permission to edit this project",
      }
    }

    // Check if project is in scheduled status
    if (projectData.launchStatus !== "scheduled") {
      return {
        success: false,
        error: "You can only edit projects that are scheduled for launch",
      }
    }

    if (!data.name.trim() || !data.websiteUrl.trim() || !data.description.trim()) {
      return { success: false, error: "Name, website URL, and description are required" }
    }

    try {
      new URL(data.websiteUrl)
    } catch {
      return { success: false, error: "Please enter a valid website URL" }
    }
    // Images may be absolute URLs, uploaded data: URLs, or in-app relative paths
    // (e.g. "/images/apps/foo.png"). Only reject clearly malformed values.
    const isValidImageRef = (v: string) =>
      v.startsWith("/") || v.startsWith("data:") || /^https?:\/\//i.test(v)
    if (data.logoUrl.trim() && !isValidImageRef(data.logoUrl.trim())) {
      return { success: false, error: "Please enter a valid logo image URL or path" }
    }
    if (data.productImage?.trim() && !isValidImageRef(data.productImage.trim())) {
      return { success: false, error: "Please enter a valid product image URL or path" }
    }

    if (data.categories.length === 0 || data.categories.length > 3) {
      return { success: false, error: "Please select between 1 and 3 categories" }
    }

    const fallbackLogoUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`

    // Update project details
    await db
      .update(project)
      .set({
        name: data.name.trim(),
        websiteUrl: data.websiteUrl.trim(),
        logoUrl: data.logoUrl.trim() || fallbackLogoUrl,
        productImage: data.productImage?.trim() || null,
        coverImageUrl: data.productImage?.trim() || null,
        description: data.description,
        updatedAt: new Date(),
      })
      .where(eq(project.id, projectId))

    // Update categories (remove old ones and add new ones)
    // First, delete existing categories
    await db.delete(projectToCategory).where(eq(projectToCategory.projectId, projectId))

    // Then add new categories
    if (data.categories.length > 0) {
      await db.insert(projectToCategory).values(
        data.categories.map((categoryId) => ({
          projectId: projectId,
          categoryId,
        })),
      )
    }

    // Revalidate the project page
    revalidatePath(`/projects/${projectData.slug}`)

    return {
      success: true,
      message: "Project updated successfully",
    }
  } catch (error) {
    console.error("Error updating project:", error)
    return {
      success: false,
      error: "Failed to update project",
    }
  }
}
