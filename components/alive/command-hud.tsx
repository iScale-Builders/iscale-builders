"use client"

import { useEffect, useRef, useState } from "react"

/* Sun palette per theme.
   CYAN slot -> gold (dark) / warm dark ink (light)
   FUCHSIA slot -> ember (dark) / deep ember (light)
   EMERALD slot -> sand (dark) / amber (light) */
type Palette = { cyan: string; fuchsia: string; emerald: string }

const PALETTE_DARK: Palette = {
  cyan: "rgb(212,212,212)",
  fuchsia: "rgb(163,163,163)",
  emerald: "rgb(212,212,212)",
}
const PALETTE_LIGHT: Palette = {
  cyan: "rgb(64,64,64)",
  fuchsia: "rgb(82,82,82)",
  emerald: "rgb(115,115,115)",
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

type Corner = {
  pos: string
  rot: number
  label: string
  // Which palette slot this corner uses.
  tone: "cyan" | "emerald"
}

const CORNERS: Corner[] = [
  { pos: "top-3 left-3", rot: 0, label: "SECTOR-7G", tone: "cyan" },
  { pos: "top-3 right-3", rot: 90, label: "UPLINK", tone: "emerald" },
  { pos: "bottom-3 left-3", rot: 270, label: "GRID 3042", tone: "cyan" },
  { pos: "bottom-3 right-3", rot: 180, label: "SYS-NOMINAL", tone: "emerald" },
]

function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduce(mq.matches)
    const onChange = () => setReduce(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return reduce
}

function CornerBracket({ corner, palette }: { corner: Corner; palette: Palette }) {
  const color = palette[corner.tone]
  return (
    <div className={`absolute ${corner.pos} flex flex-col items-start`}>
      <svg
        width="84"
        height="84"
        viewBox="0 0 84 84"
        style={{
          transform: `rotate(${corner.rot}deg)`,
        }}
      >
        <path
          d="M4 30 L4 4 L30 4"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M14 44 L14 14 L44 14"
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <circle cx="4" cy="4" r="2.5" fill={color} />
      </svg>
      <span className="hud-pulse mt-0.5 font-mono text-[9px] tracking-[0.25em]" style={{ color }}>
        {corner.label}
      </span>
    </div>
  )
}

function Radar({ reduce, palette }: { reduce: boolean; palette: Palette }) {
  const { cyan: CYAN, fuchsia: FUCHSIA, emerald: EMERALD } = palette
  return (
    <div className="absolute bottom-6 left-6">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <defs>
          <linearGradient
            id="hud-sweep"
            x1="60"
            y1="60"
            x2="120"
            y2="60"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={CYAN} stopOpacity="0.7" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[54, 38, 22].map((r) => (
          <circle
            key={r}
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={CYAN}
            strokeWidth="0.75"
            strokeOpacity="0.4"
          />
        ))}
        <line
          x1="6"
          y1="60"
          x2="114"
          y2="60"
          stroke={CYAN}
          strokeWidth="0.5"
          strokeOpacity="0.25"
        />
        <line
          x1="60"
          y1="6"
          x2="60"
          y2="114"
          stroke={CYAN}
          strokeWidth="0.5"
          strokeOpacity="0.25"
        />
        <g
          style={
            reduce
              ? undefined
              : { transformOrigin: "60px 60px", animation: "hud-radar-spin 4s linear infinite" }
          }
        >
          <path d="M60 60 L114 60 A54 54 0 0 1 96 102 Z" fill="url(#hud-sweep)" />
          <line x1="60" y1="60" x2="114" y2="60" stroke={CYAN} strokeWidth="1.5" />
        </g>
        <circle cx="84" cy="44" r="2" fill={FUCHSIA}>
          {!reduce && (
            <animate attributeName="opacity" values="1;0.1;1" dur="2.2s" repeatCount="indefinite" />
          )}
        </circle>
        <circle cx="40" cy="78" r="1.5" fill={EMERALD}>
          {!reduce && (
            <animate
              attributeName="opacity"
              values="0.2;1;0.2"
              dur="3.1s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      </svg>
    </div>
  )
}

function TelemetryRings({ reduce, palette }: { reduce: boolean; palette: Palette }) {
  const { cyan: CYAN, fuchsia: FUCHSIA, emerald: EMERALD } = palette
  return (
    <div className="absolute top-6 right-6">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <g
          style={
            reduce
              ? undefined
              : { transformOrigin: "55px 55px", animation: "hud-ring-spin 9s linear infinite" }
          }
        >
          <circle
            cx="55"
            cy="55"
            r="48"
            fill="none"
            stroke={CYAN}
            strokeWidth="1"
            strokeDasharray="2 6"
            strokeOpacity="0.6"
          />
        </g>
        <g
          style={
            reduce
              ? undefined
              : { transformOrigin: "55px 55px", animation: "hud-ring-spin-rev 6s linear infinite" }
          }
        >
          <circle
            cx="55"
            cy="55"
            r="36"
            fill="none"
            stroke={FUCHSIA}
            strokeWidth="1.5"
            strokeDasharray="14 8"
            strokeOpacity="0.55"
          />
        </g>
        <g
          style={
            reduce
              ? undefined
              : { transformOrigin: "55px 55px", animation: "hud-ring-spin 3.5s linear infinite" }
          }
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2
            const x1 = 55 + Math.cos(a) * 22
            const y1 = 55 + Math.sin(a) * 22
            const x2 = 55 + Math.cos(a) * 28
            const y2 = 55 + Math.sin(a) * 28
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={EMERALD}
                strokeWidth="1"
                strokeOpacity="0.7"
              />
            )
          })}
        </g>
      </svg>
    </div>
  )
}

function Oscilloscope({ reduce, palette }: { reduce: boolean; palette: Palette }) {
  const { emerald: EMERALD } = palette
  const W = 200
  const H = 40
  const N = 48
  const [points, setPoints] = useState<string>(() =>
    Array.from({ length: N }, (_, i) => `${(i / (N - 1)) * W},${H / 2}`).join(" "),
  )
  const phase = useRef(0)

  useEffect(() => {
    if (reduce) return
    let raf = 0
    let last = 0
    const frameInterval = 1000 / 20
    const tick = (now: number) => {
      if (now - last < frameInterval) {
        raf = requestAnimationFrame(tick)
        return
      }
      last = now
      if (!document.hidden) {
        phase.current += 0.18
        const p = phase.current
        const pts: string[] = []
        for (let i = 0; i < N; i++) {
          const x = (i / (N - 1)) * W
          const y =
            H / 2 +
            Math.sin(i * 0.55 + p) * 10 +
            Math.sin(i * 0.21 - p * 1.7) * 5 +
            (Math.random() - 0.5) * 2
          pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
        }
        setPoints(pts.join(" "))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <line
          x1="0"
          y1={H / 2}
          x2={W}
          y2={H / 2}
          stroke={EMERALD}
          strokeWidth="0.5"
          strokeOpacity="0.2"
        />
        <polyline
          points={points}
          fill="none"
          stroke={EMERALD}
          strokeWidth="1.25"
          strokeOpacity="0.85"
        />
      </svg>
    </div>
  )
}

type Readout = { label: string; value: number; suffix: string; decimals: number; group: boolean }

function Readouts({ reduce, palette }: { reduce: boolean; palette: Palette }) {
  const { cyan: CYAN, fuchsia: FUCHSIA, emerald: EMERALD } = palette
  const [data, setData] = useState<Readout[]>([
    { label: "THROUGHPUT", value: 9412, suffix: " ops/s", decimals: 0, group: true },
    { label: "LATENCY", value: 0.042, suffix: " ms", decimals: 3, group: false },
    { label: "NODES", value: 1287, suffix: " online", decimals: 0, group: true },
  ])

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => {
      if (document.hidden) return
      setData((prev) =>
        prev.map((r) => {
          if (r.label === "THROUGHPUT")
            return { ...r, value: 9000 + Math.round(Math.random() * 990) }
          if (r.label === "LATENCY") return { ...r, value: 0.02 + Math.random() * 0.06 }
          return { ...r, value: 1200 + Math.round(Math.random() * 99) }
        }),
      )
    }, 1100)
    return () => window.clearInterval(id)
  }, [reduce])

  const fmt = (r: Readout) => {
    const n = r.value.toFixed(r.decimals)
    return r.group ? Number(n).toLocaleString("en-US") : n
  }

  return (
    <div className="absolute right-6 bottom-6 flex flex-col items-end gap-1 font-mono text-[10px] tracking-[0.18em]">
      {data.map((r) => (
        <div key={r.label} className="flex items-baseline gap-2">
          <span style={{ color: FUCHSIA, opacity: 0.7 }}>{r.label}</span>
          <span style={{ color: CYAN }}>
            {fmt(r)}
            {r.suffix}
          </span>
        </div>
      ))}
      <div className="flex items-baseline gap-2">
        <span style={{ color: FUCHSIA, opacity: 0.7 }}>YEAR</span>
        <span style={{ color: EMERALD }}>3042</span>
      </div>
    </div>
  )
}

export default function CommandHud() {
  const reduce = useReducedMotion()
  const dark = useIsDark()
  const palette = dark ? PALETTE_DARK : PALETTE_LIGHT

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      <style>{`
        @keyframes hud-radar-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes hud-ring-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes hud-ring-spin-rev { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes hud-pulse { 0%,100% { opacity: 0.35; } 50% { opacity: 0.85; } }
        .hud-pulse { animation: hud-pulse 2.6s ease-in-out infinite; }
        ${reduce ? `.hud-pulse { animation: none; opacity: 0.6; }` : ""}
      `}</style>

      <div style={{ opacity: dark ? 0.5 : 0.32 }}>
        {CORNERS.map((c) => (
          <CornerBracket key={c.label} corner={c} palette={palette} />
        ))}
        <Radar reduce={reduce} palette={palette} />
        <TelemetryRings reduce={reduce} palette={palette} />
        <Oscilloscope reduce={reduce} palette={palette} />
        <Readouts reduce={reduce} palette={palette} />
      </div>
    </div>
  )
}
