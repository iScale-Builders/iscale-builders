"use client"

import { useEffect, useRef } from "react"

// Live "exchange" constellation: nodes drift and connect with lines, a few tinted
// emerald (solutions) and rose (problems), and the whole field reacts to the cursor.
// Greyscale-first so it sits behind the hero without fighting the text.
export function HeroNetwork() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2)

    let w = 0
    let h = 0
    let raf = 0
    const mouse = { x: -9999, y: -9999 }

    type P = { x: number; y: number; vx: number; vy: number; r: number; tint: string }
    let pts: P[] = []

    const tints = [
      "130,130,130",
      "130,130,130",
      "130,130,130",
      "130,130,130",
      "16,185,129", // emerald — solution
      "244,63,94", // rose — problem
    ]

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      w = parent.clientWidth
      h = parent.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = w + "px"
      canvas.style.height = h + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.max(16, Math.min(64, Math.round((w * h) / 9000)))
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.8 + 1.1,
        tint: tints[Math.floor(Math.random() * tints.length)],
      }))
    }

    const LINK = 120
    const MOUSE_LINK = 170

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      for (const p of pts) {
        if (!reduce) {
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0 || p.x > w) p.vx *= -1
          if (p.y < 0 || p.y > h) p.vy *= -1
        }
        // gentle pull toward the cursor
        const mdx = mouse.x - p.x
        const mdy = mouse.y - p.y
        const md = Math.hypot(mdx, mdy)
        if (md < MOUSE_LINK && md > 0.01) {
          const pull = (1 - md / MOUSE_LINK) * 0.04
          p.x += (mdx / md) * pull
          p.y += (mdy / md) * pull
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.tint},0.8)`
        ctx.fill()
      }

      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < LINK) {
            ctx.strokeStyle = `rgba(150,150,150,${(1 - d / LINK) * 0.3})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y)
        if (md < MOUSE_LINK) {
          ctx.strokeStyle = `rgba(${a.tint},${(1 - md / MOUSE_LINK) * 0.65})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }

      raf = requestAnimationFrame(draw)
    }

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()
    draw()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", onMove)
    document.addEventListener("mouseleave", onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_92%)]"
    />
  )
}
