"use server"

import { db } from "@/drizzle/db"
import {
  category as categoryTable,
  fumaComments,
  project as projectTable,
  projectToCategory,
  submissionType,
  upvote,
} from "@/drizzle/db/schema"
import { desc, eq, inArray, sql } from "drizzle-orm"

export interface SolutionListItem {
  id: string
  name: string
  slug: string
  description: string
  logoUrl: string
  launchStatus: string
  websiteUrl: string | null
  upvoteCount: number
  commentCount: number
  categories: { id: string; name: string }[]
}

export async function getSolutions(limit = 60): Promise<SolutionListItem[]> {
  try {
    return await fetchSolutions(limit)
  } catch (error) {
    // Degrade to an empty list when the DB is unavailable (e.g. no-env build).
    console.error("getSolutions error", error)
    return []
  }
}

async function fetchSolutions(limit: number): Promise<SolutionListItem[]> {
  const rows = await db
    .select({
      id: projectTable.id,
      name: projectTable.name,
      slug: projectTable.slug,
      description: projectTable.description,
      logoUrl: projectTable.logoUrl,
      launchStatus: projectTable.launchStatus,
      websiteUrl: projectTable.websiteUrl,
      createdAt: projectTable.createdAt,
      upvoteCount: sql<number>`cast(count(distinct ${upvote.id}) as int)`.mapWith(Number),
      commentCount: sql<number>`cast(count(distinct ${fumaComments.id}) as int)`.mapWith(Number),
    })
    .from(projectTable)
    .leftJoin(upvote, eq(upvote.projectId, projectTable.id))
    .leftJoin(fumaComments, sql`"fuma_comments"."page"::text = ${projectTable.id}`)
    .where(eq(projectTable.submissionType, submissionType.SOLUTION))
    .groupBy(projectTable.id)
    .orderBy(desc(sql`count(distinct ${upvote.id})`), desc(projectTable.createdAt))
    .limit(limit)

  const ids = rows.map((r) => r.id)
  const catRows = ids.length
    ? await db
        .select({
          projectId: projectToCategory.projectId,
          id: categoryTable.id,
          name: categoryTable.name,
        })
        .from(projectToCategory)
        .innerJoin(categoryTable, eq(categoryTable.id, projectToCategory.categoryId))
        .where(inArray(projectToCategory.projectId, ids))
    : []

  const catsByProject = new Map<string, { id: string; name: string }[]>()
  for (const c of catRows) {
    const list = catsByProject.get(c.projectId) || []
    list.push({ id: c.id, name: c.name })
    catsByProject.set(c.projectId, list)
  }

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description ?? "",
    logoUrl: r.logoUrl ?? "",
    launchStatus: r.launchStatus,
    websiteUrl: r.websiteUrl,
    upvoteCount: r.upvoteCount,
    commentCount: r.commentCount,
    categories: catsByProject.get(r.id) || [],
  }))
}
