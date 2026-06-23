import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { breadcrumbSchema, faqSchema, itemListSchema, type FaqItem } from "@/lib/seo/schema"
import { absoluteUrl, ogImage, SITE_NAME } from "@/lib/seo/site"
import { ProjectCard } from "@/components/home/project-card"
import { JsonLd } from "@/components/seo/json-ld"
import { getProjectBySlug } from "@/app/actions/project-details"
import { getAllProjectSlugs, getProjectsByCategory } from "@/app/actions/projects"

export const revalidate = 3600
export const dynamicParams = true

const MIN_INDEXABLE_ALTERNATIVES = 3
const ALT_LIMIT = 12
const YEAR = 2026

async function loadAlternatives(slug: string) {
  const tool = await getProjectBySlug(slug)
  if (!tool) return null

  const primaryCategory = tool.categories[0]
  if (!primaryCategory) {
    return {
      tool,
      alternatives: [] as Awaited<ReturnType<typeof getProjectsByCategory>>["projects"],
    }
  }

  const { projects } = await getProjectsByCategory(primaryCategory.id, 1, ALT_LIMIT + 1, "upvotes")
  const alternatives = projects.filter((p) => p.slug !== tool.slug).slice(0, ALT_LIMIT)
  return { tool, alternatives, primaryCategory }
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()
  return slugs.map((tool) => ({ tool }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>
}): Promise<Metadata> {
  const { tool: slug } = await params
  const data = await loadAlternatives(slug)

  if (!data) {
    return { title: "Tool not found", robots: { index: false, follow: false } }
  }

  const { tool, alternatives } = data
  const title = `${tool.name} Alternatives (${YEAR})`
  const description = `Looking for alternatives to ${tool.name}? Compare ${alternatives.length} similar tools used by builders in the iScale community — what they do, pricing, and how they stack up.`
  const isThin = alternatives.length < MIN_INDEXABLE_ALTERNATIVES

  return {
    title,
    description,
    alternates: { canonical: `/alternatives/${slug}` },
    robots: isThin ? { index: false, follow: true } : undefined,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "website",
      url: absoluteUrl(`/alternatives/${slug}`),
      images: [
        ogImage({
          title: `${tool.name} Alternatives`,
          subtitle: `${alternatives.length} similar tools`,
          badge: "Alternatives",
        }),
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [
        ogImage({
          title: `${tool.name} Alternatives`,
          subtitle: `${alternatives.length} similar tools`,
          badge: "Alternatives",
        }),
      ],
    },
  }
}

function buildFaqs(toolName: string, count: number): FaqItem[] {
  return [
    {
      question: `What is the best alternative to ${toolName}?`,
      answer: `The top alternative depends on your workflow, but this page ranks ${count} tools similar to ${toolName} by community upvotes so you can start with the ones builders use most. Each links to a full page with details and pricing.`,
    },
    {
      question: `Are there free alternatives to ${toolName}?`,
      answer: `Often yes — several listed alternatives offer a free or freemium tier. Each tool's page states its pricing so you can compare cost before switching.`,
    },
    {
      question: `How were these ${toolName} alternatives chosen?`,
      answer: `They share a category with ${toolName} and are ordered by upvotes from the iScale builder community, so the ranking reflects real usage rather than paid placement.`,
    },
  ]
}

export default async function AlternativesPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: slug } = await params
  const data = await loadAlternatives(slug)

  if (!data) notFound()

  const { tool, alternatives } = data
  const faqs = buildFaqs(tool.name, alternatives.length)

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: tool.name, url: `/projects/${tool.slug}` },
    { name: "Alternatives", url: `/alternatives/${slug}` },
  ])
  const itemList = itemListSchema(
    alternatives.map((p) => ({ name: p.name, url: `/projects/${p.slug}` })),
    `${tool.name} Alternatives`,
  )
  const faq = faqSchema(faqs)

  return (
    <main className="foundry-page">
      <JsonLd data={[breadcrumb, itemList, faq]} />

      <div className="foundry-container min-h-screen">
        <nav aria-label="Breadcrumb" className="text-muted-foreground mb-6 text-sm">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/projects/${tool.slug}`} className="hover:underline">
            {tool.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Alternatives</span>
        </nav>

        <header className="scroll-live mb-8 flex flex-col gap-3">
          <p className="foundry-kicker">Alternatives to {tool.name}</p>
          <h1 className="font-heading text-4xl font-black tracking-tight text-white sm:text-5xl">
            {tool.name} Alternatives ({YEAR})
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base sm:text-lg">
            {alternatives.length > 0 ? (
              <>
                Below are {alternatives.length} tools similar to{" "}
                <Link href={`/projects/${tool.slug}`} className="underline">
                  {tool.name}
                </Link>
                , ranked by upvotes from the iScale community. Compare what each does and its
                pricing to find the best fit for your workflow.
              </>
            ) : (
              <>
                We don&apos;t have enough similar tools to compare against {tool.name} yet. Browse{" "}
                <Link href="/categories" className="underline">
                  all categories
                </Link>{" "}
                or{" "}
                <Link href="/projects/submit" className="underline">
                  submit a tool
                </Link>
                .
              </>
            )}
          </p>
        </header>

        {alternatives.length > 0 && (
          <div className="-mx-3 mb-12 flex flex-col sm:-mx-4">
            {alternatives.map((project, index) => (
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

        <section className="mb-12 max-w-3xl">
          <h2 className="font-heading mb-5 text-2xl font-bold text-white sm:text-3xl">
            {tool.name} alternatives — frequently asked questions
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
          .
        </div>
      </div>
    </main>
  )
}
