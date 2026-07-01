import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { RiArrowLeftLine } from "@remixicon/react"

import { getSyncedCurrentUserId } from "@/lib/ensure-user"
import { getProjectBySlug } from "@/app/actions/project-details"

import { BadgesDisplay } from "../../../../components/badges/BadgesDisplay"

interface BadgesPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BadgesPageProps): Promise<Metadata> {
  const { slug } = await params
  const projectData = await getProjectBySlug(slug)

  if (!projectData) {
    return {
      title: "Project Not Found",
    }
  }

  return {
    title: `${projectData.name} - Badges | iScaleXchange`,
    description: "Get your iScaleXchange achievement badges",
  }
}

export default async function BadgesPage({ params }: BadgesPageProps) {
  const { slug } = await params
  const projectData = await getProjectBySlug(slug)

  if (!projectData) {
    notFound()
  }

  const currentUserId = await getSyncedCurrentUserId()

  const isOwner = currentUserId === projectData.createdBy

  if (!isOwner || !projectData.dailyRanking || projectData.dailyRanking > 3) {
    notFound()
  }

  return (
    <div className="foundry-page flex min-h-screen flex-col items-center">
      <div className="foundry-container w-full max-w-4xl">
        <div className="mb-6">
          <Link
            href={`/projects/${projectData.slug}`}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
          >
            <RiArrowLeftLine className="h-4 w-4" />
            Back to project
          </Link>
        </div>

        <div className="foundry-panel flex flex-col gap-6 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-lg font-black text-foreground sm:text-3xl">Your Achievement Badges</h1>
          </div>

          <p className="text-muted-foreground text-sm sm:text-base">
            Congratulations on making it to the top {projectData.dailyRanking}! Display this badge
            on your website to showcase your achievement.
          </p>

          <BadgesDisplay dailyRanking={projectData.dailyRanking} slug={projectData.slug} />
        </div>
      </div>
    </div>
  )
}
