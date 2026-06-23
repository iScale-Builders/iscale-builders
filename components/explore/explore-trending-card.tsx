"use client"

/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import { useRouter } from "next/navigation"

import { CardImageCycler } from "@/components/explore/card-image-cycler"
import { UpvoteButton } from "@/components/project/upvote-button"

interface ExploreTrendingCardProps {
  slug: string
  name: string
  description: string
  images: string[]
  launchStatus: string
  upvoteCount: number
  category?: string
  creatorName?: string | null
  creatorImage?: string | null
  projectId: string
  userHasUpvoted?: boolean
  isAuthenticated?: boolean
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

export function ExploreTrendingCard({
  slug,
  name,
  description,
  images,
  upvoteCount,
  category,
  creatorName,
  creatorImage,
  projectId,
  userHasUpvoted = false,
  isAuthenticated = false,
}: ExploreTrendingCardProps) {
  const router = useRouter()
  const projectPageUrl = `/projects/${slug}`

  return (
    <article
      onClick={() => router.push(projectPageUrl)}
      className="border-border bg-card hover:border-foreground/30 group flex w-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl border transition-colors"
    >
      <div className="bg-muted relative aspect-[16/9] w-full overflow-hidden">
        <CardImageCycler images={images} name={name} category={category} slug={slug} compact />
        <div className="border-border bg-background/80 text-muted-foreground absolute top-2 left-2 rounded-full border px-2 py-0.5 text-[11px] font-semibold backdrop-blur">
          Coming soon
        </div>
        {/* Upvote (works for coming-soon too) */}
        <UpvoteButton
          projectId={projectId}
          initialUpvoted={userHasUpvoted}
          upvoteCount={upvoteCount}
          isAuthenticated={isAuthenticated}
          variant="compact"
          className="bg-background/85 border-border absolute top-2 right-2 h-11 w-11 backdrop-blur"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link
          href={projectPageUrl}
          prefetch={false}
          onClick={(e) => e.stopPropagation()}
          className="font-heading text-foreground group-hover:text-foreground line-clamp-1 text-sm font-bold"
        >
          {name}
        </Link>
        <p className="text-muted-foreground line-clamp-2 text-xs">{stripHtml(description)}</p>
        {category && (
          <span className="border-border text-muted-foreground inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[11px] font-medium">
            {category}
          </span>
        )}
        {/* Posted by */}
        <div className="border-border mt-auto flex items-center gap-1.5 border-t pt-2">
          {creatorImage ? (
            <img
              src={creatorImage}
              alt={creatorName ?? "Maker"}
              className="border-border h-5 w-5 flex-shrink-0 rounded-full border object-cover"
            />
          ) : (
            <div className="bg-muted text-muted-foreground flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
              {(creatorName ?? "?").charAt(0)}
            </div>
          )}
          <span className="text-muted-foreground truncate text-[11px]">
            {creatorName ?? "Unknown maker"}
          </span>
        </div>
      </div>
    </article>
  )
}
