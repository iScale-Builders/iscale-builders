"use client"

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { RiArrowRightLine, RiChat3Line, RiFireLine, RiThumbUpLine } from "@remixicon/react"

import { subscribeTick } from "@/lib/sync-tick"
import { toolStatusLabel } from "@/lib/tool-status"
import { ToolThumbnail } from "@/components/shared/tool-thumbnail"

import { SubmissionBadge } from "./submission-badge"
import { useCarouselSync, useSlideIndex } from "./tool-carousel"

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

interface ExploreHeroCardProps {
  slug: string
  name: string
  description: string
  images: string[]
  launchStatus: string
  websiteUrl?: string | null
  category?: string
  creatorName?: string | null
  creatorImage?: string | null
  upvoteCount?: number
  commentCount?: number
  heightClassName?: string
  submissionType?: string | null
}

// Featured banner: just the image, then the text underneath. No container chrome,
// no blurred fill, no scrim, no overlays.
export function ExploreHeroCard({
  slug,
  name,
  description,
  images,
  launchStatus,
  websiteUrl,
  category,
  creatorName,
  creatorImage,
  upvoteCount = 0,
  commentCount = 0,
  heightClassName = "h-[300px] sm:h-[400px]",
  submissionType,
}: ExploreHeroCardProps) {
  const router = useRouter()
  const url = `/projects/${slug}`
  const [imageIndex, setImageIndex] = useState(0)
  const activeIndex = imageIndex % Math.max(images.length, 1)

  // If this card lives inside an autoplay carousel, phase-lock its image swap to the
  // carousel beat: while this slide is the active one, change the image once at the
  // half-interval. So the rhythm reads listing -> image changes -> next listing.
  const sync = useCarouselSync()
  const slideIndex = useSlideIndex()
  const carouselAutoplayMs = sync?.autoplayMs ?? 0
  const isActiveSlide = sync !== null && sync.activeIndex === slideIndex

  useEffect(() => {
    if (images.length < 2) return
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }
    if (carouselAutoplayMs) {
      if (!isActiveSlide) return
      const half = Math.max(carouselAutoplayMs / 2, 1500)
      const t = setTimeout(() => setImageIndex((prev) => prev + 1), half)
      return () => clearTimeout(t)
    }
    return subscribeTick(() => setImageIndex((prev) => prev + 1))
  }, [images.length, carouselAutoplayMs, isActiveSlide])

  return (
    <article onClick={() => router.push(url)} className="group block w-full cursor-pointer">
      {/* image fit top-to-bottom, centered, with a blurred copy of itself behind */}
      <div className={`relative w-full overflow-hidden rounded-xl ${heightClassName}`}>
        <SubmissionBadge type={submissionType} className="absolute top-3 left-3 z-10" />
        {images.length > 0 ? (
          images.map((src, index) => {
            const active = index === activeIndex
            return (
              <div
                key={`${src}-${index}`}
                aria-hidden={!active}
                className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* blurred fill behind */}
                <img
                  src={src}
                  alt=""
                  aria-hidden="true"
                  fetchPriority="low"
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-100 blur-sm"
                />
                {/* the actual image, centered, fit top-to-bottom */}
                <img
                  src={src}
                  alt={active ? name : ""}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className="absolute inset-0 m-auto h-full w-full object-contain"
                />
              </div>
            )
          })
        ) : (
          <ToolThumbnail
            name={name}
            category={category}
            slug={slug}
            className="absolute inset-0 h-full w-full rounded-lg"
          />
        )}
      </div>

      {/* the text, underneath */}
      <div className="flex flex-col items-center gap-2 pt-4 text-center">
        <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-2">
          <span className="border-border/60 bg-foreground/[0.03] inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold">
            <RiFireLine className="h-3 w-3" />
            Top tool
          </span>
          <span className="border-border/60 bg-foreground/[0.03] rounded-full border px-2.5 py-0.5 text-[11px] font-semibold">
            {toolStatusLabel(launchStatus, websiteUrl)}
          </span>
          {category && (
            <span className="border-border/60 bg-foreground/[0.03] rounded-full border px-2.5 py-0.5 text-[11px] font-medium">
              {category}
            </span>
          )}
        </div>
        <h2 className="font-heading text-foreground mx-auto max-w-3xl text-2xl font-black tracking-tight sm:text-4xl">
          {name}
        </h2>
        <p className="text-muted-foreground mx-auto line-clamp-2 max-w-2xl text-sm leading-7 sm:text-base">
          {stripHtml(description)}
        </p>
        <div className="text-muted-foreground flex flex-col items-center gap-3 pt-1 text-xs font-semibold sm:flex-row sm:text-sm">
          <div className="flex min-w-0 items-center gap-2">
            {creatorImage ? (
              <img
                src={creatorImage}
                alt={creatorName ?? "Maker"}
                className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="bg-muted text-foreground flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-black">
                {(creatorName ?? "?").charAt(0)}
              </div>
            )}
            <span className="min-w-0 truncate">{creatorName ?? "Unknown maker"}</span>
          </div>
          <span className="hidden h-1 w-1 rounded-full bg-current opacity-40 sm:inline-flex" />
          <span className="inline-flex items-center gap-1">
            <RiThumbUpLine className="h-3.5 w-3.5" />
            {upvoteCount}
          </span>
          <span className="inline-flex items-center gap-1">
            <RiChat3Line className="h-3.5 w-3.5" />
            {commentCount}
          </span>
          <span className="text-foreground inline-flex w-fit items-center gap-1">
            View tool
            <RiArrowRightLine className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  )
}
