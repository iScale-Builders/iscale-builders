"use client"

import { useEffect, useRef, useState } from "react"

const PHRASES = [
  "Discover the tools building tomorrow.",
  "An operating system for what builders become.",
  "Live signals from the AI-native frontier.",
  "Built by machines. Tuned by makers.",
  "The command surface for the builder era.",
]

const TYPE_MS = 42
const DELETE_MS = 22
const HOLD_MS = 1900

// SSR-safe reduced-motion check.
function prefersReduced() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

// Tracks the `dark` class on <html> with a MutationObserver.
function useIsDark() {
  const [dark, setDark] = useState(true)
  useEffect(() => {
    if (typeof document === "undefined") return
    const read = () => setDark(document.documentElement.classList.contains("dark"))
    read()
    const obs = new MutationObserver(read)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])
  return dark
}

export default function TypedHeadline() {
  const [text, setText] = useState(PHRASES[0])
  const [reduce, setReduce] = useState(true) // start reduced => SSR renders full first phrase
  const dark = useIsDark()
  const phraseRef = useRef(0)
  const charRef = useRef(PHRASES[0].length)
  const modeRef = useRef<"hold" | "deleting" | "typing">("hold")

  useEffect(() => {
    if (prefersReduced()) {
      setReduce(true)
      setText(PHRASES[0])
      return
    }
    setReduce(false)

    let timer: ReturnType<typeof setTimeout>
    let alive = true

    const tick = () => {
      if (!alive) return
      if (document.hidden) {
        timer = setTimeout(tick, 400)
        return
      }

      const phrase = PHRASES[phraseRef.current]
      const mode = modeRef.current

      if (mode === "hold") {
        modeRef.current = "deleting"
        timer = setTimeout(tick, HOLD_MS)
        return
      }

      if (mode === "deleting") {
        charRef.current -= 1
        setText(phrase.slice(0, Math.max(0, charRef.current)))
        if (charRef.current <= 0) {
          phraseRef.current = (phraseRef.current + 1) % PHRASES.length
          modeRef.current = "typing"
        }
        timer = setTimeout(tick, DELETE_MS)
        return
      }

      // typing
      charRef.current += 1
      const next = PHRASES[phraseRef.current]
      setText(next.slice(0, charRef.current))
      if (charRef.current >= next.length) {
        modeRef.current = "hold"
      }
      timer = setTimeout(tick, TYPE_MS)
    }

    timer = setTimeout(tick, HOLD_MS)
    return () => {
      alive = false
      clearTimeout(timer)
    }
  }, [])

  return (
    <h1 className="text-foreground max-w-4xl text-5xl leading-[0.92] font-black tracking-tight sm:text-6xl lg:text-7xl">
      <span
        className={
          dark
            ? "bg-gradient-to-r from-white via-cyan-50 to-cyan-200 bg-clip-text text-transparent"
            : "from-foreground to-primary bg-gradient-to-r via-amber-600 bg-clip-text text-transparent"
        }
      >
        {text}
      </span>
      {!reduce && (
        <span
          aria-hidden="true"
          className={`ml-1 inline-block w-[0.06em] translate-y-[0.06em] self-stretch align-baseline ${dark ? "bg-cyan-200" : "bg-primary"}`}
          style={{
            height: "0.9em",
            animation: "typed-caret 1s steps(2, start) infinite",
            // Gold glow in dark; minimal in light (ink reads as texture, not neon).
            boxShadow: dark ? "0 0 18px rgb(212 212 212 / 0.8)" : "0 0 4px rgb(82 82 82 / 0.4)",
          }}
        />
      )}
      <style>{`
        @keyframes typed-caret { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
      `}</style>
    </h1>
  )
}
