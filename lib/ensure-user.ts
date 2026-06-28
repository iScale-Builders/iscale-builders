import { db } from "@/drizzle/db"
import { user as userTable } from "@/drizzle/db/schema"
import { auth, currentUser } from "@clerk/nextjs/server"
import { eq, sql } from "drizzle-orm"

export interface LocalUser {
  id: string
  name: string
  email: string
  image: string | null
  role: string | null
}

/**
 * Upserts the currently signed-in Clerk user into the local "user" table and
 * returns the local row.
 *
 * The local "user" table remains the canonical identity used by FK columns
 * (project.createdBy, upvote.userId, fuma_comments.author). The local user id
 * IS the Clerk user id (e.g. "user_xxx").
 *
 * Important invariants:
 * - Always sets emailVerified (schema is NOT NULL).
 * - NEVER overwrites an existing role on update (admins are granted via the DB).
 * - Returns null when there is no signed-in Clerk user.
 *
 * Call this server-side before any action that reads role or writes a FK that
 * references user.id (upvote, comment, submit).
 */
export async function ensureLocalUser(): Promise<LocalUser | null> {
  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const id = clerkUser.id
  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    `${id}@users.noreply.clerk`
  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() ||
    clerkUser.username ||
    email.split("@")[0]
  const image = clerkUser.imageUrl ?? null
  const now = new Date()

  // Does a local row already exist?
  const [existing] = await db.select().from(userTable).where(eq(userTable.id, id)).limit(1)

  if (existing) {
    // Keep identity fresh, but preserve the existing role (admin grants live in DB).
    await db
      .update(userTable)
      .set({
        name,
        email,
        image,
        updatedAt: now,
      })
      .where(eq(userTable.id, id))

    return {
      id,
      name,
      email,
      image,
      role: existing.role ?? null,
    }
  }

  // Clerk can issue a new user id for an email that already exists locally
  // (for example, after account recreation or provider changes). Since email is
  // unique and existing projects/upvotes reference the old local id, reuse that
  // local row instead of crashing on a duplicate email insert.
  const [existingByEmail] = await db
    .select()
    .from(userTable)
    .where(sql`lower(${userTable.email}) = lower(${email})`)
    .limit(1)

  if (existingByEmail) {
    await db
      .update(userTable)
      .set({
        name,
        email,
        image,
        updatedAt: now,
      })
      .where(eq(userTable.id, existingByEmail.id))

    return {
      id: existingByEmail.id,
      name,
      email,
      image,
      role: existingByEmail.role ?? null,
    }
  }

  // Insert a new local user row.
  await db.insert(userTable).values({
    id,
    name,
    email,
    emailVerified: true,
    image,
    role: null,
    createdAt: now,
    updatedAt: now,
  })

  return { id, name, email, image, role: null }
}

/**
 * Best-effort sync for read paths that need the current user id and fresh local
 * profile fields before rendering public UI, such as listing cards.
 */
export async function getSyncedCurrentUserId(): Promise<string | null> {
  const { userId } = await auth()
  if (!userId) return null

  try {
    const localUser = await ensureLocalUser()
    return localUser?.id ?? userId
  } catch (error) {
    console.error("Failed to sync current local user:", error)
    return userId
  }
}

/**
 * Lightweight read of the local user row by Clerk userId WITHOUT upserting.
 * Returns null if not found. Use when you only need role/profile and the row is
 * expected to already exist.
 */
export async function getLocalUser(userId: string): Promise<LocalUser | null> {
  const [row] = await db.select().from(userTable).where(eq(userTable.id, userId)).limit(1)
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    image: row.image ?? null,
    role: row.role ?? null,
  }
}
