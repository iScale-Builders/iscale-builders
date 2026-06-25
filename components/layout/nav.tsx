/* eslint-disable @next/next/no-img-element */
import Link from "next/link"

import { auth } from "@clerk/nextjs/server"
import {
  RiDashboardLine,
  RiExchangeLine,
  RiFlashlightLine,
  // RiHandCoinLine, // hidden with the Sponsors tab (2026-06-17)
  RiHomeLine,
  RiLayoutGridLine,
  RiLoginBoxLine,
  RiMedalLine,
  RiMenuLine,
  RiTeamLine,
  RiUserAddLine,
} from "@remixicon/react"

import { ensureLocalUser } from "@/lib/ensure-user"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { ThemeToggle } from "../theme/theme-toggle"
import { ThemeToggleMenu } from "../theme/theme-toggle-menu"
import { Button } from "../ui/button"
import { NavMenu } from "./nav-menu"
import { SearchCommand } from "./search-command"
import { UserNav } from "./user-nav"

export default async function Nav() {
  const { userId } = await auth()
  let localUser = null
  if (userId) {
    try {
      localUser = await ensureLocalUser()
    } catch (error) {
      console.error("Failed to sync local user in nav:", error)
    }
  }
  const session = Boolean(userId)
  const user = localUser
    ? {
        name: localUser.name,
        email: localUser.email,
        image: localUser.image,
        role: localUser.role ?? undefined,
      }
    : userId
      ? {
          name: "Account",
          email: "",
          image: null,
          role: undefined,
        }
      : null

  return (
    <nav className="bg-card/78 text-foreground sticky top-0 z-50 border-b border-cyan-100/14 shadow-[0_10px_40px_rgb(0_0_0_/_0.24)] backdrop-blur-2xl">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" prefetch={false} className="font-heading flex items-center">
            <span className="font-heading flex items-center text-xl font-black tracking-tight">
              <img src="/logo.png" alt="iScaleXchange logo" className="mr-2 h-10 w-10 rounded-md" />
              <span className="text-foreground">iScaleXchange</span>
            </span>
          </Link>

          {/* Navigation principale */}
          <NavMenu showDashboard={!!session} />
        </div>

        {/* Version Desktop - Recherche et actions */}
        <div className="hidden items-center gap-3 md:flex">
          {/* DECISION 3: search is fully public — render for everyone. */}
          <SearchCommand />

          <ThemeToggle />
          {session ? (
            <UserNav user={user!} />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in" prefetch={false}>
                  Sign in
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up" prefetch={false}>
                  Sign up
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Version Mobile - Menu Drawer */}
        <div className="flex items-center md:hidden">
          {session && <UserNav user={user!} />}
          {!session && (
            <Button variant="default" size="sm" asChild className="mr-2">
              <Link href="/sign-in" prefetch={false}>
                <RiLoginBoxLine className="h-4 w-4" />
                Sign in
              </Link>
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <RiMenuLine className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex h-full flex-col">
                <div className="px-2">
                  <SheetHeader className="mb-2 pb-0">
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {/* DECISION 3: search is fully public — render for everyone. */}
                  <div className="mt-2 mb-6 px-6">
                    <SearchCommand />
                  </div>
                  <div className="bg-border my-4 h-px" />
                  {/* Navigation — fully public; signed-out mobile users must be
                      able to reach Explore/Trending/Categories/etc. */}
                  <div className="mb-4">
                    <div className="mb-2 px-6">
                      <h3 className="text-muted-foreground mb-2 text-xs font-medium">NAVIGATION</h3>
                    </div>
                    <div className="space-y-1">
                      <SheetClose asChild>
                        <Link
                          href="/"
                          prefetch={false}
                          className="hover:bg-muted/50 flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
                        >
                          <RiHomeLine className="text-muted-foreground h-4 w-4" />
                          <span>Home</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/explore"
                          prefetch={false}
                          className="hover:bg-muted/50 flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
                        >
                          <RiLayoutGridLine className="text-muted-foreground h-4 w-4" />
                          <span>Explore</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/problems"
                          prefetch={false}
                          className="hover:bg-muted/50 flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
                        >
                          <RiExchangeLine className="text-muted-foreground h-4 w-4" />
                          <span>Problems</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/solutions"
                          prefetch={false}
                          className="hover:bg-muted/50 flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
                        >
                          <RiFlashlightLine className="text-muted-foreground h-4 w-4" />
                          <span>Solutions</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/trending"
                          prefetch={false}
                          className="hover:bg-muted/50 flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
                        >
                          <RiFlashlightLine className="text-muted-foreground h-4 w-4" />
                          <span>Trending</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/categories"
                          prefetch={false}
                          className="hover:bg-muted/50 flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
                        >
                          <RiLayoutGridLine className="text-muted-foreground h-4 w-4" />
                          <span>Categories</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/winners"
                          prefetch={false}
                          className="hover:bg-muted/50 flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
                        >
                          <RiMedalLine className="text-muted-foreground h-4 w-4" />
                          <span>Winners</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="https://www.skool.com/iscalexchange"
                          target="_blank"
                          rel="noreferrer"
                          className="hover:bg-muted/50 flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
                        >
                          <RiTeamLine className="text-muted-foreground h-4 w-4" />
                          <span>Community</span>
                        </Link>
                      </SheetClose>
                      {/* Payments are off, so paid launch links stay hidden. */}
                      {/* Sponsors tab hidden for now (2026-06-17) — bringing it
                            back later. Page + components kept; only nav entry hidden. */}
                      {/* <SheetClose asChild>
                          <Link
                            href="/sponsors"
                            className="hover:bg-muted/50 flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
                          >
                            <RiHandCoinLine className="text-muted-foreground h-4 w-4" />
                            <span>Sponsors</span>
                          </Link>
                        </SheetClose> */}
                      {session && (
                        <SheetClose asChild>
                          <Link
                            href="/dashboard"
                            prefetch={false}
                            className="hover:bg-muted/50 flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
                          >
                            <RiDashboardLine className="text-muted-foreground h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </SheetClose>
                      )}
                    </div>
                  </div>

                  {/* Séparateur */}
                  <div className="bg-border my-4 h-px" />

                  {/* Actions */}
                  <div className="mb-4">
                    <div className="mb-2 px-6">
                      <h3 className="text-muted-foreground mb-2 text-xs font-medium">ACTIONS</h3>
                    </div>
                    <div>
                      <ThemeToggleMenu />
                    </div>

                    {!session && (
                      <div className="space-y-1">
                        <SheetClose asChild>
                          <Link
                            href="/sign-in"
                            prefetch={false}
                            className="hover:bg-muted/50 flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
                          >
                            <RiLoginBoxLine className="text-muted-foreground h-4 w-4" />
                            <span>Sign in</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/sign-up"
                            prefetch={false}
                            className="hover:bg-muted/50 flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
                          >
                            <RiUserAddLine className="text-muted-foreground h-4 w-4" />
                            <span>Sign up</span>
                          </Link>
                        </SheetClose>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
