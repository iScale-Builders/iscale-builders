import Link from "next/link"

import { RiFilePaper2Line, RiMedalLine, RiShieldUserLine } from "@remixicon/react"

export const metadata = {
  title: "Legal Information",
  description: "Legal information and policies for the iScaleBuilders platform",
  alternates: { canonical: "/legal" },
}

export default function LegalPage() {
  return (
    <div className="foundry-page py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="foundry-panel rounded-2xl p-6 sm:p-8">
          <p className="foundry-kicker mb-3">Operating clarity</p>
          <h1 className="font-heading mb-6 text-4xl font-black text-white sm:text-5xl">
            Legal Information
          </h1>
          <p className="text-muted-foreground mb-8">
            At iScaleBuilders, we are committed to transparency and protecting your rights. As an
            open source project, we believe in openness and community collaboration. Please review
            our legal documents to understand how we operate and protect your information.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/legal/terms"
              className="foundry-card flex flex-col items-center rounded-2xl p-6 text-center transition-colors"
            >
              <RiFilePaper2Line className="text-primary mb-4 h-12 w-12" />
              <h2 className="mb-2 text-lg font-semibold">Terms of Service</h2>
              <p className="text-muted-foreground text-sm">
                The rules and guidelines for using our platform and services.
              </p>
            </Link>

            <Link
              href="/legal/privacy"
              className="foundry-card flex flex-col items-center rounded-2xl p-6 text-center transition-colors"
            >
              <RiShieldUserLine className="text-primary mb-4 h-12 w-12" />
              <h2 className="mb-2 text-lg font-semibold">Privacy Policy</h2>
              <p className="text-muted-foreground text-sm">
                How we collect, use, and protect your personal information.
              </p>
            </Link>

            <Link
              href="/legal/badges"
              className="foundry-card flex flex-col items-center rounded-2xl p-6 text-center transition-colors"
            >
              <RiMedalLine className="text-primary mb-4 h-12 w-12" />
              <h2 className="mb-2 text-lg font-semibold">Attribution Badges</h2>
              <p className="text-muted-foreground text-sm">
                Official badges for Open-Launch License attribution requirements.
              </p>
            </Link>
          </div>

          <div className="mt-10 border-t pt-6 dark:border-zinc-800">
            <h2 className="mb-4 text-xl font-semibold">Contact Information</h2>
            <p className="mb-2">
              If you have any questions about our legal policies, please contact us:
            </p>
            <ul className="mb-6 space-y-2">
              <li>
                <strong>Mail:</strong>{" "}
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                  className="text-primary hover:underline"
                >
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          <div className="mt-8 border-t pt-6 dark:border-zinc-800">
            <Link href="/" className="text-primary hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
