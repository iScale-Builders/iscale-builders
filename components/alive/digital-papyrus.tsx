"use client"

import { useEffect, useRef, useState } from "react"

const GLYPHS = "01{}</>;=»✦◇▸λ∑∆⟁⟡ᚠᚱᚷᛉᛟ氼龘鑫淼森麤靐爨曫漢字光道無".split("")

// Sun palette per theme (gold-weighted, ember + sand accents).
const PALETTE_DARK: Array<[number, number, number]> = [
  [244, 190, 80], // gold (primary, weighted)
  [244, 190, 80],
  [244, 190, 80],
  [244, 190, 80],
  [220, 198, 150], // sand accent
  [255, 150, 70], // ember accent
]
const PALETTE_LIGHT: Array<[number, number, number]> = [
  [70, 52, 28], // warm dark ink (primary, weighted)
  [70, 52, 28],
  [70, 52, 28],
  [70, 52, 28],
  [176, 110, 20], // amber accent
  [190, 77, 20], // deep ember accent
]

type Strip = { cx: number; phase: number; speed: number }

// Tracks the `dark` class on <html> with a MutationObserver (for wrapper opacity).
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

export default function DigitalPapyrus() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const dark = useIsDark()

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduce =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Theme detection, re-read inside the draw loop.
    let dark =
      typeof document !== "undefined" && document.documentElement.classList.contains("dark")
    const themeObserver = new MutationObserver(() => {
      dark = document.documentElement.classList.contains("dark")
      if (reduce) draw(0)
    })
    if (typeof document !== "undefined") {
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      })
    }

    let raf = 0
    let running = true
    let w = 0
    let h = 0
    const rowH = 26
    const fontSize = 18

    const strips: Strip[] = [
      { cx: 0.16, phase: 0, speed: 14 },
      { cx: 0.82, phase: Math.PI, speed: 11 },
    ]

    // Deterministic per-cell glyph/color so wrapping stays seamless.
    const pick = (col: number, row: number, t: number) => {
      const n = Math.sin(col * 12.9898 + row * 78.233) * 43758.5453
      const r = n - Math.floor(n)
      const palette = dark ? PALETTE_DARK : PALETTE_LIGHT
      const gi = Math.floor(r * GLYPHS.length)
      const ci = Math.floor((r * 7) % palette.length)
      // occasional brighten, slow flicker
      const flick = (Math.sin(t * 0.0009 + row * 0.7 + col) + 1) / 2
      const bright = r > 0.86 ? 1 : 0.45 + flick * 0.4
      return { glyph: GLYPHS[gi], color: palette[ci], bright }
    }

    const drawStrip = (strip: Strip, t: number) => {
      const stripW = Math.min(220, w * 0.28)
      const baseX = strip.cx * w
      const wave = Math.sin(t * 0.0004 + strip.phase) * (stripW * 0.18)
      const cols = 3
      const colGap = stripW / (cols + 1)

      // Parchment strip glow (background-of-light)
      ctx.save()
      const gx = baseX + wave
      const grad = ctx.createLinearGradient(gx - stripW / 2, 0, gx + stripW / 2, 0)
      // Gold strip glow (dark) / faint amber wash (light).
      const glow = dark ? "212,212,212" : "115,115,115"
      const glowMid = dark ? 0.1 : 0.05
      grad.addColorStop(0, `rgba(${glow},0)`)
      grad.addColorStop(0.5, `rgba(${glow},${glowMid})`)
      grad.addColorStop(1, `rgba(${glow},0)`)
      ctx.fillStyle = grad
      ctx.fillRect(gx - stripW / 2, 0, stripW, h)
      ctx.restore()

      // Glyph rows scrolling upward, seamless wrap via modulo.
      // Rendered with default source-over compositing.
      ctx.save()
      ctx.font = `${fontSize}px ui-monospace, "SFMono-Regular", Menlo, monospace`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const totalRows = Math.ceil(h / rowH) + 2
      const offset = (t * 0.001 * strip.speed * rowH) % rowH

      for (let r = -1; r < totalRows; r++) {
        const y = h - 1 - (r * rowH - offset)
        if (y < -rowH || y > h + rowH) continue
        const rowWave = Math.sin(t * 0.0004 + strip.phase + y * 0.012) * (stripW * 0.18)
        const rx = baseX + rowWave
        const rowIndex = Math.floor(t * 0.001 * strip.speed + r)
        for (let c = 0; c < cols; c++) {
          const cell = pick(c + strip.cx * 100, rowIndex, t)
          const x = rx - stripW / 2 + colGap * (c + 1)
          const [cr, cg, cb] = cell.color
          const a = cell.bright * (dark ? 0.85 : 0.42)
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${a})`
          ctx.fillText(cell.glyph, x, y)
        }
      }
      ctx.restore()
    }

    const draw = (t: number) => {
      // Deep background: space-black (dark) / warm ivory (light)
      ctx.globalCompositeOperation = "source-over"
      ctx.fillStyle = dark ? "rgb(10,10,10)" : "rgb(250,250,250)"
      ctx.fillRect(0, 0, w, h)

      for (const strip of strips) drawStrip(strip, t)

      // Fade top & bottom edges to transparent (emerge/dissolve)
      ctx.globalCompositeOperation = "destination-out"
      const fadeH = Math.min(160, h * 0.28)
      const top = ctx.createLinearGradient(0, 0, 0, fadeH)
      top.addColorStop(0, "rgba(0,0,0,1)")
      top.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = top
      ctx.fillRect(0, 0, w, fadeH)
      const bot = ctx.createLinearGradient(0, h - fadeH, 0, h)
      bot.addColorStop(0, "rgba(0,0,0,0)")
      bot.addColorStop(1, "rgba(0,0,0,1)")
      ctx.fillStyle = bot
      ctx.fillRect(0, h - fadeH, w, fadeH)
      ctx.globalCompositeOperation = "source-over"
    }

    const resize = () => {
      const dpr = 1
      w = root.clientWidth
      h = root.clientHeight
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      if (reduce) draw(0)
    }

    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(root)

    let last = 0
    const frameInterval = 1000 / 22
    const loop = (t: number) => {
      if (!running) return
      if (t - last < frameInterval) {
        raf = requestAnimationFrame(loop)
        return
      }
      last = t
      draw(t)
      raf = requestAnimationFrame(loop)
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        if (raf) cancelAnimationFrame(raf)
      } else if (!reduce && !running) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }

    if (!reduce) {
      raf = requestAnimationFrame(loop)
      document.addEventListener("visibilitychange", onVisibility)
    }

    return () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      themeObserver.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity: dark ? 0.5 : 0.26 }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
