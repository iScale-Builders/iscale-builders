import type { Metadata } from "next"
import Link from "next/link"

import { RiArrowRightLine, RiArrowUpLine, RiChat3Line } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { getProblems } from "@/app/actions/problems"

export const metadata: Metadata = {
  title: "Problems",
  description:
    "The demand side of iScaleXchange: ecommerce, print-on-demand, AI workflow, and business problems people need solved.",
  alternates: { canonical: "/problems" },
}

const STATUS_LABEL: Record<string, string> = {
  open: "Open",
  researching: "Researching",
  partially_solved: "Partially solved",
  solved: "Solved",
}

function excerpt(html: string, max = 180): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text
}

export default async function ProblemsPage() {
  const problems = await getProblems(60)

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
          <div className="pt-2">
            <Button asChild className="rounded-full">
              <Link href="/projects/submit?type=problem">
                Post a problem
                <RiArrowRightLine className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {problems.length === 0 ? (
          <div className="foundry-panel rounded-2xl p-8 text-center">
            <h2 className="text-foreground text-lg font-black">No problems posted yet</h2>
            <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6">
              Be the first to post what you're stuck on. The clearest, most-voted problems get
              solved first.
            </p>
            <Button asChild className="mt-5 rounded-full">
              <Link href="/projects/submit?type=problem">
                Post the first problem
                <RiArrowRightLine className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2">
            {problems.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="foundry-panel group flex flex-col rounded-2xl p-5 transition-all hover:-translate-y-0.5"
              >
                {p.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.logoUrl}
                    alt=""
                    className="border-border/60 mb-4 aspect-video w-full rounded-lg border object-cover"
                  />
                )}
                <div className="flex items-center gap-2">
                  <span className="border-border bg-muted text-foreground inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-black tracking-[0.14em] uppercase">
                    {STATUS_LABEL[p.problemStatus || "open"] || "Open"}
                  </span>
                  {p.categories.slice(0, 2).map((c) => (
                    <span key={c.id} className="text-muted-foreground text-xs">
                      {c.name}
                    </span>
                  ))}
                </div>
                <h2 className="text-foreground mt-3 text-lg font-black leading-snug group-hover:underline">
                  {p.name}
                </h2>
                <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-6">
                  {excerpt(p.description)}
                </p>
                <div className="text-muted-foreground mt-4 flex items-center gap-4 text-xs">
                  <span className="inline-flex items-center gap-1">
                    <RiArrowUpLine className="h-4 w-4" />
                    {p.upvoteCount}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <RiChat3Line className="h-4 w-4" />
                    {p.commentCount}
                  </span>
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  )
}
