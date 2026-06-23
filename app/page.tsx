import { Metadata } from "next"
import Link from "next/link"

import { auth } from "@clerk/nextjs/server"
import { RiArrowRightLine, RiSearchEyeLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { ExploreBrowser } from "@/components/explore/explore-browser"
import { ExploreHeroCard } from "@/components/explore/explore-hero-card"
import { galleryFor } from "@/components/explore/explore-view"
import { ToolCarousel } from "@/components/explore/tool-carousel"
import { getExploreProjects } from "@/app/actions/explore"
import type { ExploreProject } from "@/app/actions/explore"

export const metadata: Metadata = {
  title: { absolute: "iScaleBuilders — AI tools and workflows for builders" },
  description: "Discover AI tools, workflows, and resources from the iScaleBuilders community.",
  alternates: { canonical: "/" },
}

export default async function Home() {
  const projects = await getExploreProjects(60)
  const { userId } = await auth()
  const isAuthenticated = !!userId

  const featuredToolSlugs = ["promoteflow"]
  const availableToolSlugs = ["pintwist", "iscale-images", "iscale-etsy", "iscale-merch"]
  const top3 = featuredToolSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is ExploreProject => Boolean(p))
  const top3Ids = new Set(top3.map((p) => p.id))
  const pinnedAvailableTools = availableToolSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is ExploreProject => Boolean(p))
  const pinnedAvailableToolIds = new Set(pinnedAvailableTools.map((p) => p.id))
  const discussed = [
    ...pinnedAvailableTools,
    ...projects
      .filter((p) => !top3Ids.has(p.id) && !pinnedAvailableToolIds.has(p.id))
      .sort((a, b) => b.commentCount - a.commentCount),
  ].slice(0, 10)

  const heroProps = (p: ExploreProject) => ({
    slug: p.slug,
    name: p.name,
    description: p.description,
    images: galleryFor(p),
    category: p.categories[0]?.name,
    creatorName: p.creatorName,
    creatorImage: p.creatorImage,
    upvoteCount: p.upvoteCount,
    commentCount: p.commentCount,
  })

  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Headline */}
        <section className="mb-8 text-center">
          <p className="text-muted-foreground text-xs font-bold tracking-[0.22em] uppercase">
            iScaleBuilders
          </p>
          <h1 className="text-foreground mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl lg:whitespace-nowrap">
            Tools built by the people, for the people.
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base leading-7">
            AI tools, builder workflows, and community-made systems — curated by the iScale
            community.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="h-11 rounded-full px-6 font-semibold">
              <Link href="/explore">
                Explore tools
                <RiSearchEyeLine className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-full px-6 font-semibold">
              <Link href="/projects/submit">
                Submit a tool
                <RiArrowRightLine className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Top tools — full-width banner carousel, one at a time */}
        {top3.length > 0 && (
          <section className="mb-12">
            <ToolCarousel slideClassName="min-w-0 flex-[0_0_100%]" autoplayMs={7500} loop>
              {top3.map((p) => (
                <ExploreHeroCard key={p.id} {...heroProps(p)} />
              ))}
            </ToolCarousel>
          </section>
        )}

        {/* Most discussed — two banners side by side, auto-advancing */}
        {discussed.length > 0 && (
          <section className="mb-14">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-foreground text-lg font-bold">Most discussed</h2>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <Link href="/explore" className="flex items-center gap-1">
                  View all
                  <RiArrowRightLine className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <ToolCarousel
              slideClassName="min-w-0 flex-[0_0_100%] sm:flex-[0_0_49%]"
              autoplayMs={6250}
              loop
            >
              {discussed.map((p) => (
                <ExploreHeroCard
                  key={p.id}
                  {...heroProps(p)}
                  heightClassName="h-[260px] sm:h-[320px]"
                />
              ))}
            </ToolCarousel>
          </section>
        )}

        {/* Browse all */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-foreground mb-5 text-lg font-bold">Browse all tools</h2>
            <ExploreBrowser projects={projects} isAuthenticated={isAuthenticated} />
          </section>
        )}
      </div>
    </main>
  )
}
