import { redirect } from "next/navigation"

import { ensureLocalUser } from "@/lib/ensure-user"
import { SubmitProjectForm } from "@/components/project/submit-form"

export default async function SubmitProject() {
  // Middleware guards this route; ensureLocalUser also creates the local user
  // row (id = Clerk userId) so the submission FK (project.createdBy) is valid.
  const localUser = await ensureLocalUser()

  if (!localUser) {
    redirect("/sign-in")
  }
  const userId = localUser.id

  return (
    <div className="foundry-page min-h-[calc(100vh-5rem)]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="scroll-live mb-6 space-y-2 sm:mb-8">
          <p className="foundry-kicker">Launch gate</p>
          <h1 className="font-heading text-4xl font-black tracking-tight text-white sm:text-5xl">
            Submit a tool
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Share your project with the community. Fill in the details below.
          </p>
        </div>

        <div className="foundry-panel rounded-2xl">
          <div className="p-4 sm:p-6 md:p-8">
            <SubmitProjectForm userId={userId} />
          </div>
        </div>
      </div>
    </div>
  )
}
