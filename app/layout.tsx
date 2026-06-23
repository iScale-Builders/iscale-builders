import type { Metadata } from "next"
import { Space_Grotesk as FontHeading, Inter as FontSans } from "next/font/google"

import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"

import { organizationSchema, websiteSchema } from "@/lib/seo/schema"
import {
  DEFAULT_TITLE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SOCIAL_PROFILES,
  TITLE_TEMPLATE,
} from "@/lib/seo/site"
import Footer from "@/components/layout/footer"
import Nav from "@/components/layout/nav"
import { JsonLd } from "@/components/seo/json-ld"
import { ThemeProvider } from "@/components/theme/theme-provider"

import "./globals.css"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontHeading = FontHeading({
  subsets: ["latin"],
  variable: "--font-heading",
})

const appUrl = process.env.NEXT_PUBLIC_URL || "https://iscalebuilders.com"

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: DEFAULT_TITLE,
    template: TITLE_TEMPLATE,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    url: appUrl,
    siteName: SITE_NAME,
    images: [
      {
        url: "og.png",
        width: 1200,
        height: 630,
        alt: DEFAULT_TITLE,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: ["og.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <JsonLd data={[organizationSchema(SOCIAL_PROFILES), websiteSchema()]} />
        </head>
        <body
          className={`font-sans antialiased ${fontSans.variable} ${fontHeading.variable} sm:overflow-y-scroll`}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="foundry-shell flex min-h-dvh flex-col">
              <Nav />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
