import type { Metadata } from "next"

import { SignIn } from "@clerk/nextjs"

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
}

export default function SignInPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-sm items-center justify-center px-4 py-10">
      <SignIn />
    </div>
  )
}
