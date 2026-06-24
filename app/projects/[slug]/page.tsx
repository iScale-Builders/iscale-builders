/* eslint-disable @next/next/no-img-element */
import { Metadata, ResolvingMetadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { auth } from "@clerk/nextjs/server"
import { RiGithubFill, RiHashtag, RiTwitterFill, RiVipCrownLine } from "@remixicon/react"
import { format } from "date-fns"

import { isUpvotingOpen } from "@/lib/launch-utils"
import { breadcrumbSchema, softwareApplicationSchema } from "@/lib/seo/schema"
import { slugify } from "@/lib/seo/slug"
import { toolStatusLabel } from "@/lib/tool-status"
import { Button } from "@/components/ui/button"
import { RichTextDisplay } from "@/components/ui/rich-text-editor"
import { galleryFor, thumbnailFor } from "@/components/explore/explore-view"
import { EditButton } from "@/components/project/edit-button"
import { ProjectComments } from "@/components/project/project-comments"
import { ProjectImageWithLoader } from "@/components/project/project-image-with-loader"
import { ShareButton } from "@/components/project/share-button"
import { UpvoteButton } from "@/components/project/upvote-button"
import { JsonLd } from "@/components/seo/json-ld"
import { ToolThumbnail } from "@/components/shared/tool-thumbnail"
import { ReadyPixlSponsorLink } from "@/components/sponsor/readypixl-sponsor-link"
import { getProjectBySlug, hasUserUpvoted } from "@/app/actions/project-details"

export const dynamic = "force-dynamic"

// Types
interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata(
  { params }: ProjectPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params
  const projectData = await getProjectBySlug(slug)

  if (!projectData) {
    return {
      title: "Project Not Found",
    }
  }

  // Function to strip HTML tags from text
  function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").trim()
  }

  const previousImages = (await parent).openGraph?.images || []
  const socialImages = Array.from(
    new Set(
      [
        ...(projectData.galleryImages ?? []),
        projectData.productImage,
        projectData.coverImageUrl,
        projectData.logoUrl,
      ].filter(Boolean) as string[],
    ),
  ).slice(0, 4)

  return {
    title: projectData.name,
    description: stripHtml(projectData.description),
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: `${projectData.name} on iScaleXchange`,
      description: stripHtml(projectData.description),
      images: [...socialImages, ...previousImages],
    },
    twitter: {
      card: "summary_large_image",
      title: `${projectData.name} on iScaleXchange`,
      description: stripHtml(projectData.description),
      images: socialImages,
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const projectData = await getProjectBySlug(slug)

  if (!projectData) {
    notFound()
  }

  const { userId } = await auth()

  const hasUpvoted = userId ? await hasUserUpvoted(projectData.id) : false

  const scheduledDate = projectData.scheduledLaunchDate
    ? new Date(projectData.scheduledLaunchDate)
    : null

  const canUpvote = isUpvotingOpen(projectData.launchStatus)
  const isScheduled = projectData.launchStatus === "scheduled"
  const statusLabel = toolStatusLabel(projectData.launchStatus)

  const isOwner = userId === projectData.createdBy

  const projectGallery = galleryFor(projectData)
  const projectThumbnail =
    projectGallery[0] || thumbnailFor(projectData.productImage, projectData.coverImageUrl)
  const logoIsUploadedDataImage = projectData.logoUrl.startsWith("data:image/")

  // Structured data: SoftwareApplication (with upvotes as a rating signal) + breadcrumb.
  const plainDescription = projectData.description.replace(/<[^>]*>/g, "").trim()
  const primaryCategory = projectData.categories[0]
  const appSchema = softwareApplicationSchema({
    name: projectData.name,
    description: plainDescription,
    url: `/projects/${projectData.slug}`,
    image:
      projectData.productImage ||
      projectData.coverImageUrl ||
      (logoIsUploadedDataImage ? undefined : projectData.logoUrl) ||
      undefined,
    priceLabel: projectData.pricing || undefined,
    ratingCount: projectData.upvoteCount || undefined,
  })
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    ...(primaryCategory
      ? [{ name: primaryCategory.name, url: `/categories/${slugify(primaryCategory.name)}` }]
      : [{ name: "Tools", url: "/explore" }]),
    { name: projectData.name, url: `/projects/${projectData.slug}` },
  ])

  return (
    <div className="bg-background min-h-screen">
      <JsonLd data={[appSchema, breadcrumb]} />
      <div className="foundry-container max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content - 2 colonnes */}
          <div className="lg:col-span-2">
            {/* Modern Clean Header */}
            <div className="scroll-live py-6">
              {/* Version Desktop */}
              <div className="hidden items-center justify-between md:flex">
                {/* Left side: Logo + Title + Categories */}
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  {/* Logo */}
                  <div className="bg-card border-border h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border">
                    {projectData.logoUrl && logoIsUploadedDataImage ? (
                      <img
                        src={projectData.logoUrl}
                        alt={`${projectData.name} Logo`}
                        className="h-full w-full object-cover"
                      />
                    ) : projectData.logoUrl ? (
                      <Image
                        src={projectData.logoUrl}
                        alt={`${projectData.name} Logo`}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                        priority
                      />
                    ) : (
                      <ToolThumbnail
                        name={projectData.name}
                        category={projectData.categories[0]?.name}
                        slug={projectData.slug}
                        compact
                      />
                    )}
                  </div>

                  {/* Title and info */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h1 className="font-heading text-foreground truncate text-2xl font-black">
                        {projectData.name}
                      </h1>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-1">
                      {projectData.categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/categories/${slugify(category.name)}`}
                          className="border-border bg-muted text-foreground hover:bg-muted inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold transition-colors"
                        >
                          <RiHashtag className="h-3 w-3" />
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side: Actions */}
                <div className="ml-6 flex items-center gap-3">
                  <div className="border-border bg-muted text-foreground rounded-full border px-3 py-1 text-xs font-black">
                    {statusLabel}
                  </div>

                  {canUpvote ? (
                    <UpvoteButton
                      projectId={projectData.id}
                      upvoteCount={projectData.upvoteCount}
                      initialUpvoted={hasUpvoted}
                      isAuthenticated={Boolean(userId)}
                    />
                  ) : (
                    <div className="border-muted bg-muted flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium">
                      <span className="text-foreground">{projectData.upvoteCount} upvotes</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Version Mobile */}
              <div className="space-y-4 md:hidden">
                {/* Logo + Titre */}
                <div className="flex flex-col items-start gap-2">
                  <div className="bg-card border-border h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border">
                    {projectData.logoUrl && logoIsUploadedDataImage ? (
                      <img
                        src={projectData.logoUrl}
                        alt={`${projectData.name} Logo`}
                        className="h-full w-full object-cover"
                      />
                    ) : projectData.logoUrl ? (
                      <Image
                        src={projectData.logoUrl}
                        alt={`${projectData.name} Logo`}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                        priority
                      />
                    ) : (
                      <ToolThumbnail
                        name={projectData.name}
                        category={projectData.categories[0]?.name}
                        slug={projectData.slug}
                        compact
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h1 className="font-heading text-foreground text-2xl font-black">
                      {projectData.name}
                    </h1>
                    <div className="flex flex-wrap gap-1">
                      {projectData.categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/categories/${slugify(category.name)}`}
                          className="border-border bg-muted text-foreground hover:bg-muted inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold transition-colors"
                        >
                          <RiHashtag className="h-3 w-3" />
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions - Same width buttons side by side */}
                <div className="flex gap-3">
                  <div className="border-border bg-muted text-foreground flex h-9 items-center justify-center rounded-full border px-3 text-xs font-black">
                    {statusLabel}
                  </div>

                  {canUpvote ? (
                    <UpvoteButton
                      projectId={projectData.id}
                      upvoteCount={projectData.upvoteCount}
                      initialUpvoted={hasUpvoted}
                      isAuthenticated={Boolean(userId)}
                    />
                  ) : (
                    <div className="border-muted bg-muted flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium">
                      <span className="text-foreground">{projectData.upvoteCount} upvotes</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 pb-12">
              {/* Badge SVG pour les gagnants top 3 uniquement */}
              {!isScheduled &&
                isOwner &&
                projectData.launchStatus === "launched" &&
                projectData.dailyRanking &&
                projectData.dailyRanking <= 3 && (
                  <div className="border-primary/30 bg-primary/10 text-primary flex flex-col items-center justify-between gap-2 rounded-lg border p-2 sm:flex-row sm:items-center sm:gap-3">
                    <span className="text-center text-sm font-medium">
                      Congratulations! You earned a badge for your ranking.
                    </span>
                    <Button asChild variant="default" size="sm" className="flex items-center gap-2">
                      <Link href={`/projects/${projectData.slug}/badges`}>
                        <RiVipCrownLine className="h-4 w-4" />
                        View Badges
                      </Link>
                    </Button>
                  </div>
                )}

              {/* Scheduled Launch Info */}
              {isScheduled && (
                <div className="border-border bg-muted text-foreground flex flex-col items-center justify-between gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:gap-3">
                  <div className="text-center sm:text-left">
                    <p className="font-medium">Coming soon</p>
                    <p className="text-sm opacity-90">
                      This iScaleLabs app page is being prepared for launch
                      {scheduledDate
                        ? ` on ${format(scheduledDate, "EEEE, MMMM d, yyyy")} at 08:00 AM UTC.`
                        : "."}
                    </p>
                  </div>
                  <div className="border-border bg-muted text-foreground rounded-md border px-3 py-1 text-sm font-black">
                    Queued
                  </div>
                </div>
              )}

              {/* Product Image / Banner */}
              {projectThumbnail ? (
                <ProjectImageWithLoader
                  src={projectThumbnail}
                  alt={`${projectData.name} - Product Image`}
                />
              ) : (
                <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border">
                  <ToolThumbnail
                    name={projectData.name}
                    category={projectData.categories[0]?.name}
                    slug={projectData.slug}
                  />
                </div>
              )}
              {projectGallery.length > 1 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {projectGallery.slice(0, 10).map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="bg-muted aspect-video overflow-hidden rounded-lg border"
                    >
                      <img
                        src={image}
                        alt={`${projectData.name} image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              {/* Description */}
              <div className="w-full">
                <RichTextDisplay content={projectData.description} />
              </div>

              {/* Edit button pour owners */}
              {isOwner && (
                <div>
                  <EditButton
                    projectId={projectData.id}
                    initialName={projectData.name}
                    initialWebsiteUrl={projectData.websiteUrl}
                    initialLogoUrl={projectData.logoUrl}
                    initialProductImage={projectData.productImage}
                    initialCoverImage={projectData.coverImageUrl}
                    initialGalleryImages={projectGallery}
                    initialDescription={projectData.description}
                    initialCategories={projectData.categories}
                    isOwner={isOwner}
                  />
                </div>
              )}

              {/* Comments */}
              <div>
                <h2 className="mb-4 text-lg font-semibold" id="comments">
                  Comments
                </h2>
                <ProjectComments projectId={projectData.id} isAuthenticated={Boolean(userId)} />
              </div>
            </div>
          </div>

          {/* Sidebar - 1 colonne sur toute la hauteur */}
          <div className="lg:sticky lg:top-14 lg:h-fit">
            <div className="space-y-6 py-6">
              {/* Achievement Badge */}
              {!isScheduled &&
                projectData.launchStatus === "launched" &&
                projectData.dailyRanking &&
                projectData.dailyRanking <= 3 && (
                  <div className="space-y-3">
                    <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Achievement
                    </h3>
                    <div className="flex">
                      <img
                        src={`/images/badges/top${projectData.dailyRanking}-light.svg`}
                        alt={`iScaleXchange Top ${projectData.dailyRanking} Daily Winner`}
                        className="h-12 w-auto dark:hidden"
                      />
                      <img
                        src={`/images/badges/top${projectData.dailyRanking}-dark.svg`}
                        alt={`iScaleXchange Top ${projectData.dailyRanking} Daily Winner`}
                        className="hidden h-12 w-auto dark:block"
                      />
                    </div>
                  </div>
                )}

              {/* Publisher */}
              <div className="space-y-3">
                <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Publisher
                </h3>
                <div className="flex items-center gap-3">
                  {projectData.creator ? (
                    <Link
                      href={`/u/${projectData.creator.id}`}
                      className="hover:bg-muted -mx-2 flex min-w-0 flex-1 items-center gap-3 rounded-lg px-2 py-1 transition-colors"
                    >
                      {projectData.creator.image ? (
                        <img
                          src={projectData.creator.image}
                          alt={projectData.creator.name || "Creator avatar"}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                          {projectData.creator.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground hover:text-primary text-sm font-medium transition-colors">
                          {projectData.creator.name}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <span className="text-muted-foreground text-sm">Unknown creator</span>
                  )}
                </div>
              </div>

              {/* Launch Date */}
              {scheduledDate && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Launch Date
                    </span>
                    <div className="border-muted-foreground/30 mx-3 flex-1 border-b border-dotted"></div>
                    <span className="text-foreground text-sm font-medium">
                      {format(scheduledDate, "yyyy-MM-dd")}
                    </span>
                  </div>
                </div>
              )}

              {/* Platform */}
              {projectData.platforms && projectData.platforms.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Platform
                    </span>
                    <div className="border-muted-foreground/30 mx-3 flex-1 border-b border-dotted"></div>
                    <span className="text-foreground text-sm font-medium capitalize">
                      {projectData.platforms[0]}
                    </span>
                  </div>
                </div>
              )}

              {/* Pricing */}
              {projectData.pricing && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Pricing
                    </span>
                    <div className="border-muted-foreground/30 mx-3 flex-1 border-b border-dotted"></div>
                    <span className="text-foreground text-sm font-medium capitalize">
                      {projectData.pricing}
                    </span>
                  </div>
                </div>
              )}

              {/* Social Links */}
              {(projectData.githubUrl || projectData.twitterUrl) && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Socials
                    </span>
                    <div className="border-muted-foreground/30 mx-3 flex-1 border-b border-dotted"></div>
                    <div className="flex items-center gap-2">
                      {projectData.githubUrl && (
                        <a
                          href={projectData.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="GitHub"
                        >
                          <RiGithubFill className="h-4 w-4" />
                        </a>
                      )}
                      {projectData.twitterUrl && (
                        <a
                          href={projectData.twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Twitter"
                        >
                          <RiTwitterFill className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tech Stack */}
              {projectData.techStack && projectData.techStack.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {projectData.techStack.slice(0, 6).map((tech) => (
                      <span
                        key={tech}
                        className="bg-muted text-muted-foreground inline-flex items-center rounded-md px-2 py-1 text-xs"
                      >
                        #{tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="border-border border-t pt-4">
                <ShareButton name={projectData.name} slug={projectData.slug} variant="fullWidth" />
              </div>

              {/* Discover related programmatic pages */}
              <div className="border-border border-t pt-4">
                <Link
                  href={`/alternatives/${projectData.slug}`}
                  className="text-primary text-sm hover:underline"
                >
                  See alternatives to {projectData.name} →
                </Link>
              </div>

              <div className="bg-card border-border rounded-xl border p-4">
                <p className="text-muted-foreground text-xs font-black tracking-[0.18em] uppercase">
                  Launch state
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Public access is queued while the iScaleLabs app catalog is prepared.
                </p>
              </div>

              <div className="border-border border-t pt-4">
                <ReadyPixlSponsorLink variant="sidebar" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
