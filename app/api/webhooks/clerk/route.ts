import { NextResponse, type NextRequest } from "next/server"

import { db } from "@/drizzle/db"
import { user as userTable } from "@/drizzle/db/schema"
import { verifyWebhook } from "@clerk/nextjs/webhooks"
import { eq, sql } from "drizzle-orm"

/**
 * Best-effort Clerk webhook: keeps the local "user" table in sync on
 * user.created / user.updated / user.deleted.
 *
 * This is NOT the source of truth — lib/ensure-user.ts (called on sign-in
 * actions and on Nav render) is the must-have upsert. This webhook just keeps
 * data fresh out-of-band.
 *
 * To enable: configure a Clerk webhook endpoint pointing here and set
 * CLERK_WEBHOOK_SIGNING_SECRET in the environment. verifyWebhook reads it.
 */
export async function POST(req: NextRequest) {
  let evt
  try {
    evt = await verifyWebhook(req)
  } catch (err) {
    console.error("[clerk-webhook] verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    const now = new Date()

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const data = evt.data
      const id = data.id
      const email =
        data.email_addresses?.find((e) => e.id === data.primary_email_address_id)?.email_address ??
        data.email_addresses?.[0]?.email_address ??
        `${id}@users.noreply.clerk`
      const name =
        [data.first_name, data.last_name].filter(Boolean).join(" ").trim() ||
        data.username ||
        email.split("@")[0]
      const image = data.image_url ?? null

      const [existing] = await db.select().from(userTable).where(eq(userTable.id, id)).limit(1)

      if (existing) {
        // Preserve role on update.
        await db
          .update(userTable)
          .set({ name, email, image, updatedAt: now })
          .where(eq(userTable.id, id))
      } else {
        const [existingByEmail] = await db
          .select()
          .from(userTable)
          .where(sql`lower(${userTable.email}) = lower(${email})`)
          .limit(1)

        if (existingByEmail) {
          // Preserve the existing local id/role because projects and upvotes
          // may already reference it.
          await db
            .update(userTable)
            .set({ name, email, image, updatedAt: now })
            .where(eq(userTable.id, existingByEmail.id))
        } else {
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
        }
      }
    } else if (evt.type === "user.deleted") {
      const id = evt.data.id
      if (id) {
        await db.delete(userTable).where(eq(userTable.id, id))
      }
    }
  } catch (err) {
    console.error("[clerk-webhook] handler error:", err)
    // Best-effort: don't fail the webhook delivery on a DB hiccup.
    return NextResponse.json({ received: true, warning: "handler error" })
  }

  return NextResponse.json({ received: true })
}
