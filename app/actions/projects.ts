"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/drizzle/db"
import {
  category as categoryTable,
  fumaComments,
  launchStatus,
  project,
  project as projectTable,
  projectToCategory,
  upvote,
} from "@/drizzle/db/schema"
import { auth } from "@clerk/nextjs/server"
import { and, asc, count, desc, eq, inArray, or, sql } from "drizzle-orm"

import { ensureLocalUser } from "@/lib/ensure-user"
import { slugify } from "@/lib/seo/slug"

// Fonction pour générer un slug unique
async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  // Vérifier si le slug existe déjà dans la table project
  const existingProject = await db.query.project.findFirst({
    where: eq(projectTable.slug, baseSlug),
  })

  if (!existingProject) {
    return baseSlug
  }

  // Si le slug existe, ajouter un nombre aléatoire
  const randomSuffix = Math.floor(Math.random() * 10000)
  return `${baseSlug}-${randomSuffix}`
}

// Returns the current Clerk userId (or null). Use for read-only guards.
// Degrades to null when called outside a request scope (e.g. generateStaticParams
// / sitemap during build), so static generation of programmatic pages doesn't throw.
async function getCurrentUserId() {
  try {
    const localUser = await ensureLocalUser()
    if (localUser) return localUser.id

    const { userId } = await auth()
    return userId ?? null
  } catch {
    return null
  }
}

// Get all categories
export async function getAllCategories() {
  try {
    const categories = await db.select().from(categoryTable).orderBy(categoryTable.name)
    return categories
  } catch {
    return []
  }
}

// Get top categories based on project count
export async function getTopCategories(limit = 5) {
  const topCategories = await db
    .select({
      id: categoryTable.id,
      name: categoryTable.name,
      count: count(projectToCategory.projectId),
    })
    .from(categoryTable)
    .leftJoin(projectToCategory, eq(categoryTable.id, projectToCategory.categoryId))
    .leftJoin(project, eq(projectToCategory.projectId, project.id))
    .where(
      or(
        eq(project.launchStatus, "scheduled"),
        eq(project.launchStatus, "ongoing"),
        eq(project.launchStatus, "launched"),
      ),
    )
    .groupBy(categoryTable.id, categoryTable.name)
    .orderBy(desc(count(projectToCategory.projectId)))
    .limit(limit)

  return topCategories
}

// Get user's upvoted projects
export async function getUserUpvotedProjects() {
  const userId = await getCurrentUserId()

  if (!userId) {
    return []
  }

  const upvotedProjects = await db
    .select({
      project: projectTable,
      upvotedAt: upvote.createdAt,
    })
    .from(upvote)
    .innerJoin(projectTable, eq(upvote.projectId, projectTable.id))
    .where(eq(upvote.userId, userId))
    .orderBy(desc(upvote.createdAt))
    .limit(10)

  return upvotedProjects
}

// La fonction getUserComments ne devrait plus être nécessaire car gérée par Fuma Comment
export async function getUserComments() {
  return []
}

// Get projects created by user
export async function getUserCreatedProjects() {
  const userId = await getCurrentUserId()

  if (!userId) {
    return []
  }

  const userProjects = await db
    .select()
    .from(projectTable)
    .where(eq(projectTable.createdBy, userId))
    .orderBy(desc(projectTable.createdAt))
    .limit(10)

  return userProjects
}

// Toggle upvote on a project
export async function toggleUpvote(projectId: string) {
  // Upsert the local user row first: upvote.userId references user.id.
  const localUser = await ensureLocalUser()

  if (!localUser) {
    return {
      success: false,
      message: "You must be logged in to upvote",
    }
  }

  const userId = localUser.id

  // Importer les constantes et le module de rate limiting
  const { UPVOTE_LIMITS } = await import("@/lib/constants")
  const rateLimit = await import("@/lib/rate-limit")

  // Rate limiting pour les upvotes en utilisant les constantes
  const { success, reset } = await rateLimit.checkRateLimit(
    `upvote:${userId}`,
    UPVOTE_LIMITS.ACTIONS_PER_WINDOW,
    UPVOTE_LIMITS.TIME_WINDOW_MS,
  )

  if (!success) {
    return {
      success: false,
      message: `Anti-Spam Squad here: ${UPVOTE_LIMITS.ACTIONS_PER_WINDOW} upvotes in ${UPVOTE_LIMITS.TIME_WINDOW_MINUTES} minutes maxed out! Retry in ${reset} seconds.`,
    }
  }

  // Vérifier si l'utilisateur a déjà fait une action sur ce project récemment
  const lastAction = await db.query.upvote.findFirst({
    where: and(eq(upvote.userId, userId), eq(upvote.projectId, projectId)),
    orderBy: [desc(upvote.createdAt)],
  })

  // Si une action existe et a été créée il y a moins de X secondes (défini dans les constantes), bloquer
  if (lastAction?.createdAt) {
    const timeSinceLastAction = Date.now() - lastAction.createdAt.getTime()
    if (timeSinceLastAction < UPVOTE_LIMITS.MIN_TIME_BETWEEN_ACTIONS_MS) {
      return {
        success: false,
        message: `Anti-Spam Squad here: ${UPVOTE_LIMITS.MIN_TIME_BETWEEN_ACTIONS_SECONDS}-second wait required for vote changes`,
      }
    }
  }

  // Check if the user has already upvoted the project
  const existingUpvote = await db
    .select()
    .from(upvote)
    .where(and(eq(upvote.userId, userId), eq(upvote.projectId, projectId)))
    .limit(1)

  // If upvote exists, remove it, otherwise add it
  if (existingUpvote.length > 0) {
    await db.delete(upvote).where(and(eq(upvote.userId, userId), eq(upvote.projectId, projectId)))
  } else {
    await db.insert(upvote).values({
      id: crypto.randomUUID(),
      userId,
      projectId,
      createdAt: new Date(),
    })
  }

  revalidatePath("/dashboard")
  // Temporairement commenter la revalidation spécifique au projet
  // Il faudrait le slug ici pour revalider /projects/{slug}
  // revalidatePath(`/projects/${projectSlug}`);

  return { success: true }
}

// Définir l'interface ici
interface ProjectSubmissionData {
  name: string
  description: string
  problemSolved?: string | null
  websiteUrl: string
  logoUrl: string
  productImage: string | null
  galleryImages?: string[]
  categories: string[]
  techStack: string[]
  platforms: string[]
  pricing: string
  githubUrl?: string | null
  twitterUrl?: string | null
}

// Version correcte de submitProject
export async function submitProject(projectData: ProjectSubmissionData) {
  // Upsert the local user row first: project.createdBy references user.id.
  const localUser = await ensureLocalUser()

  if (!localUser) {
    return { success: false, error: "Authentication required" }
  }

  try {
    // Utiliser les données de projectData
    const {
      name,
      description,
      problemSolved,
      websiteUrl,
      logoUrl,
      productImage,
      galleryImages,
      categories,
      techStack,
      platforms,
      pricing,
      githubUrl,
      twitterUrl,
    } = projectData

    // Validation
    if (
      !name ||
      !description ||
      !websiteUrl ||
      !logoUrl ||
      categories.length === 0 ||
      techStack.length === 0 ||
      platforms.length === 0 ||
      !pricing
    ) {
      return { success: false, error: "Missing required fields" }
    }

    // SECURITY: these values are stored and later rendered on public pages, so
    // validate user-supplied URLs (only http(s) — blocks javascript:/data: in
    // link/image fields) and bound field lengths against oversized payloads.
    const isHttpUrl = (value: string) => {
      try {
        const u = new URL(value)
        return u.protocol === "http:" || u.protocol === "https:"
      } catch {
        return false
      }
    }
    const optionalUrls = [logoUrl, productImage, githubUrl, twitterUrl].filter(
      (v): v is string => typeof v === "string" && v.length > 0,
    )
    if (!isHttpUrl(websiteUrl) || optionalUrls.some((u) => !isHttpUrl(u))) {
      return { success: false, error: "Links must be valid http(s) URLs" }
    }
    if (name.length > 120 || description.length > 5000) {
      return { success: false, error: "Name or description is too long" }
    }
    if (categories.length > 5 || techStack.length > 30 || platforms.length > 30) {
      return { success: false, error: "Too many categories, tech, or platforms selected" }
    }

    // Générer le slug à partir du nom dans projectData
    const slug = await generateUniqueSlug(name)

    // Insérer le projet
    const [newProject] = await db
      .insert(projectTable)
      .values({
        id: crypto.randomUUID(),
        // New submissions are live immediately (launch scheduling retired).
        launchStatus: launchStatus.LAUNCHED,
        // Utiliser les variables déstructurées de projectData
        name,
        slug,
        description,
        problemSolved: problemSolved ?? undefined,
        websiteUrl,
        logoUrl,
        productImage: productImage ?? undefined,
        galleryImages: galleryImages && galleryImages.length > 0 ? galleryImages : undefined,
        techStack,
        platforms,
        pricing,
        githubUrl: githubUrl ?? undefined,
        twitterUrl: twitterUrl ?? undefined,
        createdBy: localUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: projectTable.id, slug: projectTable.slug })

    // Ajouter les catégories
    if (categories.length > 0) {
      await db.insert(projectToCategory).values(
        categories.map((categoryId) => ({
          projectId: newProject.id,
          categoryId,
        })),
      )
    }

    return { success: true, projectId: newProject.id, slug: newProject.slug }
  } catch (error) {
    console.error("Error submitting project:", error)
    return { success: false, error: "Failed to submit project" }
  }
}

async function enrichProjectsWithUserData<T extends { id: string }>(
  projects: T[],
  userId: string | null,
): Promise<
  (T & {
    userHasUpvoted: boolean
    categories: { id: string; name: string }[]
  })[]
> {
  if (!projects.length) return []

  const projectIds = projects.map((p) => p.id)

  // Récupérer les catégories pour tous les projets
  const categoriesData = await db
    .select({
      projectId: projectToCategory.projectId,
      categoryId: categoryTable.id,
      categoryName: categoryTable.name,
    })
    .from(projectToCategory)
    .innerJoin(categoryTable, eq(categoryTable.id, projectToCategory.categoryId))
    .where(inArray(projectToCategory.projectId, projectIds))

  const categoriesByProjectId = categoriesData.reduce(
    (acc, row) => {
      if (!acc[row.projectId]) {
        acc[row.projectId] = []
      }
      acc[row.projectId].push({ id: row.categoryId, name: row.categoryName })
      return acc
    },
    {} as Record<string, { id: string; name: string }[]>,
  )

  // Récupérer les upvotes de l'utilisateur
  let userUpvotedProjectIds = new Set<string>()
  if (userId) {
    const userUpvotes = await db
      .select({ projectId: upvote.projectId })
      .from(upvote)
      .where(and(eq(upvote.userId, userId), inArray(upvote.projectId, projectIds)))
    userUpvotedProjectIds = new Set(userUpvotes.map((uv) => uv.projectId))
  }

  return projects.map((project) => ({
    ...project,
    userHasUpvoted: userUpvotedProjectIds.has(project.id),
    categories: categoriesByProjectId[project.id] || [],
  }))
}

// Get projects by category with pagination and sorting
export async function getProjectsByCategory(
  categoryId: string,
  page: number = 1,
  limit: number = 10,
  sort: string = "recent",
) {
  const userId = await getCurrentUserId()

  let orderByClause
  switch (sort) {
    case "upvotes":
      orderByClause = desc(sql`count(distinct ${upvote.id})`)
      break
    case "alphabetical":
      orderByClause = asc(projectTable.name)
      break
    case "recent":
    default:
      orderByClause = desc(projectTable.createdAt)
      break
  }

  const offset = (page - 1) * limit

  const queryConditions = and(
    eq(projectToCategory.categoryId, categoryId),
    or(
      eq(projectTable.launchStatus, "scheduled"),
      eq(projectTable.launchStatus, "ongoing"),
      eq(projectTable.launchStatus, "launched"),
    ),
  )

  const projectsData = await db
    .select({
      id: projectTable.id,
      name: projectTable.name,
      slug: projectTable.slug,
      description: projectTable.description,
      logoUrl: projectTable.logoUrl,
      websiteUrl: projectTable.websiteUrl,
      launchStatus: projectTable.launchStatus,
      launchType: projectTable.launchType,
      dailyRanking: projectTable.dailyRanking,
      scheduledLaunchDate: projectTable.scheduledLaunchDate,
      createdAt: projectTable.createdAt,
      upvoteCount: sql<number>`count(distinct ${upvote.id})`.mapWith(Number),
      commentCount: sql<number>`count(distinct ${fumaComments.id})`.mapWith(Number),
    })
    .from(projectTable)
    .innerJoin(projectToCategory, eq(projectTable.id, projectToCategory.projectId))
    .leftJoin(upvote, eq(upvote.projectId, projectTable.id))
    .leftJoin(fumaComments, sql`(${fumaComments.page}::text = ${projectTable.id}::text)`)
    .where(queryConditions)
    .groupBy(
      projectTable.id,
      projectTable.name,
      projectTable.slug,
      projectTable.description,
      projectTable.logoUrl,
      projectTable.websiteUrl,
      projectTable.launchStatus,
      projectTable.launchType,
      projectTable.dailyRanking,
      projectTable.scheduledLaunchDate,
      projectTable.createdAt,
    )
    .orderBy(orderByClause)
    .limit(limit)
    .offset(offset)

  const enrichedProjects = await enrichProjectsWithUserData(projectsData, userId)

  const totalProjectsResult = await db
    .select({ count: count(projectTable.id) })
    .from(projectTable)
    .innerJoin(projectToCategory, eq(projectTable.id, projectToCategory.projectId))
    .where(queryConditions)

  const totalCount = totalProjectsResult[0]?.count || 0

  return {
    projects: enrichedProjects,
    totalCount,
  }
}

// getCategoryById
export async function getCategoryById(categoryId: string) {
  const categoryData = await db
    .select()
    .from(categoryTable)
    .where(eq(categoryTable.id, categoryId))
    .limit(1)

  return categoryData[0] || null
}

// Resolve a derived (slugified-name) category slug back to its category row.
// Categories have no slug column, so we slugify each name and match.
export async function getCategoryBySlug(slug: string) {
  const categories = await db.select().from(categoryTable)
  return categories.find((c) => slugify(c.name) === slug) || null
}

// Build a bounded set of "a-vs-b" comparison slugs by pairing the top tools
// within each category. Used by /compare static params and the sitemap so we
// never generate the full O(n^2) pair space. Pairs are alphabetically ordered
// (canonical) and de-duplicated across categories.
export async function getComparePairs(topPerCategory = 5, maxPairs = 300) {
  let categories: { id: string }[] = []
  try {
    categories = await db.select({ id: categoryTable.id }).from(categoryTable)
  } catch {
    return []
  }
  const seen = new Set<string>()
  const pairs: string[] = []

  for (const cat of categories) {
    if (pairs.length >= maxPairs) break
    const { projects } = await getProjectsByCategory(cat.id, 1, topPerCategory, "upvotes")
    const slugs = projects.map((p) => p.slug)
    for (let i = 0; i < slugs.length; i++) {
      for (let j = i + 1; j < slugs.length; j++) {
        const [a, b] = [slugs[i], slugs[j]].sort()
        const key = `${a}-vs-${b}`
        if (!seen.has(key)) {
          seen.add(key)
          pairs.push(key)
          if (pairs.length >= maxPairs) break
        }
      }
      if (pairs.length >= maxPairs) break
    }
  }

  return pairs
}

// Lightweight slug list for generateStaticParams on programmatic project pages.
export async function getAllProjectSlugs() {
  try {
    const rows = await db
      .select({ slug: projectTable.slug })
      .from(projectTable)
      .where(
        or(
          eq(projectTable.launchStatus, "scheduled"),
          eq(projectTable.launchStatus, "ongoing"),
          eq(projectTable.launchStatus, "launched"),
        ),
      )
    return rows.map((r) => r.slug)
  } catch {
    return []
  }
}

// Delete a post (problem or solution) the current user owns. FK onDelete cascade
// removes its category links and upvotes; comments are not FK-linked so they are
// cleaned up best-effort.
export async function deleteOwnProject(projectId: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "You must be signed in." }

  const existing = await db.query.project.findFirst({
    where: eq(projectTable.id, projectId),
    columns: { id: true, createdBy: true },
  })
  if (!existing) return { success: false, error: "Post not found." }
  if (existing.createdBy !== userId) {
    return { success: false, error: "You can only delete your own posts." }
  }

  try {
    try {
      await db.delete(fumaComments).where(sql`${fumaComments.page}::text = ${projectId}`)
    } catch (commentError) {
      console.error("deleteOwnProject: comment cleanup failed", commentError)
    }
    await db.delete(projectTable).where(eq(projectTable.id, projectId))

    revalidatePath("/")
    revalidatePath("/explore")
    revalidatePath("/problems")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("deleteOwnProject error", error)
    return { success: false, error: "Could not delete this post. Try again." }
  }
}
