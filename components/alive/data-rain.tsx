"use client"

import { useEffect, useRef, useState } from "react"

// Shared theme hook: tracks the `dark` class on <html> with a MutationObserver.
function useIsDark(): boolean {
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

type ColumnKind = "cyan" | "fuchsia" | "emerald"

interface Column {
  x: number
  y: number
  speed: number
  kind: ColumnKind
}

const GLYPHS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ" +
  "マミムメモヤユヨラリルレロワン01{}<>/;=+*◇▸✦"

// Sun palette per theme. `cyan` kind = lead/gold, `fuchsia` = ember, `emerald` = sand.
const COLORS_DARK: Record<ColumnKind, [number, number, number]> = {
  cyan: [244, 190, 80], // gold
  fuchsia: [255, 150, 70], // ember
  emerald: [220, 198, 150], // sand
}
const COLORS_LIGHT: Record<ColumnKind, [number, number, number]> = {
  cyan: [70, 52, 28], // warm dark ink
  fuchsia: [190, 77, 20], // deep ember
  emerald: [176, 110, 20], // amber
}

function randomGlyph(): string {
  return GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length))
}

function pickKind(): ColumnKind {
  const r = Math.random()
  if (r < 0.06) return "fuchsia"
  if (r < 0.12) return "emerald"
  return "cyan"
}

export default function DataRain() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const dark = useIsDark()

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduce =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Theme detection (re-read inside draw loop via `dark`).
    let dark =
      typeof document !== "undefined" && document.documentElement.classList.contains("dark")
    const themeObserver = new MutationObserver(() => {
      dark = document.documentElement.classList.contains("dark")
    })
    if (typeof document !== "undefined") {
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      })
    }

    const fontSize = 20
    let columns: Column[] = []
    let width = 0
    let height = 0
    let dpr = 1

    const setupColumns = () => {
      const count = Math.max(1, Math.floor(width / fontSize))
      columns = []
      for (let i = 0; i < count; i++) {
        const kind = pickKind()
        const ion = kind !== "cyan"
        columns.push({
          x: i * fontSize + fontSize / 2,
          y: Math.random() * height,
          speed: ion ? 1.6 + Math.random() * 0.9 : 0.9 + Math.random() * 0.6,
          kind,
        })
      }
    }

    const resize = () => {
      const rect = container.getBoundingClientRect()
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      dpr = 1
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = dark ? "rgb(10,10,10)" : "rgb(250,250,250)"
      ctx.fillRect(0, 0, width, height)
      setupColumns()
    }

    const drawStaticFrame = () => {
      ctx.fillStyle = dark ? "rgb(10,10,10)" : "rgb(250,250,250)"
      ctx.fillRect(0, 0, width, height)
      ctx.font = `${fontSize}px ui-monospace, monospace`
      ctx.textBaseline = "top"
      const palette = dark ? COLORS_DARK : COLORS_LIGHT
      const baseAlpha = dark ? 0.18 : 0.1
      const spanAlpha = dark ? 0.22 : 0.12
      const drops = Math.floor((width * height) / 9000)
      for (let i = 0; i < drops; i++) {
        const [r, g, b] = palette[pickKind()]
        ctx.fillStyle = `rgba(${r},${g},${b},${baseAlpha + Math.random() * spanAlpha})`
        ctx.fillText(randomGlyph(), Math.random() * width, Math.random() * height)
      }
    }

    resize()

    if (reduce) {
      // Redraw static frame on theme change too.
      const onReduceTheme = new MutationObserver(() => {
        dark = document.documentElement.classList.contains("dark")
        resize()
        drawStaticFrame()
      })
      onReduceTheme.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      })
      drawStaticFrame()
      return () => {
        themeObserver.disconnect()
        onReduceTheme.disconnect()
      }
    }

    let raf = 0
    let last = 0
    const frameInterval = 1000 / 22
    let paused = false

    const render = (now: number) => {
      raf = requestAnimationFrame(render)
      if (paused) return
      if (now - last < frameInterval) return
      last = now

      // Trail fade: dark fades to space-black, light fades to ivory.
      ctx.fillStyle = dark ? "rgba(10,10,10,0.10)" : "rgba(250,250,250,0.10)"
      ctx.fillRect(0, 0, width, height)
      ctx.font = `${fontSize}px ui-monospace, monospace`
      ctx.textBaseline = "top"

      const palette = dark ? COLORS_DARK : COLORS_LIGHT
      const leadAlpha = dark ? 0.95 : 0.55
      const trailAlpha = dark ? 0.45 : 0.28

      for (const col of columns) {
        const [r, g, b] = palette[col.kind]

        ctx.fillStyle =
          col.kind === "cyan"
            ? dark
              ? "rgba(245,245,245,0.95)" // white-hot lead
              : `rgba(${r},${g},${b},${leadAlpha})`
            : `rgba(${Math.min(255, r + 40)},${Math.min(255, g + 40)},${Math.min(
                255,
                b + 40,
              )},${leadAlpha})`
        ctx.fillText(randomGlyph(), col.x, col.y)

        ctx.fillStyle = `rgba(${r},${g},${b},${trailAlpha})`
        ctx.fillText(randomGlyph(), col.x, col.y - fontSize)

        col.y += col.speed * fontSize
        if (col.y > height && Math.random() > 0.975) {
          col.y = -fontSize
          col.kind = pickKind()
          const reIon = col.kind !== "cyan"
          col.speed = reIon ? 1.6 + Math.random() * 0.9 : 0.9 + Math.random() * 0.6
        }
      }
    }

    const onVisibility = () => {
      paused = document.hidden
      if (!paused) last = 0
    }

    const ro = new ResizeObserver(() => resize())
    ro.observe(container)
    document.addEventListener("visibilitychange", onVisibility)
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      themeObserver.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity: dark ? 0.55 : 0.28 }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
