"use client"

import { useEffect, useRef, useState } from "react"

// One-time "SYSTEM ONLINE" boot overlay. Plays once per tab session
// (sessionStorage-gated), is always pointer-events-none so it can never trap
// clicks, and fades itself out. Disable via ALIVE_BOOT in lib/alive.ts.

const BOOT_LINES = [
  "▸ INITIALIZING iScaleBuilders OS …",
  "▸ MOUNTING NEURAL FORGE …",
  "▸ SPINNING UP AGENT RUNTIME ×1,204 …",
  "▸ GRID 3042 UPLINK ESTABLISHED",
  "✓ ALL SYSTEMS NOMINAL",
  "✦ SYSTEM ONLINE",
]

const LINE_MS = 300
const HOLD_AFTER_MS = 650
const FADE_MS = 700
const KEY = "alive-booted"

export default function BootSequence() {
  const [active, setActive] = useState(false)
  const [shown, setShown] = useState(0)
  const [fading, setFading] = useState(false)
  const [dark, setDark] = useState(true)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  // Theme detection: track `dark` class on <html>.
  useEffect(() => {
    if (typeof document === "undefined") return
    const read = () => setDark(document.documentElement.classList.contains("dark"))
    read()
    const obs = new MutationObserver(read)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let booted = false
    try {
      booted = sessionStorage.getItem(KEY) === "1"
    } catch {
      booted = false
    }
    if (booted || reduce) return

    setActive(true)
    try {
      sessionStorage.setItem(KEY, "1")
    } catch {
      /* ignore */
    }

    BOOT_LINES.forEach((_, i) => {
      timers.current.push(setTimeout(() => setShown(i + 1), i * LINE_MS))
    })
    const total = BOOT_LINES.length * LINE_MS + HOLD_AFTER_MS
    timers.current.push(setTimeout(() => setFading(true), total))
    timers.current.push(setTimeout(() => setActive(false), total + FADE_MS))

    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [])

  if (!active) return null

  return (
    <div
      aria-hidden="true"
      className="bg-background pointer-events-none fixed inset-0 z-[80] flex items-center justify-center"
      style={{ opacity: fading ? 0 : 1, transition: `opacity ${FADE_MS}ms ease` }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: dark
            ? "radial-gradient(circle at 50% 45%, rgb(212 212 212 / 0.10), transparent 60%)"
            : "radial-gradient(circle at 50% 45%, rgb(115 115 115 / 0.05), transparent 60%)",
        }}
      />
      <div className="relative w-full max-w-md px-6 font-mono text-[13px] leading-7 sm:text-sm">
        <div className="mb-4 text-[11px] tracking-[0.4em] text-cyan-200/70">iSCALE://BOOT</div>
        {BOOT_LINES.slice(0, shown).map((line, i) => (
          <div
            key={i}
            className={
              line.startsWith("✓")
                ? "text-emerald-300"
                : line.startsWith("✦")
                  ? "text-fuchsia-300"
                  : "text-cyan-100/90"
            }
            style={{
              textShadow: dark ? "0 0 14px rgb(212 212 212 / 0.4)" : "0 0 3px rgb(82 82 82 / 0.25)",
            }}
          >
            {line}
          </div>
        ))}
        <span
          className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-cyan-200"
          style={{
            animation: "boot-caret 0.9s steps(2,start) infinite",
            boxShadow: dark ? "0 0 14px rgb(212 212 212 / 0.8)" : "0 0 4px rgb(82 82 82 / 0.4)",
          }}
        />
      </div>
      <style>{`@keyframes boot-caret { 0%,100% { opacity: 1 } 50% { opacity: 0 } }`}</style>
    </div>
  )
}
