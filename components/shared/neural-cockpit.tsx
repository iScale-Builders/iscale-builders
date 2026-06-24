import {
  RiBrainLine,
  RiCommandLine,
  RiDatabase2Line,
  RiFlashlightLine,
  RiPulseLine,
  RiRadarLine,
  RiRobot2Line,
  RiSparkling2Line,
} from "@remixicon/react"

interface NeuralCockpitProps {
  toolsCount: number
  categoriesCount: number
  totalUpvotes: number
  signals: string[]
}

const cockpitLogs = [
  "Parsing builder intent",
  "Synthesizing tool graph",
  "Ranking launch signals",
  "Routing agent workflows",
]

export function NeuralCockpit({
  toolsCount,
  categoriesCount,
  totalUpvotes,
  signals,
}: NeuralCockpitProps) {
  const signalList =
    signals.length > 0
      ? signals.slice(0, 6)
      : ["Niche research", "Listing ops", "Mockups", "Automation", "Ad systems", "Launches"]
  const graphStrength = Math.max(62, Math.min(99, toolsCount * 5 + categoriesCount * 4))

  return (
    <div className="neural-cockpit" aria-label="iScaleXchange AI command cockpit">
      <div className="neural-cockpit__matrix" aria-hidden="true" />
      <div className="neural-cockpit__header">
        <div>
          <p>Autonomous interface core</p>
          <h2>Builder OS live model</h2>
        </div>
        <span>
          <RiRobot2Line className="h-4 w-4" />
          active
        </span>
      </div>

      <div className="neural-cockpit__body">
        <div className="neural-orbital" aria-hidden="true">
          <span className="neural-orbital__ring neural-orbital__ring--one" />
          <span className="neural-orbital__ring neural-orbital__ring--two" />
          <span className="neural-orbital__ring neural-orbital__ring--three" />
          <span className="neural-orbital__beam neural-orbital__beam--a" />
          <span className="neural-orbital__beam neural-orbital__beam--b" />
          <span className="neural-orbital__node neural-orbital__node--a" />
          <span className="neural-orbital__node neural-orbital__node--b" />
          <span className="neural-orbital__node neural-orbital__node--c" />
          <div className="neural-orbital__core">
            <RiBrainLine className="h-9 w-9" />
            <strong>{graphStrength}%</strong>
            <small>signal</small>
          </div>
        </div>

        <div className="neural-console">
          <div className="neural-stat-grid">
            <NeuralStat
              icon={RiDatabase2Line}
              label="Tools"
              value={toolsCount.toLocaleString("en-US")}
            />
            <NeuralStat
              icon={RiCommandLine}
              label="Lanes"
              value={categoriesCount.toLocaleString("en-US")}
            />
            <NeuralStat
              icon={RiPulseLine}
              label="Votes"
              value={totalUpvotes.toLocaleString("en-US")}
            />
          </div>

          <div className="neural-signal-stack">
            {signalList.map((signal, index) => (
              <div key={signal} className="neural-signal-row">
                <span>{signal}</span>
                <div>
                  <i style={{ width: `${94 - index * 7}%` }} />
                </div>
                <strong>{94 - index * 7}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="neural-log-grid">
        {cockpitLogs.map((log, index) => (
          <div key={log} className="neural-log-row">
            {index === 0 ? (
              <RiSparkling2Line className="h-3.5 w-3.5" />
            ) : index === 1 ? (
              <RiRadarLine className="h-3.5 w-3.5" />
            ) : index === 2 ? (
              <RiFlashlightLine className="h-3.5 w-3.5" />
            ) : (
              <RiCommandLine className="h-3.5 w-3.5" />
            )}
            <span>{log}</span>
            <strong>0{index + 1}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function NeuralStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof RiBrainLine
  label: string
  value: string
}) {
  return (
    <div className="neural-stat">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
