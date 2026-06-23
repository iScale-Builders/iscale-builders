import { db } from "@/drizzle/db"
import { user } from "@/drizzle/db/schema"
import { eq } from "drizzle-orm"

// ---------------------------------------------------------------------------
// Promote a local "user" row to admin (role = "admin") by email.
//
// The admin role lives ONLY in the local "user" table (Clerk does not carry
// it). The user must have signed in via Clerk at least once so that
// ensureLocalUser() has upserted their row — only then does the email exist
// here to promote.
//
// Run with:
//   cd C:/Users/jose/.agent/apps/iscale-builders && \
//   C:/Users/jose/.bun/bin/bun.exe scripts/make-admin.ts your@email.com
//
// Only promote a real Clerk-backed account that should administer the app.
// ---------------------------------------------------------------------------

async function main() {
  const email = process.argv[2]?.trim()

  if (!email) {
    console.error("Usage: bun scripts/make-admin.ts <email>")
    process.exit(1)
  }

  const [existing] = await db.select().from(user).where(eq(user.email, email)).limit(1)

  if (!existing) {
    console.error(
      `No local user found with email "${email}". ` +
        `Sign in via Clerk once first (so the local user row is created), then re-run.`,
    )
    process.exit(1)
  }

  if (existing.role === "admin") {
    console.log(`User "${email}" (${existing.id}) is already an admin. Nothing to do.`)
    process.exit(0)
  }

  await db
    .update(user)
    .set({ role: "admin", updatedAt: new Date() })
    .where(eq(user.id, existing.id))

  console.log(`Promoted "${email}" (${existing.id}) to admin.`)
  process.exit(0)
}

main().catch((err) => {
  console.error("make-admin failed:", err)
  process.exit(1)
})
