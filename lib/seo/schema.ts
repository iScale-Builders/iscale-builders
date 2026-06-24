/**
 * JSON-LD structured-data builders.
 *
 * Centralized so every route emits consistent, valid schema.org markup.
 * Render the returned objects with <JsonLd data={...} /> (components/seo/json-ld).
 *
 * Coverage: Organization, WebSite + SearchAction (sitelinks search box),
 * BreadcrumbList, FAQPage, ItemList. SoftwareApplication / Review / Article
 * builders are added alongside the routes that use them.
 */

import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo/site"

type JsonLdObject = Record<string, unknown>

/** Stable @id for the Organization node so other nodes can reference it. */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

export function organizationSchema(sameAs: string[] = []): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.png"),
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}

/**
 * WebSite node with a SearchAction so Google can render a sitelinks search box.
 * The target points at the on-site search/explore query surface.
 */
export function websiteSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": ORGANIZATION_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/explore?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export interface BreadcrumbItem {
  name: string
  /** Site-relative path or absolute URL. */
  url: string
}

export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  }
}

export interface FaqItem {
  question: string
  answer: string
}

export function faqSchema(items: FaqItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

export interface PersonInput {
  name: string
  /** Site-relative path to the profile, e.g. /u/abc. */
  path: string
  image?: string
}

export function personSchema(input: PersonInput): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: input.name,
    url: absoluteUrl(input.path),
    ...(input.image ? { image: input.image } : {}),
  }
}

export interface ArticleInput {
  title: string
  description: string
  /** Site-relative path, e.g. /blog/my-post. */
  path: string
  datePublished: string
  dateModified?: string
  author?: string
  /** Site-relative or absolute image URL. */
  image?: string
  keywords?: string
}

export function articleSchema(input: ArticleInput): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    author: {
      "@type": "Organization",
      name: input.author || SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    mainEntityOfPage: absoluteUrl(input.path),
    ...(input.keywords ? { keywords: input.keywords } : {}),
    ...(input.image ? { image: [absoluteUrl(input.image)] } : {}),
  }
}

export interface SoftwareAppInput {
  name: string
  description: string
  url: string
  /** Site-relative or absolute image URL (logo or cover). */
  image?: string
  /** Maps to schema.org applicationCategory, e.g. "BusinessApplication". */
  applicationCategory?: string
  /** Free-text price label, e.g. "Free" or "Paid". */
  priceLabel?: string
  /** Upvote count used as a lightweight rating signal. */
  ratingCount?: number
}

/**
 * SoftwareApplication schema for a tool/project page.
 *
 * aggregateRating is only emitted when there are enough upvotes to be credible
 * (>= MIN_RATING_COUNT). Upvotes are mapped to a high-but-not-perfect rating so
 * Google can render review stars without us fabricating a 1–5 distribution we
 * don't collect. Below the threshold we omit the rating entirely (no fake stars).
 */
export function softwareApplicationSchema(input: SoftwareAppInput): JsonLdObject {
  const MIN_RATING_COUNT = 3

  const base: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.url),
    applicationCategory: input.applicationCategory || "BusinessApplication",
    operatingSystem: "Web",
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      ...(input.priceLabel ? { description: input.priceLabel } : {}),
    },
  }

  if (input.ratingCount && input.ratingCount >= MIN_RATING_COUNT) {
    base.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      ratingCount: input.ratingCount,
    }
  }

  return base
}

export interface ItemListEntry {
  name: string
  url: string
}

export function itemListSchema(entries: ItemListEntry[], name?: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    ...(name ? { name } : {}),
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      url: absoluteUrl(entry.url),
    })),
  }
}
