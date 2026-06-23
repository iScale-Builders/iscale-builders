// Feature flags for the exaggerated "ALIVE" experience layer (components/alive).
// Flip ALIVE_MODE to false to fully disable every alive effect in one place.
// Retired 2026-06-22: the "alive" background experiment was too heavy / busy.
// Kept in the tree (flag off) in case we want pieces later; nothing renders.
export const ALIVE_MODE = false
export const ALIVE_BOOT = false

// Per-effect kill switches — set any to false to drop that single effect.
// (rain + papyrus are the heaviest; turn these off first if perf is tight.)
export const ALIVE_RAIN = true
export const ALIVE_PAPYRUS = true
export const ALIVE_TERMINALS = true
export const ALIVE_HUD = true

// The background canvases/HUD only matter on the hero. We pause/unmount them
// once the user scrolls this many viewport-heights down, so scrolling the long
// content page costs nothing. Lower = pauses sooner.
export const ALIVE_VIEWPORT_CUTOFF = 1.3
