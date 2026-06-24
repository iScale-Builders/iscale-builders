"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/drizzle/db"
import {
  category as categoryTable,
  fumaComments,
  launchStatus,
  problemStatus as problemStatusEnum,
  project as projectTable,
  projectToCategory,
  submissionType,
  upvote,
} from "@/drizzle/db/schema"
import { desc, eq, inArray, sql } from "drizzle-orm"

import { ensureLocalUser } from "@/lib/ensure-user"

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

async function uniqueProblemSlug(name: string): Promise<string> {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "problem"
  const existing = await db.query.project.findFirst({ where: eq(projectTable.slug, base) })
  if (!existing) return base
  return `${base}-${Math.floor(Math.random() * 10000)}`
}

export interface ProblemSubmission {
  title: string
  description: string // rich text / html from the editor
  audience: string // who has this problem (plain text)
  tried: string // what they have tried (plain text)
  urgency: string // "nice_to_have" | "painful" | "urgent"
  categories: string[]
}

const URGENCY_LABEL: Record<string, string> = {
  nice_to_have: "Nice to have",
  painful: "Painful",
  urgent: "Urgent",
}

export async function submitProblem(data: ProblemSubmission) {
  const localUser = await ensureLocalUser()
  if (!localUser) {
    return { success: false, error: "Authentication required" }
  }

  const { title, description, audience, tried, urgency, categories } = data

  if (!title || !description) {
    return { success: false, error: "Please add a title and describe the problem." }
  }
  if (categories.length > 3) {
    return { success: false, error: "You can select a maximum of 3 categories." }
  }

  try {
    const slug = await uniqueProblemSlug(title)
    const urgencyLabel = URGENCY_LABEL[urgency] || URGENCY_LABEL.painful

    // MVP: keep the migration tiny by composing the problem context into the
    // stored description instead of adding a column per field.
    const composed =
      `${description}` +
      (audience ? `<p><strong>Who has this problem:</strong> ${escapeHtml(audience)}</p>` : "") +
      (tried ? `<p><strong>What they have tried:</strong> ${escapeHtml(tried)}</p>` : "") +
      `<p><strong>Urgency:</strong> ${urgencyLabel}</p>`

    const logoUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(title)}`

    const [row] = await db
      .insert(projectTable)
      .values({
        id: crypto.randomUUID(),
        name: title,
        slug,
        description: composed,
        websiteUrl: null,
        logoUrl,
        pricing: "free",
        launchStatus: launchStatus.LAUNCHED,
        submissionType: submissionType.PROBLEM,
        problemStatus: problemStatusEnum.OPEN,
        createdBy: localUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: projectTable.id, slug: projectTable.slug })

    if (categories.length > 0) {
      await db
        .insert(projectToCategory)
        .values(categories.map((categoryId) => ({ projectId: row.id, categoryId })))
    }

    revalidatePath("/problems")
    return { success: true, slug: row.slug }
  } catch (error) {
    console.error("submitProblem error", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit problem.",
    }
  }
}

export interface ProblemListItem {
  id: string
  name: string
  slug: string
  description: string
  logoUrl: string
  problemStatus: string | null
  upvoteCount: number
  commentCount: number
  categories: { id: string; name: string }[]
}

export async function getProblems(limit = 60): Promise<ProblemListItem[]> {
  try {
    return await fetchProblems(limit)
  } catch (error) {
    // Degrade to an empty list when the DB is unavailable (e.g. no-env build).
    console.error("getProblems error", error)
    return []
  }
}

async function fetchProblems(limit: number): Promise<ProblemListItem[]> {
  const rows = await db
    .select({
      id: projectTable.id,
      name: projectTable.name,
      slug: projectTable.slug,
      description: projectTable.description,
      logoUrl: projectTable.logoUrl,
      problemStatus: projectTable.problemStatus,
      createdAt: projectTable.createdAt,
      upvoteCount: sql<number>`cast(count(distinct ${upvote.id}) as int)`.mapWith(Number),
      commentCount: sql<number>`cast(count(distinct ${fumaComments.id}) as int)`.mapWith(Number),
    })
    .from(projectTable)
    .leftJoin(upvote, eq(upvote.projectId, projectTable.id))
    .leftJoin(fumaComments, sql`"fuma_comments"."page"::text = ${projectTable.id}`)
    .where(eq(projectTable.submissionType, submissionType.PROBLEM))
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
    description: r.description,
    logoUrl: r.logoUrl,
    problemStatus: r.problemStatus,
    upvoteCount: r.upvoteCount,
    commentCount: r.commentCount,
    categories: catsByProject.get(r.id) || [],
  }))
}
