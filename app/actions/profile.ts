"use server"

import { db } from "@/drizzle/db"
import {
  category as categoryTable,
  fumaComments,
  launchStatus,
  project as projectTable,
  projectToCategory,
  upvote,
  user as userTable,
} from "@/drizzle/db/schema"
import { and, desc, eq, inArray, ne, sql } from "drizzle-orm"

export interface MakerProject {
  id: string
  name: string
  slug: string
  description: string
  logoUrl: string
  coverImageUrl: string | null
  productImage: string | null
  galleryImages: string[] | null
  launchStatus: string
  upvoteCount: number
  commentCount: number
  categories: { id: string; name: string }[]
}

export interface MakerProfile {
  user: {
    id: string
    name: string
    image: string | null
    createdAt: Date
  }
  projects: MakerProject[]
  stats: {
    totalTools: number
    totalUpvotes: number
  }
}

/**
 * Returns a public maker profile: the user (id, name, image, join date) plus all
 * of their tools (any launchStatus EXCEPT payment_pending / payment_failed), each
 * enriched with upvoteCount, commentCount, and categories. Also returns aggregate
 * stats (total tools, total upvotes received across their tools).
 *
 * Mirrors the query style of getExploreProjects (app/actions/explore.ts).
 * Returns null if the user does not exist.
 */
export async function getMakerProfile(userId: string): Promise<MakerProfile | null> {
  const [userData] = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      image: userTable.image,
      createdAt: userTable.createdAt,
    })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1)

  if (!userData) return null

  const rows = await db
    .select({
      id: projectTable.id,
      name: projectTable.name,
      slug: projectTable.slug,
      description: projectTable.description,
      logoUrl: projectTable.logoUrl,
      coverImageUrl: projectTable.coverImageUrl,
      productImage: projectTable.productImage,
      galleryImages: projectTable.galleryImages,
      launchStatus: projectTable.launchStatus,
      createdAt: projectTable.createdAt,
      upvoteCount: sql<number>`cast(count(distinct ${upvote.id}) as int)`.mapWith(Number),
      commentCount: sql<number>`cast(count(distinct ${fumaComments.id}) as int)`.mapWith(Number),
    })
    .from(projectTable)
    .leftJoin(upvote, eq(upvote.projectId, projectTable.id))
    .leftJoin(fumaComments, sql`"fuma_comments"."page"::text = ${projectTable.id}`)
    .where(
      and(
        eq(projectTable.createdBy, userId),
        ne(projectTable.launchStatus, launchStatus.PAYMENT_PENDING),
        ne(projectTable.launchStatus, launchStatus.PAYMENT_FAILED),
      ),
    )
    .groupBy(projectTable.id)
    .orderBy(desc(sql`count(distinct ${upvote.id})`), desc(projectTable.createdAt))

  let categoriesByProjectId: Record<string, { id: string; name: string }[]> = {}

  if (rows.length) {
    const projectIds = rows.map((r) => r.id)

    const categoriesData = await db
      .select({
        projectId: projectToCategory.projectId,
        categoryId: categoryTable.id,
        categoryName: categoryTable.name,
      })
      .from(projectToCategory)
      .innerJoin(categoryTable, eq(categoryTable.id, projectToCategory.categoryId))
      .where(inArray(projectToCategory.projectId, projectIds))

    categoriesByProjectId = categoriesData.reduce(
      (acc, row) => {
        ;(acc[row.projectId] ??= []).push({ id: row.categoryId, name: row.categoryName })
        return acc
      },
      {} as Record<string, { id: string; name: string }[]>,
    )
  }

  const projects: MakerProject[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    logoUrl: row.logoUrl,
    coverImageUrl: row.coverImageUrl,
    productImage: row.productImage,
    galleryImages: row.galleryImages,
    launchStatus: row.launchStatus,
    upvoteCount: row.upvoteCount,
    commentCount: row.commentCount,
    categories: categoriesByProjectId[row.id] ?? [],
  }))

  const totalUpvotes = projects.reduce((sum, p) => sum + p.upvoteCount, 0)

  return {
    user: userData,
    projects,
    stats: {
      totalTools: projects.length,
      totalUpvotes,
    },
  }
}
