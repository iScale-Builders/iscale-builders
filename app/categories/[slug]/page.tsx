import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { breadcrumbSchema, faqSchema, itemListSchema, type FaqItem } from "@/lib/seo/schema"
import { absoluteUrl, ogImage, SITE_NAME } from "@/lib/seo/site"
import { slugify } from "@/lib/seo/slug"
import { ProjectCard } from "@/components/home/project-card"
import { JsonLd } from "@/components/seo/json-ld"
import { getAllCategories, getCategoryBySlug, getProjectsByCategory } from "@/app/actions/projects"

// Revalidate hourly: tool lists shift as upvotes/submissions change (ISR).
export const revalidate = 3600
export const dynamicParams = true

// Below this many live tools, the page is too thin to index — render it (so the
// hub link works) but tell search engines not to index it yet.
const MIN_INDEXABLE_TOOLS = 3
const TOOL_LIMIT = 24
const YEAR = 2026

// "Developer Tools" should not become "Developer Tools Tools". Append "Tools"
// only when the category name doesn't already end in tool/tools.
function toolsPhrase(categoryName: string): string {
  return /tools?$/i.test(categoryName.trim()) ? categoryName : `${categoryName} Tools`
}

async function loadCategoryPage(slug: string) {
  const category = await getCategoryBySlug(slug)
  if (!category) return null

  const { projects, totalCount } = await getProjectsByCategory(
    category.id,
    1,
    TOOL_LIMIT,
    "upvotes",
  )

  return { category, projects, totalCount }
}

export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map((category) => ({ slug: slugify(category.name) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = await loadCategoryPage(slug)

  if (!data) {
    return { title: "Category not found", robots: { index: false, follow: false } }
  }

  const { category, totalCount } = data
  const phrase = toolsPhrase(category.name)
  const lower = phrase.toLowerCase()
  const title = `Best ${phrase} (${YEAR})`
  const description = `The best ${lower} for builders, ranked by the iScale community. Compare ${totalCount} ${lower}, see what they do, and find the right one for your workflow.`
  const isThin = totalCount < MIN_INDEXABLE_TOOLS

  return {
    title,
    description,
    alternates: { canonical: `/categories/${slug}` },
    robots: isThin ? { index: false, follow: true } : undefined,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "website",
      url: absoluteUrl(`/categories/${slug}`),
      images: [
        ogImage({
          title: `Best ${phrase}`,
          subtitle: `${totalCount} tools ranked`,
          badge: "Category",
        }),
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [
        ogImage({
          title: `Best ${phrase}`,
          subtitle: `${totalCount} tools ranked`,
          badge: "Category",
        }),
      ],
    },
  }
}

function buildFaqs(lowerPhrase: string, totalCount: number): FaqItem[] {
  return [
    {
      question: `What are the best ${lowerPhrase}?`,
      answer: `This page ranks ${totalCount} ${lowerPhrase} submitted to iScaleBuilders by community upvotes. The top entries are the ones builders use and recommend most. Each links to a full page with details, pricing, and discussion.`,
    },
    {
      question: `Are these ${lowerPhrase} free?`,
      answer: `Pricing varies by tool — many offer a free tier or free plan, while others are paid or freemium. Each tool's page lists its pricing so you can compare before you commit.`,
    },
    {
      question: `How are the ${lowerPhrase} ranked?`,
      answer: `Tools are ordered by upvotes from the iScale builder community, so the ranking reflects real usage and preference rather than paid placement. Newly submitted tools rise as builders discover and vote for them.`,
    },
  ]
}

export default async function CategoryLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await loadCategoryPage(slug)

  if (!data) notFound()

  const { category, projects, totalCount } = data
  const phrase = toolsPhrase(category.name)
  const lower = phrase.toLowerCase()
  const faqs = buildFaqs(lower, totalCount)

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Categories", url: "/categories" },
    { name: category.name, url: `/categories/${slug}` },
  ])
  const itemList = itemListSchema(
    projects.map((p) => ({ name: p.name, url: `/projects/${p.slug}` })),
    `Best ${phrase}`,
  )
  const faq = faqSchema(faqs)

  return (
    <main className="foundry-page">
      <JsonLd data={[breadcrumb, itemList, faq]} />

      <div className="foundry-container min-h-screen">
        {/* Breadcrumb trail */}
        <nav aria-label="Breadcrumb" className="text-muted-foreground mb-6 text-sm">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/categories" className="hover:underline">
            Categories
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>

        <header className="scroll-live mb-8 flex flex-col gap-3">
          <p className="foundry-kicker">Best {lower}</p>
          <h1 className="font-heading text-4xl font-black tracking-tight text-white sm:text-5xl">
            Best {phrase} ({YEAR})
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base sm:text-lg">
            {totalCount > 0 ? (
              <>
                Below are the top {lower} used by builders in the iScale community, ranked by
                upvotes. Each one links to a full page with what it does, pricing, and discussion —
                so you can compare and pick the right one for your workflow.
              </>
            ) : (
              <>
                No {lower} have been added yet. Browse other{" "}
                <Link href="/categories" className="underline">
                  categories
                </Link>{" "}
                or{" "}
                <Link href="/projects/submit" className="underline">
                  submit a tool
                </Link>{" "}
                to be the first.
              </>
            )}
          </p>
        </header>

        {totalCount > 0 && (
          <div className="-mx-3 mb-12 flex flex-col sm:-mx-4">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                slug={project.slug}
                name={project.name}
                description={project.description || ""}
                logoUrl={project.logoUrl || ""}
                websiteUrl={project.websiteUrl ?? undefined}
                upvoteCount={project.upvoteCount ?? 0}
                commentCount={project.commentCount ?? 0}
                launchStatus={project.launchStatus}
                launchType={project.launchType}
                dailyRanking={project.dailyRanking}
                index={index}
                isAuthenticated={false}
                userHasUpvoted={project.userHasUpvoted ?? false}
                categories={project.categories ?? []}
              />
            ))}
          </div>
        )}

        {/* FAQ — rendered for users and emitted as FAQPage schema above */}
        <section className="mb-12 max-w-3xl">
          <h2 className="font-heading mb-5 text-2xl font-bold text-white sm:text-3xl">
            {phrase} — frequently asked questions
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
          Rankings are by community upvotes — see{" "}
          <Link href="/how-we-review" className="underline">
            how we evaluate tools
          </Link>
          . Explore more in{" "}
          <Link href="/categories" className="underline">
            all categories
          </Link>{" "}
          or see what&apos;s{" "}
          <Link href="/trending" className="underline">
            trending now
          </Link>
          .
        </div>
      </div>
    </main>
  )
}
