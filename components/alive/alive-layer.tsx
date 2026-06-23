"use client"

import { useEffect, useRef, useState } from "react"

import {
  ALIVE_BOOT,
  ALIVE_HUD,
  ALIVE_MODE,
  ALIVE_PAPYRUS,
  ALIVE_RAIN,
  ALIVE_TERMINALS,
  ALIVE_VIEWPORT_CUTOFF,
} from "@/lib/alive"

import BgTerminals from "./bg-terminals"
import BootSequence from "./boot-sequence"
import CommandHud from "./command-hud"
import DataRain from "./data-rain"
import DigitalPapyrus from "./digital-papyrus"

// The exaggerated "ALIVE" experience layer, mounted behind real content as a
// fixed, pointer-events-none stack. Two performance guards keep it cheap:
//   1. Per-effect flags in lib/alive.ts (drop any single effect).
//   2. Offscreen pause: the heavy background canvases + HUD UNMOUNT once you
//      scroll past the hero, so scrolling the long page costs nothing. They
//      remount when you scroll back up. Hysteresis avoids flip-flop at the edge.
//
// Profiling aid: ?aliveoff=rain,papyrus,terminals,hud,boot disables effects.
export default function AliveLayer() {
  const [off, setOff] = useState<Set<string>>(new Set())
  const [heroVisible, setHeroVisible] = useState(true)
  const ticking = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = new URLSearchParams(window.location.search).get("aliveoff") || ""
    setOff(
      new Set(
        raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ),
    )
  }, [])

  // Pause the heavy layer when scrolled past the hero (rAF-throttled, hysteresis).
  useEffect(() => {
    if (typeof window === "undefined") return
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        ticking.current = false
        const vh = window.innerHeight
        const y = window.scrollY
        setHeroVisible((prev) =>
          prev ? y < vh * (ALIVE_VIEWPORT_CUTOFF + 0.3) : y < vh * ALIVE_VIEWPORT_CUTOFF,
        )
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  if (!ALIVE_MODE) return null

  const showHeavy = heroVisible

  return (
    <>
      {/* Background field: above the static hero image (z-0), below content (z-10). */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        {showHeavy && ALIVE_RAIN && !off.has("rain") && <DataRain />}
        {showHeavy && ALIVE_PAPYRUS && !off.has("papyrus") && <DigitalPapyrus />}
        {showHeavy && ALIVE_TERMINALS && !off.has("terminals") && <BgTerminals />}
      </div>

      {/* HUD chrome renders its own fixed z-[5] overlay. */}
      {showHeavy && ALIVE_HUD && !off.has("hud") && <CommandHud />}

      {ALIVE_BOOT && !off.has("boot") ? <BootSequence /> : null}
    </>
  )
}
