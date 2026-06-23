import { randomUUID } from "node:crypto"

import { db } from "@/drizzle/db"
import {
  category,
  fumaComments,
  fumaRates,
  launchStatus,
  project,
  projectToCategory,
  upvote,
  user,
} from "@/drizzle/db/schema"
import { eq, inArray, like } from "drizzle-orm"

import { iscaleLabsApps } from "./iscalelabs-apps"

const DEMO_EMAIL_SUFFIXES = ["@demo.iscalebuilders.com"]
const PUBLISHER_ID = "iscalelabs-jose"
const PUBLISHER_EMAIL = "contact@iscalelabs.com"
const PUBLISHER_NAME = "Jose / iScaleLabs"

function categoryId(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

async function deleteProjectsByIds(ids: string[]) {
  if (!ids.length) return

  const comments = await db
    .select({ id: fumaComments.id })
    .from(fumaComments)
    .where(inArray(fumaComments.page, ids))
  const commentIds = comments.map((comment) => comment.id)

  if (commentIds.length) {
    await db.delete(fumaRates).where(inArray(fumaRates.commentId, commentIds))
  }

  await db.delete(fumaComments).where(inArray(fumaComments.page, ids))
  await db.delete(upvote).where(inArray(upvote.projectId, ids))
  await db.delete(projectToCategory).where(inArray(projectToCategory.projectId, ids))
  await db.delete(project).where(inArray(project.id, ids))
}

async function clearDemoRows() {
  const demoUserIds = new Set<string>()

  for (const suffix of DEMO_EMAIL_SUFFIXES) {
    const rows = await db
      .select({ id: user.id })
      .from(user)
      .where(like(user.email, `%${suffix}`))
    rows.forEach((row) => demoUserIds.add(row.id))
  }

  const ids = [...demoUserIds]
  if (!ids.length) return { users: 0, projects: 0 }

  const demoProjects = await db
    .select({ id: project.id })
    .from(project)
    .where(inArray(project.createdBy, ids))
  const projectIds = demoProjects.map((row) => row.id)

  await deleteProjectsByIds(projectIds)
  await db.delete(upvote).where(inArray(upvote.userId, ids))
  await db.delete(fumaComments).where(inArray(fumaComments.author, ids))
  await db.delete(user).where(inArray(user.id, ids))

  return { users: ids.length, projects: projectIds.length }
}

async function seed() {
  const now = new Date()
  const scheduledDate = new Date(now)
  scheduledDate.setUTCDate(scheduledDate.getUTCDate() + 14)
  scheduledDate.setUTCHours(8, 0, 0, 0)

  const demoDeleted = await clearDemoRows()

  const existingAppRows = await db
    .select({ id: project.id })
    .from(project)
    .where(
      inArray(
        project.slug,
        iscaleLabsApps.map((app) => app.slug),
      ),
    )
  await deleteProjectsByIds(existingAppRows.map((row) => row.id))

  const [existingPublisher] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, PUBLISHER_EMAIL))
    .limit(1)

  if (existingPublisher) {
    await db
      .update(user)
      .set({
        name: PUBLISHER_NAME,
        image: "/logo.png",
        updatedAt: now,
      })
      .where(eq(user.id, existingPublisher.id))
  } else {
    await db.insert(user).values({
      id: PUBLISHER_ID,
      name: PUBLISHER_NAME,
      email: PUBLISHER_EMAIL,
      emailVerified: true,
      image: "/logo.png",
      createdAt: now,
      updatedAt: now,
      role: "admin",
    })
  }

  const publisherId = existingPublisher?.id ?? PUBLISHER_ID

  const appBuilderEmails = Array.from(
    new Set(
      iscaleLabsApps
        .map((app) => app.builderEmail)
        .filter((email): email is string => Boolean(email)),
    ),
  )
  const appBuilders = appBuilderEmails.length
    ? await db
        .select({ id: user.id, email: user.email })
        .from(user)
        .where(inArray(user.email, appBuilderEmails))
    : []
  const builderIdByEmail = new Map(appBuilders.map((builder) => [builder.email, builder.id]))

  const existingCategories = await db.select().from(category)
  const categoryByName = new Map(existingCategories.map((row) => [row.name, row.id]))

  const newCategories = Array.from(new Set(iscaleLabsApps.flatMap((app) => app.categories)))
    .filter((name) => !categoryByName.has(name))
    .map((name) => ({ id: categoryId(name) || randomUUID(), name }))

  if (newCategories.length) {
    await db.insert(category).values(newCategories)
    newCategories.forEach((row) => categoryByName.set(row.name, row.id))
  }

  const projectRows = iscaleLabsApps.map((app, index) => ({
    id: randomUUID(),
    name: app.name,
    slug: app.slug,
    description: app.description,
    websiteUrl: app.websiteUrl,
    logoUrl: app.logoUrl,
    coverImageUrl: app.productImage,
    productImage: app.productImage,
    githubUrl: app.githubUrl,
    twitterUrl: null,
    techStack: app.techStack,
    pricing: app.pricing,
    platforms: app.platforms,
    launchStatus: launchStatus.SCHEDULED,
    scheduledLaunchDate: new Date(scheduledDate.getTime() + index * 24 * 60 * 60 * 1000),
    launchType: "free",
    featuredOnHomepage: index < 5,
    dailyRanking: null,
    createdAt: new Date(now.getTime() - index * 60 * 60 * 1000),
    updatedAt: now,
    createdBy: app.builderEmail
      ? (builderIdByEmail.get(app.builderEmail) ?? publisherId)
      : publisherId,
  }))

  await db.insert(project).values(projectRows)

  const links = projectRows.flatMap((row, index) =>
    iscaleLabsApps[index].categories
      .map((name) => categoryByName.get(name))
      .filter((id): id is string => Boolean(id))
      .map((categoryIdValue) => ({ projectId: row.id, categoryId: categoryIdValue })),
  )

  if (links.length) {
    await db.insert(projectToCategory).values(links)
  }

  console.log(
    JSON.stringify(
      {
        deletedDemo: demoDeleted,
        deletedExistingAppRows: existingAppRows.length,
        insertedApps: projectRows.length,
        insertedCategories: newCategories.length,
        categoryLinks: links.length,
      },
      null,
      2,
    ),
  )
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
