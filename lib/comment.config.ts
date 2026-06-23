import { db } from "@/drizzle/db"
import { fumaComments, fumaRates, fumaRoles, user } from "@/drizzle/db/schema"
import { auth as clerkAuth } from "@clerk/nextjs/server"
import { createDrizzleAdapter } from "@fuma-comment/server/adapters/drizzle"

import { ensureLocalUser } from "@/lib/ensure-user"

// Fuma Comment auth adapter backed by Clerk.
//
// getSession resolves the current Clerk user and returns a FLAT object
// { id: clerkUserId } | null. The id is the Clerk userId, which (per DECISION 2)
// equals the local `user` table primary key. This makes fuma_comments.author =
// Clerk userId = local user.id, so author display is looked up from the synced
// local `user` row (kept fresh by ensureLocalUser) — NOT from Clerk directly.
//
// We do NOT use the built-in ClerkAdapter because its getUsers/queryUsers pull
// names/avatars from Clerk's backend, which would diverge from the local profile
// shown on /u/[id] maker pages. Instead the storage adapter below uses the
// generic provider (auth: "better-auth") which reads display name/image from the
// local `user` table by id.
//
// ensureLocalUser() is called best-effort inside getSession so a `user` row
// exists before the comment FK insert and the getUsers join (defense in depth;
// the POST route also calls it).
export const commentAuth = {
  // Accepts an optional request arg (ignored) so existing call sites that pass
  // `req` keep compiling; Clerk's auth() reads the request from async context.
  getSession: async (_request?: unknown) => {
    void _request
    const { userId } = await clerkAuth()
    if (!userId) return null
    // Best-effort: guarantee a local `user` row exists for this Clerk user so
    // the FK + author-name join resolve. Never block auth on failure.
    try {
      await ensureLocalUser()
    } catch (error) {
      console.error("ensureLocalUser failed in commentAuth.getSession:", error)
    }
    return { id: userId }
  },
}

export const commentStorage = createDrizzleAdapter({
  db,
  // "better-auth" here only SELECTS the generic display-name provider that reads
  // name/image from the local `user` table by id. It does NOT invoke Better Auth
  // at runtime. Author display therefore uses the synced local user row.
  auth: "better-auth",
  schemas: {
    comments: fumaComments,
    rates: fumaRates,
    roles: fumaRoles,
    user,
  },
})
