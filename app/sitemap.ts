import type { MetadataRoute } from "next"

import { db } from "@/drizzle/db"
import { blogArticle, category, project, seoArticle } from "@/drizzle/db/schema"

import { slugify } from "@/lib/seo/slug"
import { getComparePairs } from "@/app/actions/projects"

const siteUrl = process.env.NEXT_PUBLIC_URL || "https://iscalexchange.com"

// Resolve a usable absolute image URL for the image sitemap. Skips uploaded
// data: URIs (not crawlable) and makes site-relative paths absolute.
function sitemapImage(src: string | null | undefined): string[] {
  if (!src || src.startsWith("data:")) return []
  if (src.startsWith("http")) return [src]
  return [`${siteUrl}${src.startsWith("/") ? "" : "/"}${src}`]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/explore",
    "/problems",
    "/solutions",
    "/trending",
    "/categories",
    "/blog",
    "/reviews",
    "/how-we-review",
    "/winners",
    "/sponsors",
    "/legal",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }))

  let projects: {
    slug: string
    updatedAt: Date
    productImage: string | null
    coverImageUrl: string | null
    logoUrl: string
  }[] = []
  let blogArticles: { slug: string; updatedAt: Date; image: string | null }[] = []
  let reviewArticles: { slug: string; updatedAt: Date; image: string | null }[] = []
  let categories: { name: string; updatedAt: Date }[] = []

  try {
    ;[projects, blogArticles, reviewArticles, categories] = await Promise.all([
      db
        .select({
          slug: project.slug,
          updatedAt: project.updatedAt,
          productImage: project.productImage,
          coverImageUrl: project.coverImageUrl,
          logoUrl: project.logoUrl,
        })
        .from(project),
      db
        .select({
          slug: blogArticle.slug,
          updatedAt: blogArticle.updatedAt,
          image: blogArticle.image,
        })
        .from(blogArticle),
      db
        .select({ slug: seoArticle.slug, updatedAt: seoArticle.updatedAt, image: seoArticle.image })
        .from(seoArticle),
      db.select({ name: category.name, updatedAt: category.updatedAt }).from(category),
    ])
  } catch {
    projects = []
    blogArticles = []
    reviewArticles = []
    categories = []
  }

  const projectRoutes: MetadataRoute.Sitemap = projects.map((item) => ({
    url: `${siteUrl}/projects/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
    images: sitemapImage(item.productImage || item.coverImageUrl || item.logoUrl),
  }))

  // Programmatic "Best {category} tools" landing pages (slug derived from name).
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((item) => ({
    url: `${siteUrl}/categories/${slugify(item.name)}`,
    lastModified: item.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  // Programmatic "{tool} alternatives" pages (one per tool; thin ones self-noindex).
  const alternativeRoutes: MetadataRoute.Sitemap = projects.map((item) => ({
    url: `${siteUrl}/alternatives/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }))

  // Curated "{a} vs {b}" comparison pages. Guarded so a query failure can't break
  // the whole sitemap.
  let compareRoutes: MetadataRoute.Sitemap = []
  try {
    const pairs = await getComparePairs()
    compareRoutes = pairs.map((pair) => ({
      url: `${siteUrl}/compare/${pair}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }))
  } catch {
    compareRoutes = []
  }

  const blogRoutes: MetadataRoute.Sitemap = blogArticles.map((item) => ({
    url: `${siteUrl}/blog/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly",
    priority: 0.75,
    images: sitemapImage(item.image),
  }))

  const reviewRoutes: MetadataRoute.Sitemap = reviewArticles.map((item) => ({
    url: `${siteUrl}/reviews/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
    images: sitemapImage(item.image),
  }))

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...projectRoutes,
    ...alternativeRoutes,
    ...compareRoutes,
    ...blogRoutes,
    ...reviewRoutes,
  ]
}
