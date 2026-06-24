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
  ].slice(0, 5)

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
          <h1 className="text-foreground text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl lg:whitespace-nowrap">
            Post the problem. Exchange the solution.
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 text-base leading-7 lg:whitespace-nowrap">
            Post problems, vote on what matters, and connect the tools that solve them.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="h-11 rounded-full px-6 font-semibold">
              <Link href="/problems">
                Problems
                <RiArrowRightLine className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild className="h-11 rounded-full px-6 font-semibold">
              <Link href="/solutions">
                Solutions
                <RiArrowRightLine className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-full px-6 font-semibold">
              <Link href="/projects/submit">Post a problem or solution</Link>
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
