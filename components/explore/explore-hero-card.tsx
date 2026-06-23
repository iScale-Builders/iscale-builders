"use client"

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { RiArrowRightLine, RiChat3Line, RiFireLine, RiThumbUpLine } from "@remixicon/react"

import { subscribeTick } from "@/lib/sync-tick"
import { toolStatusLabel } from "@/lib/tool-status"
import { ToolThumbnail } from "@/components/shared/tool-thumbnail"

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

interface ExploreHeroCardProps {
  slug: string
  name: string
  description: string
  images: string[]
  launchStatus: string
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
  launchStatus,
  category,
  creatorName,
  creatorImage,
  upvoteCount = 0,
  commentCount = 0,
  heightClassName = "h-[360px] sm:h-[460px]",
}: ExploreHeroCardProps) {
  const router = useRouter()
  const url = `/projects/${slug}`
  const [imageIndex, setImageIndex] = useState(0)
  const activeIndex = imageIndex % Math.max(images.length, 1)

  useEffect(() => {
    if (images.length < 2) return
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }
    return subscribeTick(() => setImageIndex((prev) => (prev + 1) % images.length))
  }, [images.length])

  return (
    <article
      onClick={() => router.push(url)}
      className={`group relative block w-full cursor-pointer overflow-hidden rounded-2xl bg-neutral-900 ${heightClassName}`}
    >
      {images.length > 0 ? (
        <>
          {images.map((src, index) => {
            const active = index === activeIndex

            return (
              <div
                key={`${src}-${index}`}
                aria-hidden={!active}
                className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={src}
                  alt=""
                  aria-hidden="true"
                  fetchPriority="low"
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-2xl"
                />
                <div className="absolute inset-4 overflow-hidden rounded-xl border border-white/15 bg-black/25 shadow-2xl sm:inset-6">
                  <img
                    src={src}
                    alt={active ? name : ""}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
            )
          })}
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
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            <RiFireLine className="h-3 w-3" />
            Top tool
          </span>
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            {toolStatusLabel(launchStatus)}
          </span>
          {category && (
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur">
              {category}
            </span>
          )}
        </div>
        <h2 className="font-heading max-w-3xl text-2xl font-black tracking-tight text-white sm:text-4xl">
          <span className="bg-black/60 box-decoration-clone [box-decoration-break:clone] px-2 py-0.5 leading-[1.25] shadow-black/30">
            {name}
          </span>
        </h2>
        <p className="line-clamp-2 max-w-2xl text-sm leading-7 text-white/90 sm:text-base">
          <span className="bg-black/60 box-decoration-clone [box-decoration-break:clone] px-1.5 py-0.5">
            {stripHtml(description)}
          </span>
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
