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
          <p className="foundry-kicker">Xchange gate</p>
          <h1 className="font-heading text-4xl font-black tracking-tight text-white sm:text-5xl">
            Post a problem or solution
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Every submission starts by choosing a lane. Problems show demand; solutions show what
            solves it.
          </p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <div className="foundry-panel rounded-2xl border-dashed p-4">
            <span className="border-border bg-muted text-foreground inline-flex rounded-full border px-3 py-1 text-xs font-black tracking-[0.14em] uppercase">
              Problem
            </span>
            <h2 className="text-foreground mt-3 text-base font-black">I need this solved</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Problem posting is the next lane. For now, bring problems to the community or include
              the problem context in a solution submission.
            </p>
          </div>
          <div className="foundry-panel rounded-2xl p-4 ring-1 ring-cyan-200/30">
            <span className="border-border bg-muted text-foreground inline-flex rounded-full border px-3 py-1 text-xs font-black tracking-[0.14em] uppercase">
              Solution
            </span>
            <h2 className="text-foreground mt-3 text-base font-black">
              I have something that solves it
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              The current form posts a solution tool. Connect it to the problem it solves in the
              description.
            </p>
          </div>
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
