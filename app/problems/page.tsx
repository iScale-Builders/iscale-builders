import type { Metadata } from "next"
import Link from "next/link"

import { RiArrowRightLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Problems",
  description:
    "The demand side of iScaleXchange: ecommerce, print-on-demand, AI workflow, and business problems people need solved.",
  alternates: { canonical: "/problems" },
}

const problemTypes = [
  "Research blockers",
  "Listing workflow problems",
  "Image production problems",
  "Traffic and content problems",
  "Automation gaps",
  "Decision and analytics problems",
]

export default function ProblemsPage() {
  return (
    <main className="bg-background min-h-screen">
      <div className="foundry-container">
        <section className="scroll-live mb-8 max-w-3xl space-y-3">
          <p className="foundry-kicker">Problems</p>
          <h1 className="font-heading text-foreground text-4xl font-black tracking-tight sm:text-5xl">
            What needs solving?
          </h1>
          <p className="text-muted-foreground text-sm leading-6 sm:text-base">
            Problems are the demand side of iScaleXchange. They show what people are stuck on, what
            hurts enough to vote for, and what deserves a solution.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="border-border bg-muted text-foreground rounded-full border px-3 py-1 text-xs font-black tracking-[0.14em] uppercase">
              Open
            </span>
            <span className="border-border bg-muted text-foreground rounded-full border px-3 py-1 text-xs font-black tracking-[0.14em] uppercase">
              Researching
            </span>
            <span className="border-border bg-muted text-foreground rounded-full border px-3 py-1 text-xs font-black tracking-[0.14em] uppercase">
              Solved
            </span>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="foundry-panel rounded-2xl p-5">
            <span className="border-border bg-muted text-foreground inline-flex rounded-full border px-3 py-1 text-xs font-black tracking-[0.14em] uppercase">
              Problem lane
            </span>
            <h2 className="text-foreground mt-4 text-xl font-black">Post what you cannot solve</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              The first dedicated problem-posting form is next. The important rule is already set: a
              submission starts as either a problem or a solution.
            </p>
            <Button asChild className="mt-5 rounded-full">
              <Link href="/projects/submit">
                Start from submit
                <RiArrowRightLine className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="foundry-panel rounded-2xl p-5">
            <span className="border-border bg-muted text-foreground inline-flex rounded-full border px-3 py-1 text-xs font-black tracking-[0.14em] uppercase">
              Demand signals
            </span>
            <h2 className="text-foreground mt-4 text-xl font-black">Upvotes show what matters</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              Problems should become the build queue, content queue, and sponsor map. The highest
              demand problems tell the ecosystem what to solve next.
            </p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-heading text-foreground mb-4 text-xl font-black">
            Problem categories
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {problemTypes.map((type) => (
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
