import { cn } from "@/lib/utils"

const palettes = [
  {
    bg: "from-cyan-950 via-[#0a0a0a] to-emerald-950",
    accent: "bg-cyan-300",
    chip: "border-cyan-200/24 bg-cyan-300/12 text-cyan-50",
  },
  {
    bg: "from-fuchsia-950 via-[#0a0a0a] to-cyan-950",
    accent: "bg-fuchsia-300",
    chip: "border-fuchsia-200/24 bg-fuchsia-300/12 text-fuchsia-50",
  },
  {
    bg: "from-emerald-950 via-[#0a0a0a] to-cyan-950",
    accent: "bg-emerald-300",
    chip: "border-emerald-200/24 bg-emerald-300/12 text-emerald-50",
  },
  {
    bg: "from-emerald-950 via-[#0a0a0a] to-fuchsia-950",
    accent: "bg-emerald-300",
    chip: "border-emerald-200/24 bg-emerald-300/12 text-emerald-50",
  },
]

function hashText(value: string) {
  return [...value].reduce((hash, char) => hash + char.charCodeAt(0), 0)
}

function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

interface ToolThumbnailProps {
  name: string
  category?: string
  slug?: string
  className?: string
  compact?: boolean
}

export function ToolThumbnail({
  name,
  category,
  slug,
  className,
  compact = false,
}: ToolThumbnailProps) {
  const palette = palettes[hashText(slug || name) % palettes.length]

  return (
    <div
      className={cn(
        "relative flex h-full w-full overflow-hidden bg-gradient-to-br",
        palette.bg,
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_22%,rgb(244_190_80_/_0.26),transparent_30%),radial-gradient(circle_at_76%_70%,rgb(255_150_70_/_0.18),transparent_32%)]" />
      <div className="absolute inset-0 [background-image:linear-gradient(rgb(255_255_255_/_0.10)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255_/_0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-50" />
      <div className="absolute inset-x-0 top-0 h-1 bg-white/10" />
      <div
        className={cn(
          "absolute top-0 left-0 h-1 w-2/5 shadow-[0_0_18px_rgb(244_190_80_/_0.5)]",
          palette.accent,
        )}
      />
      <div className="absolute top-8 right-6 h-24 w-24 rounded-full border border-cyan-100/18 shadow-[0_0_42px_rgb(244_190_80_/_0.16)]" />
      <div className="absolute top-12 right-10 h-16 w-16 rounded-full border border-fuchsia-100/18" />
      <div className="absolute right-3 bottom-3 grid grid-cols-3 gap-1 opacity-35">
        {Array.from({ length: 9 }).map((_, index) => (
          <span key={index} className="h-1.5 w-1.5 rounded-full bg-cyan-100" />
        ))}
      </div>

      <div className="relative flex h-full w-full flex-col justify-between p-4">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "rounded-md border px-2 py-1 text-[10px] font-black tracking-[0.08em] uppercase backdrop-blur-xl",
              palette.chip,
            )}
          >
            {category || "Tool"}
          </span>
          <span className="text-[10px] font-black tracking-[0.16em] text-cyan-50/54 uppercase">
            AI tool
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex shrink-0 items-center justify-center rounded-md text-sm font-bold text-white shadow-sm",
                compact ? "h-8 w-8" : "h-10 w-10",
                palette.accent,
                "text-[#0a0a0a] shadow-[0_0_26px_rgb(244_190_80_/_0.22)]",
              )}
            >
              {initialsFor(name)}
            </div>
            <div className="min-w-0">
              <p
                className={cn(
                  "text-foreground leading-tight font-bold",
                  "text-white",
                  compact ? "line-clamp-1 text-sm" : "line-clamp-2 text-lg",
                )}
              >
                {name}
              </p>
              {!compact && (
                <p className="mt-1 text-xs font-bold text-cyan-50/58">Community tool signal</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
