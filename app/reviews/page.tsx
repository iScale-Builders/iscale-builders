/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next"
import Link from "next/link"

import { db } from "@/drizzle/db"
import { seoArticle } from "@/drizzle/db/schema"
import { Calendar, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Product Reviews — In-Depth Product Analysis",
  description:
    "Discover comprehensive product reviews and in-depth analysis of the latest tools and platforms to help you make informed decisions.",
  keywords: "product reviews, analysis, evaluation, tools, platforms, technology",
  authors: [{ name: "iScaleBuilders Team" }],
  openGraph: {
    title: "Product Reviews | iScaleBuilders - In-Depth Product Analysis",
    description:
      "Discover comprehensive product reviews and in-depth analysis of the latest tools and platforms to help you make informed decisions.",
    type: "website",
    url: "/reviews",
    siteName: "iScaleBuilders",
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Reviews | iScaleBuilders - In-Depth Product Analysis",
    description:
      "Discover comprehensive product reviews and in-depth analysis of the latest tools and platforms to help you make informed decisions.",
  },
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

async function getReviews() {
  const reviews = await db.select().from(seoArticle).orderBy(seoArticle.publishedAt)

  return reviews.map((review) => ({
    ...review,
    readingTime: calculateReadingTime(review.content),
  }))
}

export default async function ReviewsPage() {
  const reviews = await getReviews()

  return (
    <div className="foundry-page min-h-screen">
      <div className="foundry-container max-w-6xl">
        {/* Header */}
        <div className="scroll-live mb-8 text-center">
          <p className="foundry-kicker justify-center">Tool analysis</p>
          <h1 className="text-foreground mb-4 text-4xl font-black tracking-tight md:text-5xl">
            Product Reviews
          </h1>
          <p className="text-muted-foreground text-md mx-auto max-w-4xl md:text-lg">
            In-depth reviews and analysis of the latest tools and platforms to help you make
            informed decisions.
          </p>
        </div>

        {/* Categories Section */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/blog"
              className="bg-card border-border text-foreground hover:bg-muted rounded-full border px-6 py-2 text-sm font-medium transition-colors"
            >
              All Articles
            </Link>
            <Link
              href="/reviews"
              className="border-border bg-muted text-foreground hover:bg-muted rounded-full border px-6 py-2 text-sm font-medium transition-colors"
            >
              Product Reviews
            </Link>
          </div>
        </div>

        {/* Reviews Grid */}
        {reviews.length === 0 ? (
          <div className="py-16 text-center">
            <div className="foundry-panel mx-auto max-w-md rounded-2xl p-12">
              <div className="text-foreground mb-4">
                <Calendar className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-foreground mb-2 text-lg font-black">No reviews yet</h3>
              <p className="text-muted-foreground">
                We&apos;re working on some amazing product reviews. Check back soon!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <article key={review.slug} className="group">
                <Link
                  href={`/reviews/${review.slug}`}
                  className="foundry-card block overflow-hidden rounded-2xl"
                >
                  {/* Review Image */}
                  <div className="bg-muted border-border relative aspect-[16/9] overflow-hidden border-b">
                    {review.image ? (
                      <img
                        src={review.image}
                        alt={review.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="text-muted-foreground/30 text-4xl font-bold">
                          {review.title.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Review Content */}
                  <div className="px-6 py-4">
                    {/* Meta Information */}
                    <div className="text-muted-foreground mb-3 flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={review.publishedAt.toISOString()}>
                          {formatDate(review.publishedAt)}
                        </time>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{review.readingTime}</span>
                      </div>
                    </div>

                    {/* Review Badge */}
                    <div className="mb-4">
                      <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                        Product Review
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-foreground group-hover:text-foreground mb-2 line-clamp-3 text-xl font-black transition-colors">
                      {review.title}
                    </h2>

                    {/* Description */}
                    <p className="text-muted-foreground line-clamp-3 text-sm">
                      {review.description}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
