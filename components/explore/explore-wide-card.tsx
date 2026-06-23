"use client"

/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import { useRouter } from "next/navigation"

import { RiArrowRightLine, RiChat3Line, RiFireLine } from "@remixicon/react"

import { CardImageCycler } from "@/components/explore/card-image-cycler"
import { UpvoteButton } from "@/components/project/upvote-button"

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

interface ExploreWideCardProps {
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

// Landscape split card: LEFT = auto-cycling thumbnail on top + a comments strip
// under it; RIGHT = the big details panel.
export function ExploreWideCard({
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
}: ExploreWideCardProps) {
  const router = useRouter()
  const url = `/projects/${slug}`

  return (
    <article
      onClick={() => router.push(url)}
      className="border-border bg-card text-card-foreground hover:border-foreground/30 group grid h-full cursor-pointer grid-cols-1 overflow-hidden rounded-xl border transition-colors sm:grid-cols-2"
    >
      {/* LEFT: thumbnail on top, comments underneath */}
      <div className="border-border flex flex-col border-b sm:border-r sm:border-b-0">
        <div className="bg-muted relative aspect-video w-full overflow-hidden">
          <CardImageCycler images={images} name={name} category={category} slug={slug} autoCycle />
          <div className="border-border bg-background/80 text-muted-foreground absolute top-2 left-2 rounded-full border px-2 py-0.5 text-[11px] font-semibold backdrop-blur">
            Coming soon
          </div>
        </div>
        <div className="bg-muted/30 flex flex-1 flex-col gap-1 p-3">
          <div className="text-foreground flex items-center gap-1.5 text-sm font-semibold">
            <RiChat3Line className="h-4 w-4" />
            {commentCount} {commentCount === 1 ? "comment" : "comments"}
          </div>
          <p className="text-muted-foreground text-xs">
            {commentCount > 0
              ? "Open to read the discussion and join in."
              : "Be the first to comment on this tool."}
          </p>
        </div>
      </div>

      {/* RIGHT: details */}
      <div className="flex flex-col gap-2 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          {category && (
            <span className="border-border text-muted-foreground inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[11px] font-medium">
              {category}
            </span>
          )}
          <span className="text-muted-foreground inline-flex items-center gap-1 text-[11px] font-semibold">
            <RiFireLine className="h-3 w-3" />
            Top
          </span>
        </div>

        <Link
          href={url}
          prefetch={false}
          onClick={(e) => e.stopPropagation()}
          className="font-heading text-card-foreground line-clamp-1 text-lg font-bold"
        >
          {name}
        </Link>

        <p className="text-muted-foreground line-clamp-3 text-sm leading-6">
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
