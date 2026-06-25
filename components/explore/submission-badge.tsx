import { RiEmotionHappyFill, RiEmotionUnhappyFill } from "@remixicon/react"

import { cn } from "@/lib/utils"

// Little face badge that marks a listing as a solution (happy) or a problem (sad).
export function SubmissionBadge({
  type,
  className,
}: {
  type?: string | null
  className?: string
}) {
  const isProblem = type === "problem"
  const Icon = isProblem ? RiEmotionUnhappyFill : RiEmotionHappyFill
  return (
    <span
      aria-label={isProblem ? "Problem" : "Solution"}
      title={isProblem ? "Problem" : "Solution"}
      className={cn(
        "inline-flex items-center justify-center rounded-full border p-1 shadow-sm backdrop-blur transition-transform group-hover:-translate-y-0.5",
        isProblem
          ? "border-rose-300/60 bg-rose-50/90 text-rose-600 dark:border-rose-800/70 dark:bg-rose-950/70 dark:text-rose-300"
          : "border-emerald-300/60 bg-emerald-50/90 text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/70 dark:text-emerald-300",
        className,
      )}
    >
      <Icon className="h-4 w-4" />
    </span>
  )
}
