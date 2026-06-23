/**
 * IndexNow client — notify Bing, Yandex, and other IndexNow participants the
 * moment a URL is added or changed, instead of waiting for the next crawl.
 *
 * The key is published at `${SITE_URL}/${INDEXNOW_KEY}.txt` (IndexNow keys are
 * public by design — they only prove you control the host). Override via the
 * INDEXNOW_KEY env var if the key file is rotated.
 *
 * Google does not use IndexNow; for Google, rely on the sitemap + Search Console.
 */

import { SITE_URL } from "@/lib/seo/site"

export const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "0ca7a30b4587002027b4930e2cf2f23f"

const ENDPOINT = "https://api.indexnow.org/indexnow"
const MAX_URLS_PER_REQUEST = 10000

function host(): string {
  return new URL(SITE_URL).host
}

/**
 * Submit one or more absolute URLs to IndexNow. Returns the HTTP status (200/202
 * mean accepted) or null on network failure. Never throws — callers can fire it
 * without awaiting and ignore the result.
 */
export async function submitToIndexNow(urls: string[]): Promise<number | null> {
  const urlList = urls.filter(Boolean).slice(0, MAX_URLS_PER_REQUEST)
  if (urlList.length === 0) return null

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: host(),
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    })
    return res.status
  } catch {
    return null
  }
}

/** Convenience: submit a single site-relative path or absolute URL. */
export async function pingIndexNow(pathOrUrl: string): Promise<number | null> {
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${SITE_URL}${pathOrUrl}`
  return submitToIndexNow([url])
}
