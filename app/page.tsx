import { Metadata } from "next"

import { auth } from "@clerk/nextjs/server"

import { ExploreBrowser } from "@/components/explore/explore-browser"
import { ExploreHeroCard } from "@/components/explore/explore-hero-card"
import { galleryFor } from "@/components/explore/explore-view"
import { ToolCarousel } from "@/components/explore/tool-carousel"
import { HeroNetwork } from "@/components/home/hero-network"
import { getExploreProjects } from "@/app/actions/explore"
import type { ExploreProject } from "@/app/actions/explore"

export const metadata: Metadata = {
  title: { absolute: "iScaleXchange — Post the problem. Exchange the solution." },
  description:
    "Post problems, discover solutions, and connect tools to the real online business problems they solve.",
  alternates: { canonical: "/" },
}

export default async function Home() {
  // Degrade gracefully if the data layer is unavailable instead of 500-ing the
  // homepage; app/error.tsx is the backstop for any other render failure.
  let projects: ExploreProject[] = []
  try {
    projects = await getExploreProjects(60)
  } catch (error) {
    console.error("Home: failed to load explore projects:", error)
  }
  const { userId } = await auth()
  const isAuthenticated = !!userId

  // Carousel rail: all apps marked "available" (upvote-ordered from getExploreProjects).
  const featured = projects.filter((p) => p.availability === "available")

  const heroProps = (p: ExploreProject) => ({
    slug: p.slug,
    name: p.name,
    description: p.description,
    images: galleryFor(p),
    launchStatus: p.launchStatus,
    websiteUrl: p.websiteUrl,
    submissionType: p.submissionType,
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
        <section className="relative isolate mx-auto mb-12 max-w-5xl px-4 py-8 text-center">
          <HeroNetwork />
          <div className="relative z-10">
            <h1 className="text-foreground text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl lg:whitespace-nowrap">
              Where Problems Meet Solutions
            </h1>
            <p className="text-muted-foreground mx-auto mt-4 text-base leading-7 lg:whitespace-nowrap">
              A two-way marketplace for challenges and the people who solve them.
            </p>
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
