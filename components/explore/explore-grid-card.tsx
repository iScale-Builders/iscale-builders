"use client"

/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import { useRouter } from "next/navigation"

import { RiFlashlightLine, RiMessage2Line } from "@remixicon/react"

import { CardImageCycler } from "@/components/explore/card-image-cycler"
import { UpvoteButton } from "@/components/project/upvote-button"

interface Category {
  id: string
  name: string
}

interface ExploreGridCardProps {
  slug: string
  name: string
  description: string
  images: string[]
  launchStatus: string
  upvoteCount: number
  commentCount: number
  categories: Category[]
  creatorName: string | null
  creatorImage: string | null
  projectId: string
  userHasUpvoted?: boolean
  isAuthenticated?: boolean
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

function statusLabel(status: string): string {
  if (status === "scheduled") return "Coming soon"
  if (status === "ongoing") return "Live"
  return "Available"
}

export function ExploreGridCard({
  slug,
  name,
  description,
  images,
  launchStatus,
  upvoteCount,
  commentCount,
  categories,
  creatorName,
  creatorImage,
  projectId,
  userHasUpvoted = false,
  isAuthenticated = false,
}: ExploreGridCardProps) {
  const router = useRouter()
  const projectPageUrl = `/projects/${slug}`

  return (
    <article
      onClick={() => router.push(projectPageUrl)}
      className="foundry-card ai-tool-card group flex cursor-pointer flex-col overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="bg-muted relative aspect-[16/10] w-full overflow-hidden">
        <CardImageCycler
          images={images}
          name={name}
          category={categories[0]?.name}
          slug={slug}
          autoCycle
        />
        <div className="ai-card-scan" aria-hidden="true" />
        <div className="bg-muted/80 text-muted-foreground border-border absolute right-3 bottom-3 left-3 flex items-center justify-between rounded-full border px-3 py-1 text-[10px] font-black tracking-[0.12em] uppercase opacity-0 backdrop-blur-xl transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex items-center gap-1.5">
            <RiFlashlightLine className="text-foreground h-3 w-3" />
            Signal locked
          </span>
          <span>Queued</span>
        </div>
        {/* Upvote (works for coming-soon too) */}
        <UpvoteButton
          projectId={projectId}
          initialUpvoted={userHasUpvoted}
          upvoteCount={upvoteCount}
          isAuthenticated={isAuthenticated}
          variant="compact"
          className="bg-background/85 border-border absolute top-2 right-2 backdrop-blur"
        />
        <div className="border-border bg-muted text-foreground absolute top-2 left-2 rounded-full border px-2 py-1 text-xs font-black backdrop-blur-xl">
          {statusLabel(launchStatus)}
        </div>
      </div>

      {/* Body */}
      <div className="relative flex flex-1 flex-col gap-2 p-4">
        <div className="ai-card-rail" aria-hidden="true" />
        <Link
          href={projectPageUrl}
          prefetch={false}
          onClick={(e) => e.stopPropagation()}
          className="font-heading text-foreground group-hover:text-foreground line-clamp-1 text-base font-black transition-colors"
        >
          {name}
        </Link>

        <p className="text-muted-foreground line-clamp-2 text-sm">{stripHtml(description)}</p>

        {categories.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {categories.slice(0, 2).map((cat) => (
              <Link
                key={cat.id}
                href={`/categories?category=${cat.id}`}
                prefetch={false}
                onClick={(e) => e.stopPropagation()}
                className="border-border bg-muted text-foreground hover:bg-muted inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Footer: maker + comments */}
        <div className="border-border mt-auto flex items-center justify-between border-t pt-3">
          <div className="flex min-w-0 items-center gap-2">
            {creatorImage ? (
              <img
                src={creatorImage}
                alt={creatorName ?? "Maker"}
                className="border-border h-6 w-6 flex-shrink-0 rounded-full border object-cover"
              />
            ) : (
              <div className="bg-muted border-border text-foreground flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-xs font-black">
                {(creatorName ?? "?").charAt(0)}
              </div>
            )}
            <span className="text-muted-foreground truncate text-xs">
              {creatorName ?? "Unknown maker"}
            </span>
          </div>
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <RiMessage2Line className="h-3.5 w-3.5" />
            {commentCount}
          </div>
        </div>
      </div>
    </article>
  )
}
