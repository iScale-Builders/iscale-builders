"use client"

import { useRouter } from "next/navigation"

import { useClerk, UserProfile } from "@clerk/nextjs"
import { RiLogoutCircleLine, RiUserLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"

export default function Settings() {
  const router = useRouter()
  const { signOut } = useClerk()

  return (
    <div className="foundry-page min-h-screen">
      <div className="foundry-container max-w-6xl">
        <div className="scroll-live border-border mb-8 border-b pb-6">
          <p className="foundry-kicker">Control room</p>
          <h1 className="font-heading text-foreground text-4xl font-black tracking-tight sm:text-5xl">
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <div className="space-y-10">
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="border-border bg-muted rounded-lg border p-2.5">
                <RiUserLine className="text-foreground h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-foreground text-lg font-black">
                  Profile &amp; Security
                </h2>
                <p className="text-muted-foreground text-sm">
                  Update your personal information, profile picture, password, and connected
                  accounts.
                </p>
              </div>
            </div>

            {/* Clerk-managed profile (name, image, email, password, MFA, sessions). */}
            <UserProfile routing="hash" />
          </section>

          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="border-border bg-muted rounded-lg border p-2.5">
                <RiLogoutCircleLine className="text-foreground h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-foreground text-lg font-black">Session</h2>
                <p className="text-muted-foreground text-sm">Sign out from your current session.</p>
              </div>
            </div>

            <div className="foundry-panel rounded-2xl p-6">
              <Button
                variant="destructive"
                className="hover:bg-destructive/90 cursor-pointer gap-2"
                onClick={() =>
                  void signOut(() => {
                    router.push("/")
                    router.refresh()
                  })
                }
              >
                <RiLogoutCircleLine className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
