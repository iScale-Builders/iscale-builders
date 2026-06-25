import Link from "next/link"
import { redirect } from "next/navigation"

import { RiArrowRightLine } from "@remixicon/react"

import { ensureLocalUser } from "@/lib/ensure-user"
import { SubmitProjectForm } from "@/components/project/submit-form"
import { SubmitProblemForm } from "@/components/project/submit-problem-form"

export default async function SubmitProject({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  // Middleware guards this route; ensureLocalUser also creates the local user
  // row (id = Clerk userId) so the submission FK (project.createdBy) is valid.
  const localUser = await ensureLocalUser()

  if (!localUser) {
    redirect("/sign-in")
  }

  const { type } = await searchParams
  const mode = type === "problem" ? "problem" : type === "solution" ? "solution" : "choose"

  const heading =
    mode === "problem"
      ? "Post a problem"
      : mode === "solution"
        ? "Post a solution"
        : "Post a problem or solution"
  const sub =
    mode === "problem"
      ? "Tell the exchange what you're stuck on. The clearest, most-voted problems get solved first."
      : mode === "solution"
        ? "Share something that solves a real problem — a tool, workflow, guide, template, or service."
        : "Every submission starts by choosing a lane. Problems show demand; solutions show what solves it."

  return (
    <div className="foundry-page min-h-[calc(100vh-5rem)]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="scroll-live mb-6 space-y-2 sm:mb-8">
          <p className="foundry-kicker">Xchange gate</p>
          <h1 className="font-heading text-4xl font-black tracking-tight text-white sm:text-5xl">
            {heading}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">{sub}</p>
        </div>

        {mode === "choose" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/projects/submit?type=problem"
              className="foundry-panel group rounded-2xl p-5 transition-all hover:-translate-y-0.5"
            >
              <span
                className="border-border bg-muted inline-flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
                aria-label="Problem"
                title="Problem"
              >
                🙁
              </span>
              <h2 className="text-foreground mt-4 text-lg font-black">I need this solved</h2>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                Post something you're stuck on. Describe the pain, who has it, and what you've
                tried.
              </p>
              <span className="text-foreground mt-4 inline-flex items-center gap-1 text-sm font-black">
                Post a problem
                <RiArrowRightLine className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>

            <Link
              href="/projects/submit?type=solution"
              className="foundry-panel group rounded-2xl p-5 transition-all hover:-translate-y-0.5"
            >
              <span
                className="border-border bg-muted inline-flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
                aria-label="Solution"
                title="Solution"
              >
                🙂
              </span>
              <h2 className="text-foreground mt-4 text-lg font-black">
                I&apos;m solving a problem
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                Post a tool, workflow, guide, template, or service and describe the problem it
                solves — even if no one has posted that problem yet.
              </p>
              <span className="text-foreground mt-4 inline-flex items-center gap-1 text-sm font-black">
                Post a solution
                <RiArrowRightLine className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <Link
                href="/projects/submit"
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ← Choose a different lane
              </Link>
            </div>
            <div className="foundry-panel rounded-2xl">
              <div className="p-4 sm:p-6 md:p-8">
                {mode === "problem" ? <SubmitProblemForm /> : <SubmitProjectForm />}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
