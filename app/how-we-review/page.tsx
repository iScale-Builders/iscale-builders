import type { Metadata } from "next"
import Link from "next/link"

import { breadcrumbSchema } from "@/lib/seo/schema"
import { absoluteUrl, SITE_NAME } from "@/lib/seo/site"
import { JsonLd } from "@/components/seo/json-ld"

const TITLE = "How We Evaluate Builder Tools"
const DESCRIPTION =
  "Our methodology for ranking and reviewing the tools listed on iScaleBuilders — what we look at, how community signals factor in, and how we keep rankings honest."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/how-we-review" },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    type: "article",
    url: absoluteUrl("/how-we-review"),
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
}

const CRITERIA = [
  {
    heading: "What the tool actually does",
    body: "Every tool gets a plain-language summary of the job it does and who it's for. We don't list a tool unless we can describe the concrete problem it solves for a builder, seller, or maker.",
  },
  {
    heading: "Community signal, not pay-to-win",
    body: "Tool rankings inside a category are ordered by upvotes from the iScale builder community. That means the order reflects what builders actually use and recommend — not who paid the most. Paid placements, where they exist, are labeled.",
  },
  {
    heading: "Fit for real workflows",
    body: "We weigh how a tool fits into the workflows our community runs every day — print-on-demand, Etsy and Amazon Merch listing, launch and promotion, and AI-assisted building — rather than generic feature checklists.",
  },
  {
    heading: "Pricing transparency",
    body: "Each tool page states its pricing model (free, freemium, or paid) so you can compare cost honestly before committing. We flag tools whose pricing is unclear.",
  },
  {
    heading: "Kept current",
    body: "Category pages are regenerated as tools are added and as community votes shift, so a 'best tools' list reflects the current state of the directory rather than a snapshot frozen in time.",
  },
]

export default function HowWeReviewPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "How We Review", url: "/how-we-review" },
  ])

  return (
    <main className="foundry-page">
      <JsonLd data={breadcrumb} />

      <div className="foundry-container min-h-screen max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-muted-foreground mb-6 text-sm">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">How We Review</span>
        </nav>

        <header className="mb-8">
          <p className="foundry-kicker mb-2">Our methodology</p>
          <h1 className="font-heading text-4xl font-black tracking-tight text-white sm:text-5xl">
            {TITLE}
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{DESCRIPTION}</p>
        </header>

        <section className="space-y-8">
          {CRITERIA.map((item, index) => (
            <div key={item.heading}>
              <h2 className="font-heading text-foreground mb-2 text-xl font-bold">
                {index + 1}. {item.heading}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{item.body}</p>
            </div>
          ))}
        </section>

        <div className="border-border text-muted-foreground mt-12 border-t pt-6 text-sm">
          See the methodology in action across{" "}
          <Link href="/categories" className="underline">
            tool categories
          </Link>{" "}
          or read our{" "}
          <Link href="/reviews" className="underline">
            in-depth reviews
          </Link>
          .
        </div>
      </div>
    </main>
  )
}
