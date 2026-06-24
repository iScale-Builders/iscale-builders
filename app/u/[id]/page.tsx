/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next"
import { notFound } from "next/navigation"

import { RiAppsLine, RiThumbUpFill } from "@remixicon/react"
import { format } from "date-fns"

import { breadcrumbSchema, personSchema } from "@/lib/seo/schema"
import { ExploreGridCard } from "@/components/explore/explore-grid-card"
import { galleryFor } from "@/components/explore/explore-view"
import { JsonLd } from "@/components/seo/json-ld"
import { getMakerProfile } from "@/app/actions/profile"

interface MakerProfilePageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: MakerProfilePageProps): Promise<Metadata> {
  const { id } = await params
  const profile = await getMakerProfile(id)

  if (!profile) {
    return {
      title: "Maker Not Found",
    }
  }

  return {
    title: profile.user.name,
    description: `Solutions shared by ${profile.user.name} on iScaleXchange.`,
    alternates: { canonical: `/u/${id}` },
  }
}

export default async function MakerProfilePage({ params }: MakerProfilePageProps) {
  const { id } = await params
  const profile = await getMakerProfile(id)

  if (!profile) {
    notFound()
  }

  const { user, projects, stats } = profile

  const personLd = personSchema({
    name: user.name,
    path: `/u/${id}`,
    image: user.image || undefined,
  })
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: user.name, url: `/u/${id}` },
  ])

  return (
    <div className="foundry-page min-h-screen">
      <JsonLd data={[personLd, breadcrumb]} />
      <div className="foundry-container">
        {/* Profile header */}
        <header className="foundry-panel scroll-live mb-10 flex flex-col items-center gap-5 rounded-2xl p-8 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="border-border h-24 w-24 flex-shrink-0 rounded-full border object-cover"
            />
          ) : (
            <div className="bg-muted border-border text-foreground flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border text-3xl font-black">
              {user.name.charAt(0)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-foreground text-3xl font-black sm:text-4xl">
              {user.name}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Member since {format(new Date(user.createdAt), "MMMM yyyy")}
            </p>

            {/* Stat pills */}
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              <span className="border-border bg-muted text-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold">
                <RiAppsLine className="h-4 w-4" />
                {stats.totalTools} {stats.totalTools === 1 ? "tool" : "tools"}
              </span>
              <span className="border-border bg-muted text-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold">
                <RiThumbUpFill className="text-primary h-4 w-4" />
                {stats.totalUpvotes} {stats.totalUpvotes === 1 ? "upvote" : "upvotes"}
              </span>
            </div>
          </div>
        </header>

        {/* Tools grid */}
        <section>
          <h2 className="font-heading text-foreground mb-5 text-xl font-black">
            Tools by {user.name}
          </h2>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ExploreGridCard
                  key={p.id}
                  slug={p.slug}
                  name={p.name}
                  description={p.description}
                  images={galleryFor(p)}
                  launchStatus={p.launchStatus}
                  upvoteCount={p.upvoteCount}
                  commentCount={p.commentCount}
                  categories={p.categories}
                  creatorName={user.name}
                  creatorImage={user.image}
                  projectId={p.id}
                />
              ))}
            </div>
          ) : (
            <div className="foundry-panel flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
              <RiAppsLine className="text-muted-foreground/60 mb-3 h-10 w-10" />
              <p className="text-foreground font-medium">No solutions yet</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {user.name} hasn&apos;t published any tools yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
