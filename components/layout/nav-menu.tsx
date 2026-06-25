"use client"

import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

interface NavMenuProps {
  showDashboard?: boolean
}

export function NavMenu({ showDashboard = true }: NavMenuProps) {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-9 cursor-pointer px-3 text-sm">
            Explore
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[280px] gap-1 p-2">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/explore"
                    prefetch={false}
                    className="block rounded-md px-2 py-2 text-sm no-underline transition-colors outline-none select-none"
                  >
                    <div className="mb-1 font-medium">Explore</div>
                    <p className="text-muted-foreground text-xs leading-tight">
                      Browse tools, workflows, and exchanges
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/problems"
                    prefetch={false}
                    className="block rounded-md px-2 py-2 text-sm no-underline transition-colors outline-none select-none"
                  >
                    <div className="mb-1 font-medium">Problems</div>
                    <p className="text-muted-foreground text-xs leading-tight">
                      See what people need solved
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/solutions"
                    prefetch={false}
                    className="block rounded-md px-2 py-2 text-sm no-underline transition-colors outline-none select-none"
                  >
                    <div className="mb-1 font-medium">Solutions</div>
                    <p className="text-muted-foreground text-xs leading-tight">
                      Tools and workflows mapped to problems
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/categories"
                    prefetch={false}
                    className="block rounded-md px-2 py-2 text-sm no-underline transition-colors outline-none select-none"
                  >
                    <div className="mb-1 font-medium">Categories</div>
                    <p className="text-muted-foreground text-xs leading-tight">
                      Browse projects by category
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {showDashboard && (
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/dashboard"
                prefetch={false}
                className={`${navigationMenuTriggerStyle()} h-9 px-3 text-sm`}
              >
                Dashboard
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/projects/submit"
              prefetch={false}
              className={`${navigationMenuTriggerStyle()} h-9 px-3 text-sm`}
            >
              Submit
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="https://www.skool.com/iscalexchange"
              target="_blank"
              rel="noreferrer"
              className={`${navigationMenuTriggerStyle()} h-9 px-3 text-sm`}
            >
              Community
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Payments are off, so paid launch links stay hidden. */}

        {/* Sponsors tab hidden for now (2026-06-17) — bringing it back later.
            Page + components kept intact; only the nav entry is hidden. */}
        {/* <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/sponsors" className={`${navigationMenuTriggerStyle()} h-9 px-3 text-sm`}>
              Sponsors
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem> */}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
