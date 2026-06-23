# Palette — "Deep Space" (warm GREYSCALE)

Direction (current): NEAR-MONOCHROME warm greyscale so colorful user-uploaded
thumbnails are the only saturated thing on the page and never clash. Dark =
warm near-black + platinum/taupe accents; light = warm off-white + charcoal.
A whisper of warmth (hue ~30-40°, saturation only ~6-14%), NOT cold steel.
NO saturated gold/ember/cyan/fuchsia/blue/purple/green anywhere. (red kept only
as functional --destructive.)

History: started as cyan/fuchsia "AI slop" → "Space Black & Sun" (gold/ember) →
desaturated to this greyscale on 2026-06-22 (gold clashed with thumbnails).
The accent ramps + raw RGB below are the GREY values; do not reintroduce gold.

## Semantic tokens (hsl) — current GREYSCALE values

DARK (`.dark`):

- background 30 7% 5% | foreground 40 8% 90%
- card 32 7% 9% | card-foreground 40 8% 90% | popover 32 7% 8%
- muted 34 6% 16% | muted-foreground 38 7% 64%
- border 40 12% 72% / 0.13 | input 40 12% 72% / 0.17
- primary 40 12% 72% (warm platinum) | primary-foreground 30 12% 10%
- secondary 34 7% 14% | secondary-foreground 40 8% 88%
- accent 34 9% 58% (taupe) | accent-foreground 30 12% 10%
- ring 40 12% 72% | destructive 8 62% 52% (kept functional)

LIGHT (`:root`):

- background 36 14% 96% (warm off-white) | foreground 28 8% 14%
- card 40 12% 99% | card-foreground 28 8% 14% | popover 40 12% 99%
- muted 36 10% 92% | muted-foreground 30 6% 42%
- border 34 10% 85% | input 34 10% 82%
- primary 30 10% 28% (charcoal) | primary-foreground 40 18% 97%
- secondary 36 10% 90% | secondary-foreground 28 10% 20%
- accent 32 10% 34% | accent-foreground 40 18% 97%
- ring 30 10% 40% | destructive 6 58% 48% (kept functional)

## Tailwind ramp remap (ALL accent families → one warm-grey taupe ramp)

cyan/fuchsia/emerald/teal/blue/sky/indigo/violet/purple/amber/orange/yellow all map to:
50 #f3f1ec 100 #e7e3da 200 #d3ccbf 300 #bcb3a2 400 #a39a88 500 #897f6e 600 #6e6555 700 #564e42 800 #3c3730 900 #2a2620 950 #1a1713
(red kept functional only via --destructive.)

## Raw RGB for canvas / inline styles (alive components) — GREYSCALE

- glyph/accent rgb(190,182,166) | white-hot rgb(255,244,224) | mid rgb(170,160,146) | dim rgb(186,178,162)
- space-black bg rgb(13,11,9)
- LIGHT-theme ink (when <html> has NO `dark` class): warm dark ink rgb(70,52,28),
  lower opacity, minimal glow — reads as subtle texture on off-white.

## Structural dark → token mapping (per-file, for light-theme support)

- `bg-[#02030a]` / `bg-black` (opaque page bg) → `bg-background`
- `text-white` → `text-foreground`
- `text-white/NN` → `text-foreground/NN` (or `text-muted-foreground` for ~55-70%)
- `border-white/NN` → `border-border`
- glass `bg-white/[0.0x]` / `bg-white/5` (surfaces) → `bg-card` (drop translucency) + `text-foreground`
- `bg-black/NN` small insets → `bg-muted/NN`
- hardcoded dark overlay gradients (#02030a/rgb(2 3 10)) → prefix with `dark:` (omit in light) or `from-background`
- neutral shadows `rgb(0 0 0/..)` → keep
- DO NOT touch `cyan-*` / `fuchsia-*` / `emerald-*` classes — they recolor centrally.
- Color/theme only. Preserve all layout, spacing, props, logic.
