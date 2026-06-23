"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { RiExternalLinkLine } from "@remixicon/react"

import { getProjectWebsiteRelAttribute } from "@/lib/link-utils"

import { ProjectCardButtons } from "./project-card-buttons"

// Function to strip HTML tags from text
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

function statusLabel(status: string): string {
  if (status === "scheduled") return "Coming soon"
  if (status === "ongoing") return "Live"
  return "Available"
}

interface Category {
  id: string
  name: string
}

interface ProjectCardProps {
  id: string
  slug: string
  name: string
  description: string
  logoUrl: string
  upvoteCount: number
  commentCount: number
  launchStatus: string
  launchType?: string | null
  dailyRanking?: number | null
  index?: number
  userHasUpvoted: boolean
  categories: Category[]
  isAuthenticated: boolean
  websiteUrl?: string
}

export function ProjectCard({
  id,
  slug,
  name,
  description,
  logoUrl,
  upvoteCount,
  commentCount,
  launchStatus,
  launchType,
  dailyRanking,
  index,
  userHasUpvoted,
  categories,
  isAuthenticated,
  websiteUrl,
}: ProjectCardProps) {
  const router = useRouter()
  const projectPageUrl = `/projects/${slug}`
  const logoIsUploadedDataImage = logoUrl?.startsWith("data:image/")

  return (
    <div
      className="foundry-card group mx-3 cursor-pointer rounded-xl p-3 transition-all duration-300 hover:-translate-y-0.5 sm:mx-4 sm:p-4"
      onClick={(e) => {
        e.stopPropagation()
        router.push(projectPageUrl)
      }}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex-shrink-0">
          <div className="bg-muted border-border relative h-12 w-12 overflow-hidden rounded-lg border sm:h-14 sm:w-14">
            {logoUrl && logoIsUploadedDataImage ? (
              <img src={logoUrl} alt={`${name} logo`} className="h-full w-full object-contain" />
            ) : logoUrl ? (
              <Image
                src={logoUrl}
                alt={`${name} logo`}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 48px, 56px"
              />
            ) : (
              <span className="text-muted-foreground flex h-full w-full items-center justify-center text-xl font-bold">
                {name.charAt(0)}
              </span>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-grow">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <Link href={projectPageUrl} prefetch={false}>
                <h3 className="text-foreground group-hover:text-foreground line-clamp-1 text-sm font-black transition-colors sm:text-base">
                  {typeof index === "number" ? `${index + 1}. ` : ""}
                  {name}
                </h3>
              </Link>
              <span className="border-border bg-muted text-foreground rounded-full border px-2 py-0.5 text-[10px] font-black">
                {statusLabel(launchStatus)}
              </span>
            </div>

            <p className="text-muted-foreground mb-1 line-clamp-2 text-xs sm:line-clamp-1 sm:text-sm">
              {stripHtml(description)}
            </p>

            {categories.length > 0 && (
              <div className="text-muted-foreground mt-1 hidden flex-wrap items-center gap-1.5 text-xs sm:flex">
                {categories.slice(0, 3).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories?category=${cat.id}`}
                    prefetch={false}
                    className="border-border bg-muted text-foreground hover:bg-muted inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-bold transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <ProjectCardButtons
          projectPageUrl={projectPageUrl}
          commentCount={commentCount}
          projectId={id}
          upvoteCount={upvoteCount}
          isAuthenticated={isAuthenticated}
          hasUpvoted={userHasUpvoted}
          launchStatus="scheduled"
          projectName={name}
        />
      </div>
    </div>
  )
}
