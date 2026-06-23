"use client"

/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import { useRouter } from "next/navigation"

import { RiArrowRightLine, RiFireLine, RiMessage2Line } from "@remixicon/react"

import { CardImageCycler } from "@/components/explore/card-image-cycler"
import { UpvoteButton } from "@/components/project/upvote-button"

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

interface ExploreFeaturedCardProps {
  slug: string
  name: string
  description: string
  images: string[]
  category?: string
  creatorName?: string | null
  creatorImage?: string | null
  upvoteCount: number
  commentCount: number
  projectId: string
  userHasUpvoted?: boolean
  isAuthenticated?: boolean
}

// Vertical featured card: fixed-aspect auto-cycling thumbnail on top, details below.
export function ExploreFeaturedCard({
  slug,
  name,
  description,
  images,
  category,
  creatorName,
  creatorImage,
  upvoteCount,
  commentCount,
  projectId,
  userHasUpvoted = false,
  isAuthenticated = false,
}: ExploreFeaturedCardProps) {
  const router = useRouter()
  const url = `/projects/${slug}`

  return (
    <article
      onClick={() => router.push(url)}
      className="border-border bg-card text-card-foreground hover:border-foreground/30 group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border transition-colors"
    >
      <div className="bg-muted relative aspect-video w-full overflow-hidden">
        <CardImageCycler images={images} name={name} category={category} slug={slug} autoCycle />
        <div className="border-border bg-background/80 text-foreground absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur">
          <RiFireLine className="h-3.5 w-3.5" />
          Top tool
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        {category && (
          <span className="border-border text-muted-foreground inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
            {category}
          </span>
        )}
        <Link
          href={url}
          prefetch={false}
          onClick={(e) => e.stopPropagation()}
          className="text-card-foreground text-xl font-bold tracking-tight sm:text-2xl"
        >
          {name}
        </Link>
        <p className="text-muted-foreground line-clamp-2 text-sm leading-6">
          {stripHtml(description)}
        </p>

        <div className="mt-auto flex items-center gap-3 pt-1">
          <UpvoteButton
            projectId={projectId}
            initialUpvoted={userHasUpvoted}
            upvoteCount={upvoteCount}
            isAuthenticated={isAuthenticated}
            variant="compact"
            className="h-10 w-10"
          />
          <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
            <RiMessage2Line className="h-4 w-4" />
            {commentCount}
          </span>
          <span className="text-foreground ml-auto inline-flex items-center gap-1 text-sm font-semibold">
            Open
            <RiArrowRightLine className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>

        <div className="border-border flex items-center gap-2 border-t pt-3">
          {creatorImage ? (
            <img
              src={creatorImage}
              alt={creatorName ?? "Maker"}
              className="border-border h-6 w-6 rounded-full border object-cover"
            />
          ) : (
            <div className="bg-muted text-muted-foreground flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold">
              {(creatorName ?? "?").charAt(0)}
            </div>
          )}
          <span className="text-muted-foreground truncate text-xs">
            {creatorName ?? "Unknown maker"}
          </span>
        </div>
      </div>
    </article>
  )
}
