"use client"

import { useEffect, useRef, useState } from "react"

type Tone = "cmd" | "ok" | "ai" | "dim"

interface Line {
  text: string
  tone: Tone
}

interface TerminalConfig {
  label: string
  style: React.CSSProperties
  rows: number
  speed: number // ms per character
  delay: number // initial stagger in ms
  pool: Line[]
}

// Sun palette per theme. Dark: warm glow on space-black. Light: warm dark ink.
const TONE_COLOR_DARK: Record<Tone, string> = {
  cmd: "rgb(212,212,212)", // gold
  ok: "rgb(212,212,212)", // sand
  ai: "rgb(163,163,163)", // ember
  dim: "rgba(212,212,212,0.55)",
}
const TONE_COLOR_LIGHT: Record<Tone, string> = {
  cmd: "rgb(64,64,64)", // warm dark ink
  ok: "rgb(115,115,115)", // amber
  ai: "rgb(82,82,82)", // deep ember
  dim: "rgba(64,64,64,0.5)",
}

// Tracks the `dark` class on <html> with a MutationObserver.
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

const POOL: Line[] = [
  { text: "$ git push origin main", tone: "cmd" },
  { text: "▸ generating <Component/> …", tone: "dim" },
  { text: "✓ deploy succeeded in 1.8s", tone: "ok" },
  { text: "npm run build", tone: "dim" },
  { text: "◇ optimizing 1,944 modules", tone: "dim" },
  { text: "$ claude build --alive", tone: "cmd" },
  { text: "→ vectorizing assets", tone: "dim" },
  { text: "✦ neural pass 7/12", tone: "ai" },
  { text: "$ supabase db push", tone: "cmd" },
  { text: "✓ types regenerated", tone: "ok" },
  { text: "✦ embedding 2.3k vectors", tone: "ai" },
  { text: "$ docker compose up -d", tone: "cmd" },
  { text: "→ warming edge cache", tone: "dim" },
  { text: "✓ 0 vulnerabilities found", tone: "ok" },
  { text: "$ pnpm lint --fix", tone: "cmd" },
  { text: "✦ agent reasoning … step 4", tone: "ai" },
  { text: "◇ tree-shaking bundle", tone: "dim" },
  { text: "✓ tests 248 passed", tone: "ok" },
]

function pick(seed: number, n: number): Line[] {
  const out: Line[] = []
  for (let i = 0; i < n; i++) out.push(POOL[(seed * 7 + i * 5) % POOL.length])
  return out
}

const TERMINALS: TerminalConfig[] = [
  {
    label: "build@iscale",
    style: { top: "8%", left: "5%", width: "26%", opacity: 0.6 },
    rows: 7,
    speed: 55,
    delay: 0,
    pool: pick(1, 40),
  },
  {
    label: "agent-runtime",
    style: { top: "14%", right: "6%", width: "23%", opacity: 0.5 },
    rows: 6,
    speed: 70,
    delay: 600,
    pool: pick(3, 40),
  },
  {
    label: "neural-forge",
    style: { bottom: "16%", right: "10%", width: "25%", opacity: 0.54 },
    rows: 6,
    speed: 60,
    delay: 350,
    pool: pick(2, 40),
  },
]

function Terminal({
  cfg,
  paused,
  reduce,
  dark,
}: {
  cfg: TerminalConfig
  paused: boolean
  reduce: boolean
  dark: boolean
}) {
  const TONE_COLOR = dark ? TONE_COLOR_DARK : TONE_COLOR_LIGHT
  // Visible window of completed lines + current partial line.
  const [lines, setLines] = useState<Line[]>(reduce ? cfg.pool.slice(0, cfg.rows) : [])
  const [partial, setPartial] = useState("")

  const idx = useRef(0) // index into pool for current line
  const ch = useRef(0) // char count of current line
  const acc = useRef(0) // accumulated time
  const started = useRef(reduce ? cfg.delay : -cfg.delay)

  useEffect(() => {
    if (reduce) return
    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = now - last
      last = now
      if (!paused) {
        started.current += dt
        if (started.current >= 0) {
          acc.current += dt
          while (acc.current >= cfg.speed) {
            acc.current -= cfg.speed
            const target = cfg.pool[idx.current % cfg.pool.length].text
            if (ch.current < target.length) {
              ch.current += 1
              setPartial(target.slice(0, ch.current))
            } else {
              // commit the finished line, advance
              const done = cfg.pool[idx.current % cfg.pool.length]
              setLines((prev) => {
                const next = [...prev, done]
                return next.length > cfg.rows ? next.slice(next.length - cfg.rows) : next
              })
              idx.current += 1
              ch.current = 0
              setPartial("")
            }
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [cfg, paused, reduce])

  const tone = cfg.pool[idx.current % cfg.pool.length]?.tone ?? "dim"

  return (
    <div
      className="absolute rounded-lg border font-mono"
      style={{
        ...cfg.style,
        background: dark ? "rgba(10,10,10,0.55)" : "rgba(250,250,250,0.7)",
        borderColor: dark ? "rgba(212,212,212,0.14)" : "rgba(64,64,64,0.16)",
        boxShadow: dark ? "0 0 40px rgba(10,10,10,0.6)" : "0 0 24px rgba(64,64,64,0.12)",
        fontSize: "11px",
        lineHeight: 1.5,
      }}
    >
      <div
        className="flex items-center gap-1.5 border-b px-2.5 py-1.5"
        style={{ borderColor: dark ? "rgba(212,212,212,0.1)" : "rgba(64,64,64,0.12)" }}
      >
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: dark ? "rgba(163,163,163,0.6)" : "rgba(82,82,82,0.6)" }}
        />
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: dark ? "rgba(212,212,212,0.6)" : "rgba(115,115,115,0.6)" }}
        />
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: dark ? "rgba(212,212,212,0.6)" : "rgba(64,64,64,0.55)" }}
        />
        <span
          className="ml-1.5 truncate"
          style={{ color: dark ? "rgba(212,212,212,0.4)" : "rgba(64,64,64,0.45)", fontSize: "9px" }}
        >
          {cfg.label}
        </span>
      </div>
      <div className="overflow-hidden px-2.5 py-2" style={{ height: `${cfg.rows * 1.55}em` }}>
        {lines.map((l, i) => (
          <div key={i} className="truncate" style={{ color: TONE_COLOR[l.tone] }}>
            {l.text}
          </div>
        ))}
        {!reduce && (
          <div className="truncate" style={{ color: TONE_COLOR[tone] }}>
            {partial}
            <span
              className="inline-block align-middle"
              style={{
                width: "0.5em",
                height: "1em",
                marginLeft: "1px",
                background: "currentColor",
                animation: "bgterm-blink 1s steps(1) infinite",
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default function BgTerminals() {
  const reduce =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const [paused, setPaused] = useState(false)
  const dark = useIsDark()

  useEffect(() => {
    const onVis = () => setPaused(document.hidden)
    onVis()
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{`@keyframes bgterm-blink{0%,49%{opacity:1}50%,100%{opacity:0}}`}</style>
      {TERMINALS.map((cfg) => (
        <Terminal key={cfg.label} cfg={cfg} paused={paused} reduce={reduce} dark={dark} />
      ))}
    </div>
  )
}
