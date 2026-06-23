"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

import {
  RiArrowRightUpLine,
  RiBrainLine,
  RiCheckboxCircleFill,
  RiCommandLine,
  RiFlashlightLine,
  RiFolderChartLine,
  RiGlobalLine,
  RiPlanetLine,
  RiRadarLine,
  RiRocket2Line,
  RiSearchEyeLine,
  RiShieldCheckLine,
  RiSparkling2Line,
  RiUploadCloud2Line,
} from "@remixicon/react"

import { Button } from "@/components/ui/button"

const modes = [
  {
    key: "discover",
    label: "Discover",
    eyebrow: "Tool radar",
    title: "Find the next builder advantage before the market sees it.",
    accent: "from-cyan-300 to-blue-500",
    icon: RiSearchEyeLine,
  },
  {
    key: "compose",
    label: "Compose",
    eyebrow: "AI assembly",
    title: "Turn scattered tools into repeatable builder workflows.",
    accent: "from-fuchsia-300 to-violet-500",
    icon: RiBrainLine,
  },
  {
    key: "launch",
    label: "Launch",
    eyebrow: "Foundry output",
    title: "Publish, rank, and improve with one living launch system.",
    accent: "from-emerald-300 to-cyan-400",
    icon: RiRocket2Line,
  },
]

const toolCores = [
  { name: "Niche Scanner", type: "Research", x: "left-[8%]", y: "top-[18%]", delay: "0s" },
  { name: "Listing Engine", type: "Copy", x: "right-[13%]", y: "top-[12%]", delay: "0.2s" },
  { name: "Mockup Forge", type: "Visuals", x: "left-[14%]", y: "bottom-[18%]", delay: "0.4s" },
  { name: "Trademark Gate", type: "Safety", x: "right-[9%]", y: "bottom-[20%]", delay: "0.6s" },
]

const systems = [
  { label: "Research", value: "91", icon: RiRadarLine },
  { label: "Build", value: "78", icon: RiCommandLine },
  { label: "Protect", value: "64", icon: RiShieldCheckLine },
  { label: "Launch", value: "86", icon: RiUploadCloud2Line },
]

const checks = [
  "No stock-photo thumbnails",
  "Tool-first launch surface",
  "Future interface direction",
  "Ready for real uploads",
]

export function OrbitalFoundryClient() {
  const [activeMode, setActiveMode] = useState(modes[0])

  const activeIndex = useMemo(
    () => modes.findIndex((mode) => mode.key === activeMode.key),
    [activeMode.key],
  )

  const ActiveIcon = activeMode.icon

  return (
    <main className="bg-background text-foreground min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_14%,rgb(244_190_80_/_0.22),transparent_24%),radial-gradient(circle_at_78%_8%,rgb(255_150_70_/_0.18),transparent_26%),radial-gradient(circle_at_50%_85%,rgb(220_198_150_/_0.12),transparent_28%),linear-gradient(180deg,#15110c_0%,#0a0a0a_55%,#000_100%)]" />
      <div className="pointer-events-none fixed inset-0 [background-image:linear-gradient(rgb(255_255_255_/_0.11)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255_/_0.08)_1px,transparent_1px)] [background-size:64px_64px] opacity-[0.16]" />

      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="border-border flex items-center justify-between gap-4 border-b py-4">
          <Link href="/" className="group flex items-center gap-3">
            <span className="border-border bg-muted grid h-10 w-10 place-items-center rounded-lg border">
              <RiPlanetLine className="text-foreground h-5 w-5" />
            </span>
            <span>
              <span className="text-foreground block text-sm font-black tracking-[0.22em] uppercase">
                iScaleBuilders
              </span>
              <span className="text-muted-foreground block text-xs">Orbital AI Foundry</span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {modes.map((mode) => {
              const Icon = mode.icon
              const isActive = mode.key === activeMode.key

              return (
                <button
                  key={mode.key}
                  type="button"
                  onClick={() => setActiveMode(mode)}
                  className={`flex h-10 items-center gap-2 rounded-full border px-4 text-xs font-bold transition ${
                    isActive
                      ? "border-border bg-muted text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {mode.label}
                </button>
              )
            })}
          </div>

          <Button
            asChild
            variant="secondary"
            className="bg-primary text-primary-foreground h-10 rounded-full hover:bg-cyan-100"
          >
            <Link href="/">
              Back
              <RiArrowRightUpLine className="h-4 w-4" />
            </Link>
          </Button>
        </header>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:py-12">
          <section className="max-w-2xl">
            <div className="border-border bg-muted text-foreground mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold shadow-[0_0_18px_rgb(255_150_70_/_0.16)]">
              <RiSparkling2Line className="h-4 w-4" />
              AI-native interface direction
            </div>

            <p className="text-muted-foreground text-xs font-black tracking-[0.48em] uppercase">
              {activeMode.eyebrow}
            </p>
            <h1 className="text-foreground mt-5 text-5xl leading-[0.92] font-black tracking-tight sm:text-6xl lg:text-7xl">
              Build from the future.
            </h1>
            <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-8">
              iScaleBuilders becomes a living command system for AI tools: orbiting categories,
              workflow telemetry, launch gates, and a front page that feels impossible to confuse
              with another product directory.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                className="text-primary-foreground h-12 rounded-full bg-cyan-200 px-6 hover:bg-cyan-100"
                onClick={() => setActiveMode(modes[(activeIndex + 1) % modes.length])}
              >
                Shift mode
                <ActiveIcon className="h-4 w-4" />
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-border bg-card text-foreground hover:bg-muted/40 hover:text-foreground h-12 rounded-full px-6"
              >
                <Link href="/submit">
                  Start uploading
                  <RiUploadCloud2Line className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {checks.map((check) => (
                <div
                  key={check}
                  className="border-border bg-card text-muted-foreground flex items-center gap-2 rounded-lg border px-3 py-3 text-sm"
                >
                  <RiCheckboxCircleFill className="h-4 w-4 text-emerald-300" />
                  {check}
                </div>
              ))}
            </div>
          </section>

          <section className="relative min-h-[560px]">
            <div className="bg-muted/28 border-border absolute inset-0 rounded-[2rem] border backdrop-blur-md" />
            <div className="border-border absolute inset-5 rounded-[1.5rem] border bg-[linear-gradient(145deg,rgb(255_255_255_/_0.08),rgb(255_255_255_/_0.015))]" />

            <div className="absolute inset-0 grid place-items-center">
              <div className="border-border relative grid h-72 w-72 place-items-center rounded-full border sm:h-96 sm:w-96">
                <div className="border-border absolute inset-7 rounded-full border" />
                <div className="absolute inset-16 rounded-full border border-emerald-200/18" />
                <div
                  className={`absolute h-40 w-40 rounded-full bg-gradient-to-br ${activeMode.accent} p-[2px] transition-all duration-500 sm:h-52 sm:w-52`}
                >
                  <div className="bg-background flex h-full w-full flex-col items-center justify-center rounded-full text-center">
                    <ActiveIcon className="text-foreground mb-4 h-9 w-9" />
                    <span className="text-5xl font-black tracking-tight">
                      {systems[activeIndex].value}
                    </span>
                    <span className="text-muted-foreground mt-2 text-xs font-bold tracking-[0.24em] uppercase">
                      {systems[activeIndex].label}
                    </span>
                  </div>
                </div>

                {toolCores.map((core) => (
                  <div
                    key={core.name}
                    className={`absolute ${core.x} ${core.y} bg-background/90 border-border hover:border-border hover: w-36 rounded-xl border p-3 backdrop-blur-md transition duration-500 hover:-translate-y-1`}
                    style={{ animation: `float-core 4.8s ease-in-out ${core.delay} infinite` }}
                  >
                    <div className="mb-3 h-1 rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-emerald-200" />
                    <p className="text-foreground text-sm font-black">{core.name}</p>
                    <p className="text-muted-foreground mt-1 text-xs">{core.type}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute right-6 bottom-6 left-6 grid gap-3 sm:grid-cols-4">
              {systems.map((system, index) => {
                const Icon = system.icon

                return (
                  <button
                    key={system.label}
                    type="button"
                    onClick={() => setActiveMode(modes[index % modes.length])}
                    className="group border-border bg-card hover:border-border hover:bg-muted rounded-xl border p-3 text-left backdrop-blur-md transition"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <Icon className="text-foreground h-4 w-4" />
                      <span className="text-muted-foreground text-xs font-black">
                        {system.value}%
                      </span>
                    </div>
                    <p className="text-foreground text-xs font-bold">{system.label}</p>
                    <div className="bg-muted mt-2 h-1.5 overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-300 transition-all group-hover:to-emerald-200"
                        style={{ width: `${system.value}%` }}
                      />
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        </div>

        <section className="grid gap-4 pb-8 md:grid-cols-3">
          <FuturePanel
            icon={RiGlobalLine}
            title="Not a directory"
            body="The home page can behave like a map of builder systems, not a flat wall of product cards."
          />
          <FuturePanel
            icon={RiFolderChartLine}
            title="Tool thumbnails"
            body="Every upload becomes a distinct tool object with title, category, status, and launch signal."
          />
          <FuturePanel
            icon={RiFlashlightLine}
            title="Only-AI energy"
            body="Motion, depth, telemetry, and adaptive panels make the interface feel generated by the future."
          />
        </section>
      </section>

      <style jsx global>{`
        @keyframes float-core {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -10px, 0);
          }
        }
      `}</style>
    </main>
  )
}

function FuturePanel({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof RiGlobalLine
  title: string
  body: string
}) {
  return (
    <article className="border-border bg-card rounded-2xl border p-5 shadow-[0_18px_48px_rgb(0_0_0_/_0.24)] backdrop-blur-md">
      <span className="border-border bg-muted text-foreground grid h-10 w-10 place-items-center rounded-lg border">
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="text-foreground mt-5 text-lg font-black">{title}</h2>
      <p className="text-muted-foreground mt-2 text-sm leading-6">{body}</p>
    </article>
  )
}
