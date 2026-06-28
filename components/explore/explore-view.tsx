/* eslint-disable @next/next/no-img-element */
import Image from "next/image"
import Link from "next/link"

import { RiArrowRightLine, RiFireLine, RiMessage2Line, RiThumbUpFill } from "@remixicon/react"

import { toolStatusLabel } from "@/lib/tool-status"
import { Button } from "@/components/ui/button"
import { ExploreGridCard } from "@/components/explore/explore-grid-card"
import { ExploreTrendingCard } from "@/components/explore/explore-trending-card"
import { ToolThumbnail } from "@/components/shared/tool-thumbnail"
import type { ExploreProject } from "@/app/actions/explore"

export function thumbnailFor(productImage: string | null, coverImageUrl: string | null) {
  return productImage || coverImageUrl
}

// Distinct images for a tool, in display order, for the per-card image cycler.
export function galleryFor(p: {
  galleryImages?: string[] | null
  productImage?: string | null
  coverImageUrl?: string | null
  logoUrl?: string | null
}): string[] {
  const logoUrl = p.logoUrl?.trim()
  const savedGallery = p.galleryImages
    ?.map((x) => x?.trim())
    .filter((image): image is string => {
      return Boolean(image) && image !== logoUrl
    })
    .slice(0, 10)
  if (savedGallery?.length) return Array.from(new Set(savedGallery))

  return Array.from(
    new Set(
      [p.productImage, p.coverImageUrl].filter((x): x is string => !!x && x.trim().length > 0),
    ),
  )
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

interface ExploreViewProps {
  projects: ExploreProject[]
  isAuthenticated?: boolean
}

export function ExploreView({ projects, isAuthenticated = false }: ExploreViewProps) {
  const [featured, ...rest] = projects
  const trending = rest.slice(0, 4)
  const grid = rest
  const featuredGallery = featured ? galleryFor(featured) : []
  const featuredThumbnail = featuredGallery[0] || null
  const featuredIsUploadedDataImage = featuredThumbnail?.startsWith("data:image/")

  if (projects.length === 0) {
    return (
      <div className="foundry-panel flex flex-col items-center justify-center gap-3 rounded-2xl border-dashed py-20 text-center">
        <RiFireLine className="text-muted-foreground h-8 w-8" />
        <h2 className="font-heading text-foreground text-lg font-black">No solutions yet</h2>
        <p className="text-muted-foreground max-w-md text-sm">
          Once solutions are connected to the exchange, they&apos;ll appear here.
        </p>
        <Button asChild className="mt-2">
          <Link href="/projects/submit">Post a solution</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* 1. FEATURED HERO */}
      {featured && (
        <section>
          <Link
            href={`/projects/${featured.slug}`}
            prefetch={false}
            className="foundry-card group relative grid grid-cols-1 overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 lg:grid-cols-2"
          >
            {/* Cover */}
            <div className="bg-muted relative aspect-[16/10] w-full overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[340px]">
              {featuredThumbnail && featuredIsUploadedDataImage ? (
                <img
                  src={featuredThumbnail}
                  alt={`${featured.name} cover`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : featuredThumbnail ? (
                <Image
                  src={featuredThumbnail}
                  alt={`${featured.name} cover`}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <ToolThumbnail
                  name={featured.name}
                  category={featured.categories[0]?.name}
                  slug={featured.slug}
                  className="transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="border-border bg-muted text-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black shadow-[0_0_24px_rgb(0_229_255_/_0.22)] backdrop-blur-xl">
                  <RiFireLine className="h-3.5 w-3.5" />
                  Featured solution
                </span>
                <span className="border-border bg-muted text-foreground rounded-full border px-3 py-1 text-xs font-black shadow-[0_0_24px_rgb(0_229_255_/_0.22)] backdrop-blur-xl">
                  {toolStatusLabel(featured.launchStatus, featured.websiteUrl)}
                </span>
              </div>
            </div>

            {/* Editorial copy */}
            <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 lg:p-10">
              {featured.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {featured.categories.slice(0, 3).map((cat) => (
                    <span
                      key={cat.id}
                      className="border-border bg-muted text-foreground inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}

              <h2 className="font-heading text-foreground group-hover:text-foreground text-2xl font-black tracking-tight transition-colors sm:text-3xl">
                {featured.name}
              </h2>

              <p className="text-muted-foreground line-clamp-3 text-sm sm:text-base">
                {stripHtml(featured.description)}
              </p>

              {/* Meta row */}
              <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                <span className="text-foreground flex items-center gap-1.5 font-semibold">
                  <RiThumbUpFill className="text-primary h-4 w-4" />
                  {featured.upvoteCount}
                  <span className="text-muted-foreground font-normal">upvotes</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <RiMessage2Line className="h-4 w-4" />
                  {featured.commentCount}
                </span>
              </div>

              {/* Maker + CTA */}
              <div className="border-border mt-2 flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  {featured.creatorImage ? (
                    <img
                      src={featured.creatorImage}
                      alt={featured.creatorName ?? "Maker"}
                      className="border-border h-8 w-8 rounded-full border object-cover"
                    />
                  ) : (
                    <div className="bg-muted border-border text-foreground flex h-8 w-8 items-center justify-center rounded-full border text-sm font-black">
                      {(featured.creatorName ?? "?").charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col leading-tight">
                    <span className="text-muted-foreground text-xs">Solved by</span>
                    <span className="text-sm font-medium">
                      {featured.creatorName ?? "Unknown maker"}
                    </span>
                  </div>
                </div>
                <span className="text-foreground inline-flex items-center gap-1 text-sm font-black">
                  View solution
                  <RiArrowRightLine className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* 2. TRENDING NOW STRIP */}
      {trending.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-foreground flex items-center gap-2 text-xl font-black">
              <RiFireLine className="text-primary h-5 w-5" />
              Trending solutions
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/explore" className="flex items-center gap-1">
                View all
                <RiArrowRightLine className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trending.map((p) => (
              <ExploreTrendingCard
                key={p.id}
                slug={p.slug}
                name={p.name}
                description={p.description}
                images={galleryFor(p)}
                launchStatus={p.launchStatus}
                websiteUrl={p.websiteUrl}
                upvoteCount={p.upvoteCount}
                category={p.categories[0]?.name}
                creatorName={p.creatorName}
                creatorImage={p.creatorImage}
                projectId={p.id}
                userHasUpvoted={p.userHasUpvoted}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. THUMBNAIL GRID */}
      {grid.length > 0 && (
        <section>
          <h2 className="font-heading text-foreground mb-4 text-xl font-black">All solutions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {grid.map((p) => (
              <ExploreGridCard
                key={p.id}
                slug={p.slug}
                name={p.name}
                description={p.description}
                images={galleryFor(p)}
                launchStatus={p.launchStatus}
                websiteUrl={p.websiteUrl}
                upvoteCount={p.upvoteCount}
                commentCount={p.commentCount}
                categories={p.categories}
                creatorName={p.creatorName}
                creatorImage={p.creatorImage}
                projectId={p.id}
                userHasUpvoted={p.userHasUpvoted}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
