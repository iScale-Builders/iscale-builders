/* eslint-disable @next/next/no-img-element */
import Link from "next/link"

import { RiGithubFill } from "@remixicon/react"

import { ReadyPixlSponsorLink } from "@/components/sponsor/readypixl-sponsor-link"

// Link groups for a columnar layout
const discoverLinks = [
  { title: "Trending", href: "/trending" },
  { title: "Categories", href: "/categories" },
  { title: "Submit Project", href: "/projects/submit" },
]

const resourcesLinks = [
  // Sponsors hidden for now (2026-06-17) — page kept, bringing it back later.
  // { title: "Sponsors", href: "/sponsors" },
  { title: "Blog", href: "/blog" },
]

const legalLinks = [
  { title: "Terms of Service", href: "/legal/terms" },
  { title: "Privacy Policy", href: "/legal/privacy" },
  { title: "Attribution Badges", href: "/legal/badges" },
]

// Liens pour la nouvelle colonne "Connect"
const connectLinkItems = [
  {
    href: "https://github.com/iScale-Builders",
    icon: RiGithubFill,
    label: "GitHub",
  },
]

export default function FooterSection() {
  return (
    <footer className="bg-card/78 text-foreground border-t border-cyan-100/14 pt-8 pb-10 shadow-[0_-18px_60px_rgb(0_0_0_/_0.26)] backdrop-blur-2xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-12 md:gap-x-8">
          {/* Left Section: Brand, Copyright, Author, Badges - Align left on mobile */}
          <div className="flex flex-col items-start text-left md:col-span-4 lg:col-span-4">
            <Link href="/" prefetch={false} className="font-heading mb-3 flex items-center">
              <span className="font-heading flex items-center text-xl font-black tracking-tight">
                <img src="/logo.svg" alt="iScaleBuilders logo" className="mr-2 h-9 w-9" />
                <span className="text-foreground">iScaleBuilders</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} iScaleBuilders. All rights reserved.
              <span className="ml-2">v0.4.4</span>
            </p>
            <p className="text-muted-foreground text-sm">
              Built by the{" "}
              <Link
                href="https://github.com/iScale-Builders"
                target="_blank"
                rel="noopener"
                className="hover:text-primary underline"
              >
                iScale community
              </Link>
            </p>
            <div className="mt-4 mb-4 w-full max-w-[300px]">
              <ReadyPixlSponsorLink />
            </div>
            {/* Legally-required "Powered by Open-Launch" attribution badge + dofollow link. DO NOT add nofollow or remove. */}
            <div className="flex items-center justify-start space-x-3">
              <a href="https://open-launch.com" target="_blank" title="Powered by Open-Launch">
                <img
                  src="/images/badges/powered-by-light.svg"
                  alt="Powered by Open-Launch"
                  width={150}
                  height={44}
                  className="block dark:hidden"
                />
                <img
                  src="/images/badges/powered-by-dark.svg"
                  alt="Powered by Open-Launch"
                  width={150}
                  height={44}
                  className="hidden dark:block"
                />
              </a>
            </div>
          </div>

          {/* Right Section: Columnar Navigation Links - 2 colonnes sur mobile, 4 sur md */}
          <div className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-4">
            {/* Discover Column */}
            <div className="text-left">
              <h3 className="text-foreground text-sm font-semibold tracking-wider uppercase">
                Discover
              </h3>
              <ul role="list" className="mt-4 flex flex-col items-start space-y-3">
                {discoverLinks.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className="text-muted-foreground hover:text-primary text-sm transition-colors duration-150"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Column */}
            <div className="text-left">
              <h3 className="text-foreground text-sm font-semibold tracking-wider uppercase">
                Resources
              </h3>
              <ul role="list" className="mt-4 flex flex-col items-start space-y-3">
                {resourcesLinks.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className="text-muted-foreground hover:text-primary text-sm transition-colors duration-150"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Column */}
            <div className="text-left">
              <h3 className="text-foreground text-sm font-semibold tracking-wider uppercase">
                Legal
              </h3>
              <ul role="list" className="mt-4 flex flex-col items-start space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className="text-muted-foreground hover:text-primary text-sm transition-colors duration-150"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect Column */}
            <div className="text-left">
              <h3 className="text-foreground text-sm font-semibold tracking-wider uppercase">
                Connect
              </h3>
              <ul role="list" className="mt-4 flex flex-col items-start space-y-3">
                {connectLinkItems.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 text-sm transition-colors duration-150"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
