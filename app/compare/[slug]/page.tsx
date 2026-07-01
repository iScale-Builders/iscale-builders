import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { breadcrumbSchema, faqSchema, itemListSchema, type FaqItem } from "@/lib/seo/schema"
import { absoluteUrl, ogImage, SITE_NAME } from "@/lib/seo/site"
import { JsonLd } from "@/components/seo/json-ld"
import { getProjectBySlug } from "@/app/actions/project-details"
import { getComparePairs } from "@/app/actions/projects"

export const revalidate = 3600
export const dynamicParams = true

const YEAR = 2026
const DELIMITER = "-vs-"

type Tool = NonNullable<Awaited<ReturnType<typeof getProjectBySlug>>>

function parsePair(slug: string): [string, string] | null {
  const idx = slug.indexOf(DELIMITER)
  if (idx <= 0) return null
  const a = slug.slice(0, idx)
  const b = slug.slice(idx + DELIMITER.length)
  if (!a || !b || a === b) return null
  return [a, b]
}

function canonicalSlug(a: string, b: string): string {
  return [a, b].sort().join(DELIMITER)
}

async function loadPair(slug: string): Promise<{ a: Tool; b: Tool } | null> {
  const parsed = parsePair(slug)
  if (!parsed) return null
  const [a, b] = await Promise.all([getProjectBySlug(parsed[0]), getProjectBySlug(parsed[1])])
  if (!a || !b) return null
  return { a, b }
}

export async function generateStaticParams() {
  const pairs = await getComparePairs()
  return pairs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = await loadPair(slug)

  if (!data) {
    return { title: "Comparison not found", robots: { index: false, follow: false } }
  }

  const { a, b } = data
  const title = `${a.name} vs ${b.name} (${YEAR})`
  const description = `${a.name} vs ${b.name}: a side-by-side comparison of features, pricing, and community votes to help you choose the right tool for your workflow.`
  // Canonicalize a-vs-b / b-vs-a to one URL to avoid duplicate content.
  const canonical = `/compare/${canonicalSlug(a.slug, b.slug)}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "website",
      url: absoluteUrl(canonical),
      images: [
        ogImage({
          title: `${a.name} vs ${b.name}`,
          subtitle: "Side-by-side comparison",
          badge: "Compare",
        }),
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [
        ogImage({
          title: `${a.name} vs ${b.name}`,
          subtitle: "Side-by-side comparison",
          badge: "Compare",
        }),
      ],
    },
  }
}

function buildFaqs(a: Tool, b: Tool): FaqItem[] {
  return [
    {
      question: `What is the difference between ${a.name} and ${b.name}?`,
      answer: `${a.name} and ${b.name} are both tools builders use, compared here side by side on what they do, pricing, and community votes. The right pick depends on your workflow — see the table above for the specifics.`,
    },
    {
      question: `Is ${a.name} or ${b.name} better?`,
      answer: `Neither is universally better. ${a.name} has ${a.upvoteCount} community upvotes and ${b.name} has ${b.upvoteCount}; upvotes reflect real usage, but the better choice is the one that fits your specific needs and budget.`,
    },
  ]
}

function Cell({ label, a, b }: { label: string; a: React.ReactNode; b: React.ReactNode }) {
  return (
    <div className="border-border grid grid-cols-3 border-b text-sm last:border-b-0">
      <div className="text-muted-foreground p-3 font-medium">{label}</div>
      <div className="text-foreground p-3">{a}</div>
      <div className="text-foreground p-3">{b}</div>
    </div>
  )
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await loadPair(slug)

  if (!data) notFound()

  const { a, b } = data
  const faqs = buildFaqs(a, b)

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Compare", url: "/explore" },
    { name: `${a.name} vs ${b.name}`, url: `/compare/${canonicalSlug(a.slug, b.slug)}` },
  ])
  const itemList = itemListSchema(
    [
      { name: a.name, url: `/projects/${a.slug}` },
      { name: b.name, url: `/projects/${b.slug}` },
    ],
    `${a.name} vs ${b.name}`,
  )
  const faq = faqSchema(faqs)

  const strip = (html: string) => html.replace(/<[^>]*>/g, "").trim()

  return (
    <main className="foundry-page">
      <JsonLd data={[breadcrumb, itemList, faq]} />

      <div className="foundry-container min-h-screen max-w-4xl">
        <nav aria-label="Breadcrumb" className="text-muted-foreground mb-6 text-sm">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">
            {a.name} vs {b.name}
          </span>
        </nav>

        <header className="mb-8 flex flex-col gap-3">
          <p className="foundry-kicker">Head to head</p>
          <h1 className="font-heading text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            {a.name} vs {b.name} ({YEAR})
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base sm:text-lg">
            A side-by-side look at {a.name} and {b.name} — what each does, pricing, and how the
            iScale community has voted. Pick the one that fits your workflow.
          </p>
        </header>

        {/* Comparison table */}
        <div className="border-border bg-card mb-12 overflow-hidden rounded-2xl border">
          <div className="border-border grid grid-cols-3 border-b">
            <div className="p-3" />
            <div className="text-foreground p-3 font-bold">
              <Link href={`/projects/${a.slug}`} className="hover:underline">
                {a.name}
              </Link>
            </div>
            <div className="text-foreground p-3 font-bold">
              <Link href={`/projects/${b.slug}`} className="hover:underline">
                {b.name}
              </Link>
            </div>
          </div>
          <Cell
            label="What it is"
            a={<span className="line-clamp-4">{strip(a.description)}</span>}
            b={<span className="line-clamp-4">{strip(b.description)}</span>}
          />
          <Cell
            label="Pricing"
            a={<span className="capitalize">{a.pricing || "—"}</span>}
            b={<span className="capitalize">{b.pricing || "—"}</span>}
          />
          <Cell
            label="Category"
            a={a.categories[0]?.name || "—"}
            b={b.categories[0]?.name || "—"}
          />
          <Cell label="Community upvotes" a={a.upvoteCount} b={b.upvoteCount} />
          <Cell
            label=""
            a={
              <Link href={`/projects/${a.slug}`} className="text-primary hover:underline">
                View {a.name} →
              </Link>
            }
            b={
              <Link href={`/projects/${b.slug}`} className="text-primary hover:underline">
                View {b.name} →
              </Link>
            }
          />
        </div>

        <section className="mb-12 max-w-3xl">
          <h2 className="font-heading mb-5 text-2xl font-bold text-foreground sm:text-3xl">
            {a.name} vs {b.name} — frequently asked questions
          </h2>
          <div className="space-y-5">
            {faqs.map((item) => (
              <div key={item.question}>
                <h3 className="text-foreground mb-1.5 font-semibold">{item.question}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="border-border text-muted-foreground border-t pt-6 text-sm">
          See more in{" "}
          <Link href="/explore" className="underline">
            all tools
          </Link>{" "}
          or read{" "}
          <Link href="/how-we-review" className="underline">
            how we evaluate tools
          </Link>
          .
        </div>
      </div>
    </main>
  )
}
