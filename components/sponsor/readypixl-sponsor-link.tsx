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
        "group border-border bg-background/70 hover:border-primary/35 hover:bg-muted/70 flex flex-col items-center justify-center rounded-lg border text-center transition-colors",
        isSidebar ? "gap-1.5 px-4 py-3" : "gap-1 px-3 py-2",
      )}
    >
      <span className="text-muted-foreground block text-[0.62rem] font-black tracking-[0.16em] uppercase">
        Sponsored by
      </span>
      <span className="flex h-8 w-36 shrink-0 items-center justify-center overflow-hidden">
        <img
          src="/images/sponsors/readypixl-wordmark-dark.svg"
          alt="ReadyPixl"
          width={120}
          height={32}
          className="block h-auto max-h-7 w-full dark:hidden"
        />
        <img
          src="/images/sponsors/readypixl-wordmark-light.svg"
          alt="ReadyPixl"
          width={120}
          height={32}
          className="hidden h-auto max-h-7 w-full dark:block"
        />
      </span>
      <span className="text-foreground group-hover:text-primary block text-xs font-black">
        Bulk image editing
      </span>
    </Link>
  )
}
