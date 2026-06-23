"use client"

import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"

import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react"
import useEmblaCarousel from "embla-carousel-react"

// Horizontal, swipeable carousel of cards. Optionally loops and auto-advances.
export function ToolCarousel({
  children,
  slideClassName = "min-w-0 flex-[0_0_82%] sm:flex-[0_0_46%] lg:flex-[0_0_31%] xl:flex-[0_0_23.5%]",
  autoplayMs = 0,
  loop = false,
}: {
  children: React.ReactNode
  slideClassName?: string
  autoplayMs?: number
  loop?: boolean
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: !loop,
    loop,
    containScroll: loop ? false : "trimSnaps",
  })
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const paused = useRef(false)

  const onUpdate = useCallback(() => {
    if (!emblaApi) return
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onUpdate()
    emblaApi.on("select", onUpdate)
    emblaApi.on("reInit", onUpdate)
    return () => {
      emblaApi.off("select", onUpdate)
      emblaApi.off("reInit", onUpdate)
    }
  }, [emblaApi, onUpdate])

  // Auto-advance (pauses on hover and when the tab is hidden).
  useEffect(() => {
    if (!emblaApi || !autoplayMs) return
    const id = setInterval(() => {
      if (paused.current || (typeof document !== "undefined" && document.hidden)) return
      if (emblaApi.canScrollNext()) emblaApi.scrollNext()
      else emblaApi.scrollTo(0)
    }, autoplayMs)
    return () => clearInterval(id)
  }, [emblaApi, autoplayMs])

  const slides = React.Children.toArray(children)

  return (
    <div
      className="relative"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {slides.map((slide, i) => (
            <div key={i} className={slideClassName}>
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation: plain arrows centered underneath the carousel. */}
      <div className="mt-3 flex items-center justify-center gap-6">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!loop && !canPrev}
          className="text-muted-foreground hover:text-foreground transition disabled:pointer-events-none disabled:opacity-30"
        >
          <RiArrowLeftSLine className="h-6 w-6" />
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => emblaApi?.scrollNext()}
          disabled={!loop && !canNext}
          className="text-muted-foreground hover:text-foreground transition disabled:pointer-events-none disabled:opacity-30"
        >
          <RiArrowRightSLine className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}
