import { Metadata } from "next"
import Link from "next/link"

import { auth } from "@clerk/nextjs/server"
import { RiArrowRightLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { ExploreBrowser } from "@/components/explore/explore-browser"
import { ExploreHeroCard } from "@/components/explore/explore-hero-card"
import { galleryFor } from "@/components/explore/explore-view"
import { ToolCarousel } from "@/components/explore/tool-carousel"
import { getExploreProjects } from "@/app/actions/explore"
import type { ExploreProject } from "@/app/actions/explore"

export const metadata: Metadata = {
  title: { absolute: "iScaleXchange — Post the problem. Exchange the solution." },
  description:
    "Post problems, discover solutions, and connect tools to the real online business problems they solve.",
  alternates: { canonical: "/" },
}

export default async function Home() {
  const projects = await getExploreProjects(60)
  const { userId } = await auth()
  const isAuthenticated = !!userId

  // One condensed featured rail: pinned launches first, then most-discussed.
  const pinnedSlugs = ["promoteflow", "pintwist", "iscale-images", "iscale-etsy", "iscale-merch"]
  const pinned = pinnedSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is ExploreProject => Boolean(p))
  const pinnedIds = new Set(pinned.map((p) => p.id))
  const featured = [
    ...pinned,
    ...projects
      .filter((p) => !pinnedIds.has(p.id))
      .sort((a, b) => b.commentCount - a.commentCount),
  ].slice(0, 8)

  const heroProps = (p: ExploreProject) => ({
    slug: p.slug,
    name: p.name,
    description: p.description,
    images: galleryFor(p),
    launchStatus: p.launchStatus,
    category: p.categories[0]?.name,
    creatorName: p.creatorName,
    creatorImage: p.creatorImage,
    upvoteCount: p.upvoteCount,
    commentCount: p.commentCount,
  })

  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Hero — headline + the problem/solution split, all condensed at the top */}
        <section className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-muted-foreground text-xs font-bold tracking-[0.22em] uppercase">
            iScaleXchange
          </p>
          <h1 className="text-foreground mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl lg:whitespace-nowrap">
            Post the problem. Exchange the solution.
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base leading-7">
            A living exchange where people surface what they cannot solve, vote on what matters, and
            connect the tools, workflows, and guides that fix it.
          </p>

          {/* The two sides of the exchange, side by side */}
          <div className="mx-auto mt-7 grid max-w-2xl gap-3 sm:grid-cols-2">
            <Link
              href="/problems"
              prefetch={false}
              className="foundry-panel group rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="border-border bg-muted text-foreground inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-black tracking-[0.14em] uppercase">
                  Problems
                </span>
                <RiArrowRightLine className="text-muted-foreground h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-foreground mt-3 text-base font-black">What needs solving?</p>
              <p className="text-muted-foreground mt-1 text-xs leading-5">
                Pain points and blockers people vote up.
              </p>
            </Link>

            <Link
              href="/solutions"
              prefetch={false}
              className="foundry-panel group rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="border-border bg-muted text-foreground inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-black tracking-[0.14em] uppercase">
                  Solutions
                </span>
                <RiArrowRightLine className="text-muted-foreground h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-foreground mt-3 text-base font-black">What solves it?</p>
              <p className="text-muted-foreground mt-1 text-xs leading-5">
                Tools, workflows, and guides mapped to problems.
              </p>
            </Link>
          </div>

          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="h-11 rounded-full px-6 font-semibold">
              <Link href="/projects/submit">
                Post a problem or solution
                <RiArrowRightLine className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-11 rounded-full px-6 font-semibold">
              <Link href="/explore">Explore everything</Link>
            </Button>
          </div>
        </section>

        {/* Featured — full-width top listing, one at a time */}
        {featured.length > 0 && (
          <section className="mb-12">
            <ToolCarousel slideClassName="min-w-0 flex-[0_0_100%]" autoplayMs={7500} loop>
              {featured.map((p) => (
                <ExploreHeroCard key={p.id} {...heroProps(p)} />
              ))}
            </ToolCarousel>
          </section>
        )}

        {/* Browse all */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-foreground mb-5 text-lg font-bold">Browse solutions</h2>
            <ExploreBrowser projects={projects} isAuthenticated={isAuthenticated} />
          </section>
        )}
      </div>
    </main>
  )
}
