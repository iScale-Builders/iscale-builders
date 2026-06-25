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
      className={`group relative block w-full cursor-pointer overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-900 ${heightClassName}`}
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
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-[0.08] blur-2xl dark:opacity-45"
                />
                <div className="absolute inset-4 overflow-hidden rounded-xl border border-black/10 bg-white/40 shadow-xl sm:inset-6 dark:border-white/15 dark:bg-black/25 dark:shadow-2xl">
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

      {/* legibility scrim — light in light mode, dark in dark mode */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/90 via-white/45 to-transparent dark:from-black/85 dark:via-black/35 dark:to-transparent" />

      {/* overlaid title + description */}
      <div className="absolute right-0 bottom-0 left-0 flex flex-col items-center gap-3 p-6 text-center sm:p-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/10 px-2.5 py-1 text-[11px] font-semibold text-neutral-800 backdrop-blur dark:bg-white/15 dark:text-white">
            <RiFireLine className="h-3 w-3" />
            Top tool
          </span>
          <span className="rounded-full bg-black/10 px-2.5 py-1 text-[11px] font-semibold text-neutral-800 backdrop-blur dark:bg-white/15 dark:text-white">
            {toolStatusLabel(launchStatus)}
          </span>
          {category && (
            <span className="rounded-full bg-black/[0.07] px-2.5 py-0.5 text-[11px] font-medium text-neutral-700 backdrop-blur dark:bg-white/10 dark:text-white/90">
              {category}
            </span>
          )}
        </div>
        <h2 className="font-heading mx-auto max-w-3xl text-2xl font-black tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
          <span className="rounded-md bg-white/70 box-decoration-clone [box-decoration-break:clone] px-2 py-0.5 leading-[1.25] shadow-black/10 dark:bg-black/60 dark:shadow-black/30">
            {name}
          </span>
        </h2>
        <p className="mx-auto line-clamp-2 max-w-2xl text-sm leading-7 text-neutral-800 sm:text-base dark:text-white/90">
          <span className="rounded-sm bg-white/70 box-decoration-clone [box-decoration-break:clone] px-1.5 py-0.5 dark:bg-black/60">
            {stripHtml(description)}
          </span>
        </p>
        <div className="flex flex-col items-center gap-3 pt-1 sm:flex-row sm:items-center sm:justify-center">
          <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs font-semibold text-neutral-800 sm:text-sm dark:text-white/90">
            <div className="flex min-w-0 items-center gap-2">
              {creatorImage ? (
                <img
                  src={creatorImage}
                  alt={creatorName ?? "Maker"}
                  className="h-7 w-7 flex-shrink-0 rounded-full border border-black/15 object-cover dark:border-white/25"
                />
              ) : (
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-black/15 bg-black/10 text-[11px] font-black text-neutral-800 dark:border-white/20 dark:bg-white/15 dark:text-white">
                  {(creatorName ?? "?").charAt(0)}
                </div>
              )}
              <span className="min-w-0 truncate">{creatorName ?? "Unknown maker"}</span>
            </div>
            <span className="hidden h-1 w-1 rounded-full bg-black/30 sm:inline-flex dark:bg-white/50" />
            <span className="inline-flex items-center gap-1 rounded-full bg-black/[0.07] px-2 py-1 backdrop-blur dark:bg-white/10">
              <RiThumbUpLine className="h-3.5 w-3.5" />
              {upvoteCount}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-black/[0.07] px-2 py-1 backdrop-blur dark:bg-white/10">
              <RiChat3Line className="h-3.5 w-3.5" />
              {commentCount}
            </span>
          </div>
          <span className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-neutral-900 dark:text-white">
            View tool
            <RiArrowRightLine className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  )
}
