import { redirect } from "next/navigation"

import { auth } from "@clerk/nextjs/server"

import { getLocalUser } from "@/lib/ensure-user"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Verify the user is signed in and is an admin.
  // Admin role lives in the local "user" table (not Clerk).
  const { userId } = await auth()

  if (!userId) {
    redirect("/")
  }

  const localUser = await getLocalUser(userId)

  if (!localUser || localUser.role !== "admin") {
    redirect("/")
  }

  return <div>{children}</div>
}
