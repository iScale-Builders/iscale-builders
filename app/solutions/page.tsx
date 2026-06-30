import type { Metadata } from "next"
import Link from "next/link"

import { RiArrowRightLine, RiArrowUpLine, RiChat3Line } from "@remixicon/react"

import { toolStatusLabel } from "@/lib/tool-status"
import { Button } from "@/components/ui/button"
import { getSolutions } from "@/app/actions/solutions"

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "The supply side of iScaleXchange: tools, workflows, guides, services, and answers connected to real problems.",
  alternates: { canonical: "/solutions" },
}

function excerpt(html: string, max = 180): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text
}

export default async function SolutionsPage() {
  const solutions = await getSolutions(60)

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
          <div className="pt-2">
            <Button asChild className="rounded-full">
              <Link href="/projects/submit?type=solution">
                Post a solution
                <RiArrowRightLine className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {solutions.length === 0 ? (
          <div className="foundry-panel rounded-2xl p-8 text-center">
            <h2 className="text-foreground text-lg font-black">No solutions posted yet</h2>
            <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6">
              Be the first to post a tool, workflow, guide, template, or service.
            </p>
            <Button asChild className="mt-5 rounded-full">
              <Link href="/projects/submit?type=solution">
                Post the first solution
                <RiArrowRightLine className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s) => (
              <Link
                key={s.id}
                href={`/projects/${s.slug}`}
                className="foundry-panel group flex flex-col rounded-2xl p-5 transition-all hover:-translate-y-0.5"
              >
                {s.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.logoUrl}
                    alt=""
                    className="border-border/60 mb-4 aspect-video w-full rounded-lg border object-cover"
                  />
                )}
                <div className="flex items-center gap-2">
                  <span className="border-border bg-muted text-foreground inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-black tracking-[0.14em] uppercase">
                    {toolStatusLabel(s.launchStatus, s.websiteUrl)}
                  </span>
                  {s.categories.slice(0, 2).map((c) => (
                    <span key={c.id} className="text-muted-foreground text-xs">
                      {c.name}
                    </span>
                  ))}
                </div>
                <h2 className="text-foreground mt-3 text-lg font-black leading-snug group-hover:underline">
                  {s.name}
                </h2>
                <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-6">
                  {excerpt(s.description)}
                </p>
                <div className="text-muted-foreground mt-4 flex items-center gap-4 text-xs">
                  <span className="inline-flex items-center gap-1">
                    <RiArrowUpLine className="h-4 w-4" />
                    {s.upvoteCount}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <RiChat3Line className="h-4 w-4" />
                    {s.commentCount}
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
