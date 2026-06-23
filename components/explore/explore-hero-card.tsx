"use client"

/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation"

import { RiArrowRightLine, RiFireLine } from "@remixicon/react"

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
      <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-2 p-6 sm:p-8">
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
        <span className="mt-1 inline-flex w-fit items-center gap-1 text-sm font-semibold text-white">
          View tool
          <RiArrowRightLine className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  )
}
