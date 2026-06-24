/**
 * Central SEO site configuration.
 *
 * Single source of truth for canonical URL, brand strings, social profiles,
 * and metadata defaults. Import from here instead of re-deriving NEXT_PUBLIC_URL
 * or hardcoding the brand name in each route.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_URL || "https://iscalexchange.com").replace(
  /\/$/,
  "",
)

export const SITE_NAME = "iScaleXchange"

export const SITE_TAGLINE = "Post the problem. Exchange the solution."

export const SITE_DESCRIPTION =
  "A problem and solution exchange for online business operators, print-on-demand sellers, ecommerce workflows, and the tools that solve real problems."

/** Title template applied across routes for consistent SERP branding. */
export const TITLE_TEMPLATE = `%s | ${SITE_NAME}`

/** Default title used for the homepage / when a route sets no title. */
export const DEFAULT_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`

/** Public social / authority profiles for Organization `sameAs`. */
export const SOCIAL_PROFILES: string[] = ["https://github.com/iScale-Builders"]

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = ""): string {
  if (!path) return SITE_URL
  if (path.startsWith("http")) return path
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`
}

/** Absolute URL for a dynamically-generated OG image (see app/og/route.tsx). */
export function ogImage(params: { title: string; subtitle?: string; badge?: string }): string {
  const q = new URLSearchParams({ title: params.title })
  if (params.subtitle) q.set("subtitle", params.subtitle)
  if (params.badge) q.set("badge", params.badge)
  return absoluteUrl(`/og?${q.toString()}`)
}
