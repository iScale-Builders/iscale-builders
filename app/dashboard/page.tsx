import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

import { RiAddLine, RiHashtag, RiRocketLine, RiThumbUpLine } from "@remixicon/react"

import { ensureLocalUser } from "@/lib/ensure-user"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DashboardProjectCard } from "@/components/dashboard/dashboard-project-card"
import { getUserCreatedProjects, getUserUpvotedProjects } from "@/app/actions/projects"

// Base project type that matches the actual structure from the database
interface BaseProject {
  id: string
  name: string
  slug: string
  logoUrl: string
  description: string
  launchStatus: string
  scheduledLaunchDate?: string | Date | null
  upvoteCount?: string | number | null
  commentCount?: string | number | null
  websiteUrl?: string | null
  createdAt: string | Date
  createdBy?: string | null
  dailyRanking?: number | null
}

export default async function Dashboard() {
  // Upsert + fetch the local user row (id = Clerk userId). Middleware already
  // guards this route, but ensureLocalUser also creates the local row on first
  // visit so FK-bound actions work immediately.
  const localUser = await ensureLocalUser()

  // If user is not logged in, we shouldn't be here
  if (!localUser) {
    redirect("/sign-in")
  }

  // Get data from actions
  const upvotedProjectsData = await getUserUpvotedProjects()
  const createdProjectsData = await getUserCreatedProjects()

  // Process the data to match our expected formats
  const upvotedProjects = upvotedProjectsData.map((item) => item.project) as BaseProject[]
  const createdProjects = createdProjectsData as BaseProject[]

  return (
    <div className="min-h-[calc(100vh-64px)] py-6 sm:py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="font-heading text-2xl font-bold sm:text-3xl">Dashboard</h1>
              <p className="text-muted-foreground">Welcome, {localUser.name || "User"}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" asChild>
                <Link href="/explore">Explore</Link>
              </Button>
              <Button asChild>
                <Link
                  href="/projects/submit"
                  className="flex w-full items-center justify-center gap-2 sm:w-auto"
                >
                  <RiAddLine className="h-4 w-4" />
                  Submit a Project
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - My Projects */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="border dark:border-zinc-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-xl font-semibold">My Projects</CardTitle>
                </div>
                <CardDescription>Your problems and solutions</CardDescription>
              </CardHeader>
              <CardContent className="pb-1">
                {createdProjects.length > 0 ? (
                  <div className="space-y-3">
                    {createdProjects.map((project) => (
                      <DashboardProjectCard key={project.id} {...project} />
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <div className="bg-secondary/50 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                      <RiRocketLine className="text-muted-foreground h-6 w-6" />
                    </div>
                    <h3 className="mb-1 font-medium">No posts yet</h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      You haven&apos;t posted any problems or solutions yet
                    </p>
                    <Button size="sm" asChild>
                      <Link href="/projects/submit">Post a problem or solution</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Upvotes Section */}
            <Card className="border dark:border-zinc-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-xl font-semibold">
                    Recent Upvotes
                  </CardTitle>
                </div>
                <CardDescription>Projects you&apos;ve recently upvoted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upvotedProjects.length > 0 ? (
                    upvotedProjects
                      .slice(0, 4)
                      .map((project) => <DashboardProjectCard key={project.id} {...project} />)
                  ) : (
                    <div className="py-6 text-center">
                      <div className="bg-secondary/50 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                        <RiThumbUpLine className="text-muted-foreground h-6 w-6" />
                      </div>
                      <h3 className="mb-1 font-medium">No upvotes yet</h3>
                      <p className="text-muted-foreground mb-4 text-sm">
                        You haven&apos;t upvoted any projects yet
                      </p>
                      <Button size="sm" asChild>
                        <Link href="/explore">Explore Projects</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile and Actions */}
          <div className="space-y-6">
            <Card className="border dark:border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-xl font-semibold">Profile</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full border">
                    {localUser.image ? (
                      <Image
                        src={localUser.image}
                        alt={localUser.name || "User"}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center object-cover text-2xl font-bold">
                        {localUser.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">{localUser.name}</h4>
                    <p className="text-muted-foreground text-sm">{localUser.email}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 pt-0">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/settings" className="flex items-center justify-center gap-2">
                    <RiRocketLine className="h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="font-heading text-xl font-semibold">Quick Actions</CardTitle>
                <CardDescription>Common tasks you can perform</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button variant="outline" asChild className="justify-start">
                  <Link href="/projects/submit" className="flex items-center gap-2">
                    <RiAddLine className="h-4 w-4" />
                    Submit a Project
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <Link href="/explore" className="flex items-center gap-2">
                    <RiRocketLine className="h-4 w-4" />
                    Explore
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <Link href="/categories" className="flex items-center gap-2">
                    <RiHashtag className="h-4 w-4" />
                    Explore categories
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
