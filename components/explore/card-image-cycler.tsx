"use client"

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react"

import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react"

import { subscribeTick } from "@/lib/sync-tick"
import { ToolThumbnail } from "@/components/shared/tool-thumbnail"

// Fills its (fixed-size, relative) parent with a tool's images, crossfading
// between them. Auto-cycling cards all advance on one shared clock (in unison).
export function CardImageCycler({
  images,
  name,
  category,
  slug,
  compact = false,
  autoCycle = false,
}: {
  images: string[]
  name: string
  category?: string
  slug: string
  compact?: boolean
  autoCycle?: boolean
}) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!autoCycle || images.length < 2) return
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return
    return subscribeTick(() => setIndex((prev) => (prev + 1) % images.length))
  }, [autoCycle, images.length])

  if (images.length === 0) {
    return (
      <ToolThumbnail
        name={name}
        category={category}
        slug={slug}
        compact={compact}
        className="h-full w-full transition-transform duration-500 group-hover:scale-105"
      />
    )
  }

  const safeIndex = index % images.length
  const move = (e: React.MouseEvent, delta: number) => {
    e.preventDefault()
    e.stopPropagation()
    setIndex((prev) => (prev + delta + images.length) % images.length)
  }

  return (
    <>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`${name} preview ${i + 1}`}
          aria-hidden={i !== safeIndex}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-[1500ms] ease-in-out ${
            i === safeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 [filter:drop-shadow(0_1px_2px_rgb(0_0_0_/_0.55))]">
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => move(e, -1)}
            className="text-foreground/70 hover:text-foreground transition"
          >
            <RiArrowLeftSLine className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1.5">
            {images.map((_, d) => (
              <span
                key={d}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  d === safeIndex ? "bg-foreground" : "bg-foreground/40"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => move(e, 1)}
            className="text-foreground/70 hover:text-foreground transition"
          >
            <RiArrowRightSLine className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  )
}
