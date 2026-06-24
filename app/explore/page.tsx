import { Metadata } from "next"

import { auth } from "@clerk/nextjs/server"

import { ExploreView } from "@/components/explore/explore-view"
import { AICommandRibbon } from "@/components/shared/ai-command-ribbon"
import { getExploreProjects } from "@/app/actions/explore"

export const metadata: Metadata = {
  title: "Explore Solutions",
  description:
    "Browse solution tools, workflows, and resources mapped to real ecommerce, print-on-demand, and AI workflow problems.",
  alternates: { canonical: "/explore" },
}

export default async function ExplorePage() {
  const projects = await getExploreProjects(60)
  const { userId } = await auth()
  const isAuthenticated = !!userId
  const categoryCount = new Set(
    projects.flatMap((project) => project.categories.map((category) => category.id)),
  ).size

  return (
    <main className="bg-background min-h-screen">
      <div className="foundry-container">
        {/* Page heading */}
        <div className="scroll-live mb-8 flex flex-col gap-2">
          <p className="foundry-kicker">Solution radar</p>
          <h1 className="font-heading text-foreground text-4xl font-black tracking-tight sm:text-5xl">
            Explore the exchange
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
            A visual tour of solution tools, workflows, and resources connected to real problems.
          </p>
        </div>

        <AICommandRibbon
          toolsCount={projects.length}
          categoriesCount={categoryCount}
          mode="compact"
        />

        <ExploreView projects={projects} isAuthenticated={isAuthenticated} />
      </div>
    </main>
  )
}
