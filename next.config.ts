import type { NextConfig } from "next"

import createMDX from "@next/mdx"
import remarkGfm from "remark-gfm"

const nextConfig: NextConfig = {
  /* config options here */

  // Don't fail the production build on lint/type noise (a separate lint runs in CI).
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Configuration pour MDX
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      // Makers submit tools with arbitrary logo/product-image URLs. A strict
      // host allowlist made next/image throw a client-side exception (crashing
      // the submit review step + public project page) for any host not listed
      // below. Allow any https host so user-provided image URLs render. The
      // specific hosts below are kept for clarity/intent. (2026-06-17)
      {
        protocol: "https",
        hostname: "**",
      },
      ...(process.env.NEXT_PUBLIC_UPLOADTHING_URL
        ? [
            {
              protocol: "https" as const,
              hostname: process.env.NEXT_PUBLIC_UPLOADTHING_URL,
            },
          ]
        : []),
    ],
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
  },
})

// Combine MDX and Next.js config
export default withMDX(nextConfig)
