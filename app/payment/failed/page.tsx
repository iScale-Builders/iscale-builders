"use client"

import { useRouter } from "next/navigation"

import { RiAlertLine, RiArrowLeftLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"

export default function PaymentFailedPage() {
  const router = useRouter()

  return (
    <div className="foundry-page flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="foundry-panel w-full max-w-md rounded-2xl p-6 text-center">
        <div className="border-border bg-muted mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border shadow-[0_0_32px_rgb(255_150_70_/_0.18)]">
          <RiAlertLine className="text-foreground h-8 w-8" />
        </div>
        <h1 className="text-foreground mb-2 text-2xl font-black">Payment Failed</h1>
        <p className="text-muted-foreground mb-6">
          Your payment could not be processed. Please try again later or contact support if the
          issue persists.
        </p>
        <Button onClick={() => router.push("/")} className="flex items-center gap-2">
          <RiArrowLeftLine className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>
  )
}
