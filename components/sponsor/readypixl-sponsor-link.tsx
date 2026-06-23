import Link from "next/link"

import { cn } from "@/lib/utils"

const READYPIXL_URL = "https://readypixl.com"

interface ReadyPixlSponsorLinkProps {
  variant?: "footer" | "sidebar"
}

export function ReadyPixlSponsorLink({ variant = "footer" }: ReadyPixlSponsorLinkProps) {
  const isSidebar = variant === "sidebar"

  return (
    <Link
      href={READYPIXL_URL}
      target="_blank"
      rel="sponsored noopener noreferrer"
      aria-label="Sponsored by ReadyPixl"
      className={cn(
        "group border-border bg-background/70 hover:border-primary/35 hover:bg-muted/70 flex flex-col items-start gap-2 rounded-lg border transition-colors",
        isSidebar ? "p-3" : "px-3 py-2",
      )}
    >
      <span className="text-muted-foreground block text-[0.65rem] font-black tracking-[0.18em] uppercase">
        Sponsored by
      </span>
      <span className="bg-card border-border flex h-12 w-40 shrink-0 items-center justify-center overflow-hidden rounded-md border px-3">
        <img
          src="/images/sponsors/readypixl-wordmark-dark.svg"
          alt="ReadyPixl"
          width={120}
          height={32}
          className="block h-auto w-full dark:hidden"
        />
        <img
          src="/images/sponsors/readypixl-wordmark-light.svg"
          alt="ReadyPixl"
          width={120}
          height={32}
          className="hidden h-auto w-full dark:block"
        />
      </span>
      <span className="text-foreground group-hover:text-primary block text-sm font-black">
        Bulk image editing
      </span>
    </Link>
  )
}
