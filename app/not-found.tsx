import Link from "next/link"

import { RiArrowLeftLine, RiFireLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="foundry-page flex min-h-[80vh] items-center justify-center">
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="foundry-panel rounded-2xl p-8">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
            <div className="border-border bg-muted flex h-16 w-16 items-center justify-center rounded-full border">
              <span className="text-foreground text-2xl font-black">404</span>
            </div>
          </div>

          {/* Title and description */}
          <h1 className="font-heading text-foreground mb-3 text-3xl font-black">Page Not Found</h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved. Please check
            the URL or try navigating to another section of the site.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/">
                <RiArrowLeftLine className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild className="gap-2">
              <Link href="/explore" className="flex items-center gap-2">
                <RiFireLine className="h-4 w-4" />
                Explore
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
