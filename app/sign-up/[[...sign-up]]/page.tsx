import type { Metadata } from "next"

import { SignUp } from "@clerk/nextjs"

export const metadata: Metadata = {
  title: "Sign Up",
  robots: { index: false, follow: false },
}

export default function SignUpPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-sm items-center justify-center px-4 py-10">
      <SignUp />
    </div>
  )
}
