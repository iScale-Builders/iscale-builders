"use client"

/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation"

import { RiArrowRightLine, RiChat3Line, RiFireLine, RiThumbUpLine } from "@remixicon/react"

import { ToolThumbnail } from "@/components/shared/tool-thumbnail"

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

interface ExploreHeroCardProps {
  slug: string
  name: string
  description: string
  images: string[]
  category?: string
  creatorName?: string | null
  creatorImage?: string | null
  upvoteCount?: number
  commentCount?: number
  heightClassName?: string
}

// Full-width hero banner: the tool's thumbnail fills the row (whole image shown
// via a contained image over a blurred fill), with title + description overlaid.
export function ExploreHeroCard({
  slug,
  name,
  description,
  images,
  category,
  creatorName,
  creatorImage,
  upvoteCount = 0,
  commentCount = 0,
  heightClassName = "h-[360px] sm:h-[460px]",
}: ExploreHeroCardProps) {
  const router = useRouter()
  const url = `/projects/${slug}`
  const img = images[0]

  return (
    <article
      onClick={() => router.push(url)}
      className={`group relative block w-full cursor-pointer overflow-hidden rounded-2xl bg-neutral-900 ${heightClassName}`}
    >
      {img ? (
        <>
          {/* blurred fill so the sides aren't flat-empty (decorative — low priority
              so it doesn't steal bandwidth from the LCP image) */}
          <img
            src={img}
            alt=""
            aria-hidden="true"
            fetchPriority="low"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-2xl"
          />
          {/* the WHOLE thumbnail, never cropped. This is the hero LCP element —
              eager + high fetch priority so it paints fast. */}
          <img
            src={img}
            alt={name}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </>
      ) : (
        <ToolThumbnail
          name={name}
          category={category}
          slug={slug}
          className="absolute inset-0 h-full w-full"
        />
      )}

      {/* legibility scrim */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

      {/* overlaid title + description */}
      <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-3 p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            <RiFireLine className="h-3 w-3" />
            Top tool
          </span>
          {category && (
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur">
              {category}
            </span>
          )}
        </div>
        <h2 className="font-heading text-2xl font-black tracking-tight text-white sm:text-4xl">
          {name}
        </h2>
        <p className="line-clamp-2 max-w-2xl text-sm text-white/85 sm:text-base">
          {stripHtml(description)}
        </p>
        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs font-semibold text-white/90 sm:text-sm">
            <div className="flex min-w-0 items-center gap-2">
              {creatorImage ? (
                <img
                  src={creatorImage}
                  alt={creatorName ?? "Maker"}
                  className="h-7 w-7 flex-shrink-0 rounded-full border border-white/25 object-cover"
                />
              ) : (
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/15 text-[11px] font-black text-white">
                  {(creatorName ?? "?").charAt(0)}
                </div>
              )}
              <span className="min-w-0 truncate">{creatorName ?? "Unknown maker"}</span>
            </div>
            <span className="hidden h-1 w-1 rounded-full bg-white/50 sm:inline-flex" />
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 backdrop-blur">
              <RiThumbUpLine className="h-3.5 w-3.5" />
              {upvoteCount}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 backdrop-blur">
              <RiChat3Line className="h-3.5 w-3.5" />
              {commentCount}
            </span>
          </div>
          <span className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-white">
            View tool
            <RiArrowRightLine className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  )
}
