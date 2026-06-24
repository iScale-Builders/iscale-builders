"use client"

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react"

import { RiArrowLeftSLine, RiArrowRightSLine, RiCloseLine } from "@remixicon/react"

interface ListingImagesProps {
  banner: string
  images: string[]
  name: string
}

export function ListingImages({ banner, images, name }: ListingImagesProps) {
  // Ordered, de-duplicated set used by the lightbox (banner first).
  const all = Array.from(new Set([banner, ...images].filter(Boolean)))
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const next = useCallback(
    () => setOpenIndex((p) => (p === null ? p : (p + 1) % all.length)),
    [all.length],
  )
  const prev = useCallback(
    () => setOpenIndex((p) => (p === null ? p : (p - 1 + all.length) % all.length)),
    [all.length],
  )

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      else if (e.key === "ArrowRight") next()
      else if (e.key === "ArrowLeft") prev()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [openIndex, close, next, prev])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenIndex(0)}
        className="group block w-full cursor-zoom-in"
        aria-label="View image full size"
      >
        <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border">
          <img
            src={banner}
            alt={`${name} - Product Image`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      </button>

      {images.length > 1 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {images.slice(0, 10).map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setOpenIndex(Math.max(0, all.indexOf(image)))}
              className="bg-muted aspect-video cursor-zoom-in overflow-hidden rounded-lg border transition-transform hover:-translate-y-0.5"
              aria-label={`View image ${index + 1} full size`}
            >
              <img
                src={image}
                alt={`${name} image ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>

          {all.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  prev()
                }}
                className="absolute left-3 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:left-6"
                aria-label="Previous image"
              >
                <RiArrowLeftSLine className="h-7 w-7" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
                className="absolute right-3 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:right-6"
                aria-label="Next image"
              >
                <RiArrowRightSLine className="h-7 w-7" />
              </button>
            </>
          )}

          <img
            src={all[openIndex]}
            alt={`${name} full size`}
            className="max-h-[90vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {all.length > 1 && (
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
              {openIndex + 1} / {all.length}
            </span>
          )}
        </div>
      )}
    </>
  )
}
