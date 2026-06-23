import {
  RiBrainLine,
  RiFlashlightLine,
  RiPulseLine,
  RiRadarLine,
  RiRobot2Line,
  RiSparkling2Line,
} from "@remixicon/react"

interface AICommandRibbonProps {
  toolsCount: number
  categoriesCount: number
  mode?: "home" | "compact"
}

const commandSignals = [
  { label: "Agents online", value: "12", icon: RiRobot2Line },
  { label: "Signal scan", value: "Testing", icon: RiRadarLine },
  { label: "Idea engine", value: "Hot", icon: RiSparkling2Line },
  { label: "Build velocity", value: "Rising", icon: RiPulseLine },
]

export function AICommandRibbon({
  toolsCount,
  categoriesCount,
  mode = "home",
}: AICommandRibbonProps) {
  const density = Math.max(48, Math.min(98, toolsCount * 7 + categoriesCount * 3))

  return (
    <section
      className={`ai-command-ribbon scroll-live ${
        mode === "compact" ? "ai-command-ribbon-compact" : ""
      }`}
    >
      <div className="ai-ribbon-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="min-w-0">
        <div className="mb-3 flex items-center gap-2">
          <span className="border-border bg-muted grid h-9 w-9 place-items-center rounded-xl border shadow-[0_0_24px_rgb(0_229_255_/_0.18)]">
            <RiBrainLine className="text-foreground h-4 w-4" />
          </span>
          <div>
            <p className="text-muted-foreground text-[10px] font-black tracking-[0.24em] uppercase">
              AI operating layer
            </p>
            <h2 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
              The system is thinking with you.
            </h2>
          </div>
        </div>
        <div className="ai-density-meter">
          <div style={{ width: `${density}%` }} />
        </div>
      </div>

      <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {commandSignals.map((signal) => {
          const Icon = signal.icon

          return (
            <div key={signal.label} className="ai-signal-tile">
              <Icon className="text-foreground h-4 w-4" />
              <span>{signal.label}</span>
              <strong>{signal.value}</strong>
            </div>
          )
        })}
      </div>

      <div className="ai-ribbon-action">
        <RiFlashlightLine className="h-4 w-4" />
        <span>{toolsCount} tools</span>
        <span>{categoriesCount} lanes</span>
      </div>
    </section>
  )
}
