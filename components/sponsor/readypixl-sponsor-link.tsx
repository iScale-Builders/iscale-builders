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
        "group bg-background/70 flex flex-col items-center justify-center rounded-lg border border-neutral-200 text-center transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700",
        isSidebar ? "gap-1.5 px-4 py-3" : "gap-1 px-3 py-2",
      )}
    >
      <span className="block text-[0.62rem] font-black tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
        Sponsored by
      </span>
      <span className="flex items-center justify-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/sponsors/rp-square.png"
          alt=""
          width={28}
          height={28}
          className="h-7 w-7 shrink-0 rounded-md"
        />
        <span className="flex h-8 w-32 items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/sponsors/readypixl-wordmark-dark.svg"
            alt="ReadyPixl"
            width={120}
            height={32}
            className="block h-auto max-h-7 w-full dark:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/sponsors/readypixl-wordmark-light.svg"
            alt="ReadyPixl"
            width={120}
            height={32}
            className="hidden h-auto max-h-7 w-full dark:block"
          />
        </span>
      </span>
      <span className="text-foreground block text-xs font-black">Bulk Image Editing</span>
    </Link>
  )
}
