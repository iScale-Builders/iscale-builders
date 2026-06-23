import Link from "next/link"

import { RiArrowLeftLine, RiQuestionLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"

export default function ProjectNotFound() {
  return (
    <div className="foundry-page flex min-h-[80vh] items-center justify-center">
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="foundry-panel rounded-2xl p-8">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
            <div className="border-border bg-muted flex h-16 w-16 items-center justify-center rounded-full border shadow-[0_0_32px_rgb(255_150_70_/_0.18)]">
              <RiQuestionLine className="text-foreground h-8 w-8" />
            </div>
          </div>

          {/* Title and description */}
          <h1 className="font-heading text-foreground mb-3 text-3xl font-black">
            Project Not Found
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-md">
            The project you&apos;re looking for doesn&apos;t exist or may have been removed. It
            might be a project that was abandoned during the payment process.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/" className="text-primary hover:text-primary/80 hover:text-foreground">
                <RiArrowLeftLine className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild className="gap-2">
              <Link href="/projects/submit">Submit a Project</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
