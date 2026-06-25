"use client"

import { useEffect } from "react"

// Site-wide entrance motion: cards and section titles fade + rise as they scroll
// into view, with a small stagger. Above-the-fold elements show immediately (no
// flash). Disabled for reduced-motion. Mounted once in the root layout.
export function ScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const select = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>(
          "main article, main section > h2, main section > h3, [data-reveal]",
        ),
      ).filter((el) => !el.dataset.revealBound)

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).classList.add("reveal-in")
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -32px 0px" },
    )

    const bind = () => {
      const vh = window.innerHeight
      let below = 0
      for (const el of select()) {
        el.dataset.revealBound = "1"
        const top = el.getBoundingClientRect().top
        if (top < vh - 24) {
          el.classList.add("reveal-in") // already in view — no animation, no flash
        } else {
          el.classList.add("reveal-init")
          el.style.transitionDelay = `${(below % 6) * 60}ms`
          below++
          io.observe(el)
        }
      }
    }

    bind()
    // Re-bind when client-side content (filtered grids, etc.) swaps in.
    const mo = new MutationObserver(() => bind())
    const main = document.querySelector("main")
    if (main) mo.observe(main, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}
