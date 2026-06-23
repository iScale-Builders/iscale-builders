/**
 * Submit every URL in the live sitemap to IndexNow (Bing/Yandex/etc.).
 *
 * Run after a deploy that adds or changes pages:
 *   npx tsx scripts/submit-indexnow.ts
 *
 * Reads the production sitemap, extracts <loc> URLs, and posts them in one batch.
 * Google ignores IndexNow — submit the sitemap in Search Console for Google.
 */

import { submitToIndexNow } from "@/lib/seo/indexnow"
import { SITE_URL } from "@/lib/seo/site"

async function main() {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`
  console.log(`Fetching sitemap: ${sitemapUrl}`)

  const res = await fetch(sitemapUrl)
  if (!res.ok) {
    console.error(`Failed to fetch sitemap: HTTP ${res.status}`)
    process.exit(1)
  }

  const xml = await res.text()
  const urls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim())

  if (urls.length === 0) {
    console.error("No URLs found in sitemap.")
    process.exit(1)
  }

  console.log(`Submitting ${urls.length} URLs to IndexNow...`)
  const status = await submitToIndexNow(urls)

  if (status === 200 || status === 202) {
    console.log(`✓ IndexNow accepted (HTTP ${status}).`)
  } else {
    console.error(`IndexNow returned HTTP ${status ?? "network error"}.`)
    process.exit(1)
  }
}

main()
