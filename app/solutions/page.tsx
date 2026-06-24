import type { Metadata } from "next"
import Link from "next/link"

import { RiArrowRightLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "The supply side of iScaleXchange: tools, workflows, guides, services, and answers connected to real problems.",
  alternates: { canonical: "/solutions" },
}

const solutionTypes = ["Tool", "Workflow", "Guide", "Template", "Service", "Sponsored Solution"]

export default function SolutionsPage() {
  return (
    <main className="bg-background min-h-screen">
      <div className="foundry-container">
        <section className="scroll-live mb-8 max-w-3xl space-y-3">
          <p className="foundry-kicker">Solutions</p>
          <h1 className="font-heading text-foreground text-4xl font-black tracking-tight sm:text-5xl">
            What solves it?
          </h1>
          <p className="text-muted-foreground text-sm leading-6 sm:text-base">
            Solutions are the supply side of iScaleXchange. A solution can be a tool, workflow,
            guide, service, template, or answer, but it should always connect back to a real
            problem.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {solutionTypes.slice(0, 4).map((type) => (
              <span
                key={type}
                className="border-border bg-muted text-foreground rounded-full border px-3 py-1 text-xs font-black tracking-[0.14em] uppercase"
              >
                {type}
              </span>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="foundry-panel rounded-2xl p-5">
            <span className="border-border bg-muted text-foreground inline-flex rounded-full border px-3 py-1 text-xs font-black tracking-[0.14em] uppercase">
              Solution lane
            </span>
            <h2 className="text-foreground mt-4 text-xl font-black">
              Submit what solves a problem
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              Existing tool submissions now act as solution submissions. The next layer is linking
              every solution directly to one or more problems.
            </p>
            <Button asChild className="mt-5 rounded-full">
              <Link href="/projects/submit">
                Post a solution
                <RiArrowRightLine className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="foundry-panel rounded-2xl p-5">
            <span className="border-border bg-muted text-foreground inline-flex rounded-full border px-3 py-1 text-xs font-black tracking-[0.14em] uppercase">
              Sponsored solution
            </span>
            <h2 className="text-foreground mt-4 text-xl font-black">
              Sponsors should solve something
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              ReadyPixl belongs on image-editing problems because sponsorship should be contextual:
              the sponsor appears where it genuinely solves the problem.
            </p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-heading text-foreground mb-4 text-xl font-black">Solution types</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {solutionTypes.map((type) => (
              <div key={type} className="foundry-panel rounded-xl px-4 py-3">
                <span className="text-foreground text-sm font-bold">{type}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
