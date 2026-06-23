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
import { auth } from "@clerk/nextjs/server"
import { and, desc, eq, inArray, ne, sql } from "drizzle-orm"

async function getCurrentUserId() {
  const { userId } = await auth()
  return userId ?? null
}

export interface ExploreProject {
  id: string
  name: string
  slug: string
  description: string
  logoUrl: string
  coverImageUrl: string | null
  productImage: string | null
  galleryImages: string[] | null
  websiteUrl: string
  launchStatus: string
  launchType: string | null
  dailyRanking: number | null
  upvoteCount: number
  commentCount: number
  creatorName: string | null
  creatorImage: string | null
  categories: { id: string; name: string }[]
  userHasUpvoted: boolean
}

/**
 * Returns all public catalog projects, ordered by distinct upvote count (desc),
 * enriched with their cover/product image, maker (creator) name + avatar,
 * categories, comment count, and whether the current user has upvoted.
 *
 * Used by the magazine-style /explore browse experience.
 */
export async function getExploreProjects(limit = 60): Promise<ExploreProject[]> {
  const userId = await getCurrentUserId()

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
      websiteUrl: projectTable.websiteUrl,
      launchStatus: projectTable.launchStatus,
      launchType: projectTable.launchType,
      dailyRanking: projectTable.dailyRanking,
      createdAt: projectTable.createdAt,
      creatorName: userTable.name,
      creatorImage: userTable.image,
      upvoteCount: sql<number>`cast(count(distinct ${upvote.id}) as int)`.mapWith(Number),
      commentCount: sql<number>`cast(count(distinct ${fumaComments.id}) as int)`.mapWith(Number),
    })
    .from(projectTable)
    .leftJoin(upvote, eq(upvote.projectId, projectTable.id))
    .leftJoin(fumaComments, sql`"fuma_comments"."page"::text = ${projectTable.id}`)
    .leftJoin(userTable, eq(userTable.id, projectTable.createdBy))
    .where(ne(projectTable.launchStatus, launchStatus.PAYMENT_PENDING))
    .groupBy(projectTable.id, userTable.id)
    .orderBy(desc(sql`count(distinct ${upvote.id})`), desc(projectTable.createdAt))
    .limit(limit)

  if (!rows.length) return []

  const projectIds = rows.map((r) => r.id)

  // Categories for all projects in one query.
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
      ;(acc[row.projectId] ??= []).push({ id: row.categoryId, name: row.categoryName })
      return acc
    },
    {} as Record<string, { id: string; name: string }[]>,
  )

  // Which of these did the current user upvote?
  let userUpvotedProjectIds = new Set<string>()
  if (userId) {
    const userUpvotes = await db
      .select({ projectId: upvote.projectId })
      .from(upvote)
      .where(and(eq(upvote.userId, userId), inArray(upvote.projectId, projectIds)))
    userUpvotedProjectIds = new Set(userUpvotes.map((uv) => uv.projectId))
  }

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    logoUrl: row.logoUrl,
    coverImageUrl: row.coverImageUrl,
    productImage: row.productImage,
    galleryImages: row.galleryImages,
    websiteUrl: row.websiteUrl,
    launchStatus: row.launchStatus,
    launchType: row.launchType,
    dailyRanking: row.dailyRanking,
    upvoteCount: row.upvoteCount,
    commentCount: row.commentCount,
    creatorName: row.creatorName,
    creatorImage: row.creatorImage,
    categories: categoriesByProjectId[row.id] ?? [],
    userHasUpvoted: userUpvotedProjectIds.has(row.id),
  }))
}
