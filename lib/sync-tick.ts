// One shared clock so every auto-cycling thumbnail advances on the SAME beat
// (in unison), instead of each card running its own staggered timer. Pauses
// when the tab is hidden. A single interval is shared across all subscribers.

type Listener = () => void

const listeners = new Set<Listener>()
let timer: ReturnType<typeof setInterval> | null = null

const INTERVAL_MS = 6000

function fire() {
  if (typeof document !== "undefined" && document.hidden) return
  listeners.forEach((l) => l())
}

export function subscribeTick(fn: Listener): () => void {
  listeners.add(fn)
  if (!timer && typeof window !== "undefined") {
    timer = setInterval(fire, INTERVAL_MS)
  }
  return () => {
    listeners.delete(fn)
    if (listeners.size === 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }
}
