"use client"

import { useMemo, useState } from "react"

import { RiSearchLine } from "@remixicon/react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { ExploreGridCard } from "@/components/explore/explore-grid-card"
import { galleryFor } from "@/components/explore/explore-view"
import type { ExploreProject } from "@/app/actions/explore"

interface ExploreBrowserProps {
  projects: ExploreProject[]
  isAuthenticated?: boolean
}

const ALL = "All"

export function ExploreBrowser({ projects, isAuthenticated = false }: ExploreBrowserProps) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>(ALL)

  // Distinct category names, sorted alphabetically.
  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const p of projects) {
      for (const c of p.categories) set.add(c.name)
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [projects])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter((p) => {
      // Category filter
      if (activeCategory !== ALL && !p.categories.some((c) => c.name === activeCategory)) {
        return false
      }
      if (!q) return true
      const haystack = [
        p.name,
        p.description.replace(/<[^>]*>/g, ""),
        ...p.categories.map((c) => c.name),
      ]
        .join(" ")
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [projects, query, activeCategory])

  return (
    <section className="space-y-6">
      {/* Search input */}
      <div className="relative max-w-2xl">
        <RiSearchLine className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search solutions by name, problem, or category..."
          aria-label="Search solutions"
          className="bg-card text-foreground placeholder:text-muted-foreground h-12 rounded-xl border-cyan-100/18 pl-11 text-base shadow-[0_0_32px_rgb(0_229_255_/_0.08)]"
        />
      </div>

      {/* Category filter chips */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <CategoryChip
            label="All"
            active={activeCategory === ALL}
            onClick={() => setActiveCategory(ALL)}
          />
          {categories.map((name) => (
            <CategoryChip
              key={name}
              label={name}
              active={activeCategory === name}
              onClick={() => setActiveCategory(name)}
            />
          ))}
        </div>
      )}

      {/* Count */}
      <p className="text-muted-foreground text-sm">
        {filtered.length} {filtered.length === 1 ? "solution" : "solutions"}
      </p>

      {/* Grid / empty state */}
      {filtered.length === 0 ? (
        <div className="foundry-panel flex flex-col items-center justify-center gap-2 rounded-xl border-dashed py-16 text-center">
          <RiSearchLine className="text-muted-foreground h-7 w-7" />
          <h3 className="font-heading text-base font-semibold">No solutions match your search</h3>
          <p className="text-muted-foreground max-w-sm text-sm">
            Try a different keyword or clear the filters to see everything.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
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
              creatorName={p.creatorName}
              creatorImage={p.creatorImage}
              projectId={p.id}
              userHasUpvoted={p.userHasUpvoted}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "text-primary-foreground border-cyan-200/45 bg-cyan-200 shadow-[0_0_24px_rgb(0_229_255_/_0.22)]"
          : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border-cyan-100/16",
      )}
    >
      {label}
    </button>
  )
}
