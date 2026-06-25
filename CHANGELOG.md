# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.10.1] - 2026-06-25

### Changed

- Reworked the dashboard off the retired launch model: replaced the
  Active/Upcoming/Past "Launches" tabs (which keyed off launchStatus and no longer
  populate) with a single "My Projects" list, and removed the dead daily-winner
  "Badges" section.

## [0.10.0] - 2026-06-25

### Changed

- Reworked solution submission off the retired launch model: removed the "Launch
  Date" step (and launch-type selection) from the submit wizard, so posting a
  solution is now Project Info → Details → Review. New submissions go live
  immediately (`launchStatus: launched`) instead of being scheduled. (Problems
  were already launch-free.)

## [0.9.2] - 2026-06-25

### Fixed

- Vertically centered the ReadyPixl sponsor wordmark with its logo icon. The
  wordmark SVGs had ~18px of empty space below the glyphs in their `0 0 500 89`
  viewBox, so the centered `<img>` made the text sit high next to the icon.
  Cropped the viewBox to the glyph bounds (`0 0 500 71`) so the wordmark and icon
  share a centerline.

## [0.9.1] - 2026-06-25

### Fixed

- Listed solutions no longer render as "Coming soon / being prepared for launch."
  Launch scheduling is retired, so the project page now treats every published
  problem/solution as live, and upvoting is open for all publicly listed posts
  (only legacy payment-pending states stay closed). Display-layer fix, no DB
  migration.

## [0.9.0] - 2026-06-25

### Changed

- Retired the Open-Launch-era browse surfaces that no longer fit the
  problem/solution exchange: removed the `/winners` and `/trending` routes and
  all their links (nav, footer, dashboard, sitemap, command menu), rerouting
  discovery to `/explore`. Launch/winner database columns are left intact (no
  destructive migration) — the surfaces are simply no longer exposed.

## [0.8.0] - 2026-06-25

### Security

- Fixed an IDOR in launch scheduling: `scheduleLaunch` now derives the user from
  the server session and verifies project ownership instead of trusting a
  client-supplied user id.
- Removed two unauthenticated exported server actions
  (`updateProjectStatusToOngoing`, `updateProjectStatusToLaunched`); the launch
  lifecycle is owned solely by the `CRON_API_KEY`-protected cron route.
- Added baseline security headers (HSTS, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy, Permissions-Policy) to every response.
- Hardened `next/image`: disabled inline SVG, forced attachment disposition, and
  set a long minimum cache TTL to blunt the remote-image proxy/DoS surface.
- Added server-side validation of user-submitted URLs and field lengths in
  `submitProject`.

### Changed

- Added a CI workflow that type-checks (`tsc --noEmit`) and lints on every push/PR.
- Added top-level error boundaries so data-layer failures no longer 500 the page.
- Removed the stale `bun.lockb` (npm is the canonical package manager) and a
  broken `update-launches` script entry; renamed the package to `iscalexchange`.

## [0.4.4] - 2026-06-23

### Fixed

- Polished the ReadyPixl sponsor unit by centering the content, removing the
  nested wordmark box, and reducing excess padding.

## [0.4.3] - 2026-06-23

### Fixed

- Replaced the crashing listing-page comment widget with a native comment box
  backed by the existing comments API, so signed-in users can leave comments on
  coming-soon listings.

## [0.4.2] - 2026-06-23

### Fixed

- Fixed the ReadyPixl sponsor wordmark theme swap so light mode uses the dark
  wordmark and dark mode uses the light wordmark.
- Reworked the sponsor unit copy so `Sponsored by` appears above the ReadyPixl
  wordmark, with `Bulk image editing` underneath instead of a repeated typed
  brand name.

## [0.4.1] - 2026-06-23

### Added

- Added visible "Sponsored by ReadyPixl" placements to the global footer and
  project detail sidebar, using the official ReadyPixl wordmark and a sponsored
  outbound link.

## [0.4.0] - 2026-06-22

### Added

- Front-page "Trending now" is now a swipeable/arrow carousel of tools, so you can cycle through more listings before clicking in.
- Per-card image cycler: when a tool has more than one distinct image (cover / product / logo), cards show hover arrows + dots to flip through them.

## [0.3.2] - 2026-06-22

### Changed

- Image uploads are now downscaled (longest edge ≤1280px for covers, ≤512px for logos) and re-encoded to WebP (JPEG fallback) client-side before storing. Keeps cover images ~50-150KB instead of 1-2MB, so the catalog stays fast as it grows. Accepts originals up to 20MB and compresses them down.

## [0.3.1] - 2026-06-22

### Fixed

- Project/listing pages and many secondary pages were unfinished in the light theme: the `foundry-page` wrapper painted a grey wash, and leftover near-white accent text (`text-cyan-50/100`, `text-fuchsia-*`) was invisible on light cards (the "empty boxes"). Converted these to semantic theme tokens (`text-foreground` / `text-muted-foreground` / `bg-muted` / `border-border`) across the project detail page, blog, legal, payment, reviews, settings, profile, winners, not-found, design-lab, and the explore/home/winner card components. Now legible in both themes.

## [0.3.0] - 2026-06-22

### Changed

- New theme palettes: light = "Paws & Paths" (warm orange + sky blue on soft light), dark = "Dark Orbit / Totality" (gold + cyan on obsidian). Mapped onto the app's CSS theme tokens; accent ramps remain neutral grey for now.

## [0.2.4] - 2026-06-22

### Fixed

- Edit Project modal: added max-height + scroll so all fields and the Save/Cancel buttons are reachable without zooming out.
- Edit Project save failing on seeded tools: image validation rejected relative paths (e.g. `/images/apps/foo.png`) because it required absolute URLs. Now accepts relative paths, `data:` URLs, and absolute URLs.

## [0.2.3] - 2026-06-22

### Added

- Working upvote button on every listing (featured, trending, browse grid) — upvoting works for "coming soon" tools too (no launch-status gate).

### Changed

- Logo: recolored the remaining cyan glow to greyscale (removed the blue drop-shadow on the nav/footer logo), enlarged it, and changed the monogram to "iS" (lowercase i, uppercase S). Regenerated logo.png / icon.png / apple-touch-icon.png / favicon.ico.

## [0.2.2] - 2026-06-22

### Changed

- Every listing now shows who posted it (maker name + profile picture): restored on the homepage featured "Top tool" card and added to the Trending cards (the browse grid already showed it).

### Added

- "Trademarks" category (renamed the existing singular "Trademark" → "Trademarks" in the DB; data-only, no code).

## [0.2.1] - 2026-06-22

### Changed

- Simplified the homepage: the intro and the #1 tool now sit side by side above the fold, so the first tool is visible without scrolling.
- Removed homepage filler (neural cockpit, signal cards, command strip, command ribbon, decorative section kickers).
- Palette is now 100% neutral greyscale (zero saturation) so user-uploaded thumbnails are the only color.

### Removed

- Retired the "ALIVE" background experiment (terminals/rain/papyrus/HUD/boot) and all decorative page-background washes + the orbital hero image. Code kept behind `ALIVE_MODE=false`.

## [0.2.0] - 2026-06-22

### Added

- "ALIVE" experience layer on the homepage hero: background typing terminals, ion data-rain, scrolling digital glyph papyrus, command-center HUD (radar/oscilloscope/telemetry rings/live readouts), a self-typing headline, and a one-time boot overlay. Feature-flagged in `lib/alive.ts`.

### Changed

- Rebuilt the color system into real light + dark themes (previously dark-only) driven by CSS variables.
- Replaced the cyan/fuchsia/purple palette with a neutral warm-greyscale "deep space" system so colorful user-uploaded thumbnails no longer clash with the UI.

### Performance

- Alive layer pauses/unmounts when scrolled past the hero; canvas DPR capped to 1; removed canvas shadowBlur, "lighter" compositing, backdrop-blur, and SVG drop-shadow glows; animation loops throttled.

## [0.1.7] - 2026-06-22

### Changed

- Added a neural cockpit hero module with animated orbit rings, signal bars, active logs, and denser AI telemetry.
- Upgraded generated tool thumbnails into dark holographic instrument-style tiles.
- Added animated data rain and topographic interface layers behind the homepage.

## [0.1.6] - 2026-06-21

### Changed

- Hid the footer Pricing link until the public pricing surface is needed.

## [0.1.5] - 2026-06-21

### Fixed

- Disabled the broken Plausible browser script that was failing SSL on every page load.

## [0.1.4] - 2026-06-21

### Fixed

- Fixed anonymous visitors seeing a client-side crash on project pages when the comments widget auth check returned 401.

## [0.1.3] - 2026-06-21

### Fixed

- Fixed project detail pages crashing when a tool has no uploaded logo or product image.

## [0.1.2] - 2026-06-21

### Changed

- Added an AutoMerch-inspired builder command strip, agent queue panel, and live telemetry tiles to the homepage.
- Changed Trending Now on the homepage and Explore page to a four-card grid without horizontal scrolling.

## [0.1.1] - 2026-06-21

### Changed

- Rebranded the app to iScaleXchange.
- Updated public metadata, navigation, footer, badges, share text, notifications, and email copy for `iscalexchange.com`.
- Added a visible app version in the footer.

## [0.1.0] - 2024-05-02

### Added

- Initial release of Open Launch
- Core platform features:
  - Product discovery and listing
  - User authentication system
  - Voting and commenting system
  - Categories and trending sections
  - Admin dashboard
- Documentation:
  - README with project overview
  - CONTRIBUTING guidelines
  - CODE_OF_CONDUCT
  - LICENSE (MIT)
  - Legal pages (Terms, Privacy)
- Technical setup:
  - Next.js 15 with TypeScript
  - Tailwind CSS for styling
  - Drizzle ORM for database
  - Authentication system
  - File upload handling
  - Payment integration (Stripe)

### Changed

- N/A

### Deprecated

- N/A

### Removed

- N/A

### Fixed

- N/A

### Security

- N/A

[Unreleased]: https://github.com/iScale-Builders/iscale-builders/compare/v0.4.4...HEAD
[0.4.4]: https://github.com/iScale-Builders/iscale-builders/releases/tag/v0.4.4
[0.4.3]: https://github.com/iScale-Builders/iscale-builders/releases/tag/v0.4.3
[0.4.2]: https://github.com/iScale-Builders/iscale-builders/releases/tag/v0.4.2
[0.4.1]: https://github.com/iScale-Builders/iscale-builders/releases/tag/v0.4.1
[0.4.0]: https://github.com/iScale-Builders/iscale-builders/releases/tag/v0.4.0
[0.1.7]: https://github.com/iScale-Builders/iscale-builders/releases/tag/v0.1.7
[0.1.6]: https://github.com/iScale-Builders/iscale-builders/releases/tag/v0.1.6
[0.1.5]: https://github.com/iScale-Builders/iscale-builders/releases/tag/v0.1.5
[0.1.4]: https://github.com/iScale-Builders/iscale-builders/releases/tag/v0.1.4
[0.1.3]: https://github.com/iScale-Builders/iscale-builders/releases/tag/v0.1.3
[0.1.2]: https://github.com/iScale-Builders/iscale-builders/releases/tag/v0.1.2
[0.1.1]: https://github.com/iScale-Builders/iscale-builders/releases/tag/v0.1.1
[0.1.0]: https://github.com/iScale-Builders/iscale-builders/releases/tag/v0.1.0
