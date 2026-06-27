export interface IScaleLabsAppSeed {
  name: string
  slug: string
  builderEmail?: string
  description: string
  websiteUrl: string
  productImage: string
  coverImage?: string
  galleryImages?: string[]
  logoUrl: string
  githubUrl?: string
  launchStatus?: "scheduled" | "ongoing" | "launched"
  techStack: string[]
  pricing: "free" | "paid"
  platforms: string[]
  categories: string[]
  popularity: number
}

const thumbnail = (slug: string) => `/images/apps/${slug}.png`
const realAsset = (filename: string) => `/images/apps/real/${filename}`
const listingUrl = (slug: string) => `https://iscalexchange.com/projects/${slug}`

export const iscaleLabsApps: IScaleLabsAppSeed[] = [
  {
    name: "PromoteFlow",
    slug: "promoteflow",
    description:
      "PromoteFlow is the promotion command center for turning real iScaleLabs work into launch content, social posts, replies, short-form clips, community prompts, and distribution workflows without losing the thread of what is actually being built.",
    websiteUrl: listingUrl("promoteflow"),
    productImage: thumbnail("promoteflow"),
    logoUrl: thumbnail("promoteflow"),
    techStack: ["Content Engine", "Social Workflow", "AI Agents"],
    pricing: "free",
    platforms: ["web"],
    categories: ["Content", "Marketing", "Automation"],
    popularity: 110,
  },
  {
    name: "PinTwist",
    slug: "pintwist",
    description:
      "PinTwist is the open-source Pinterest research extension for print-on-demand sellers: it overlays save counts, reactions, comments, repins, and creation dates on every pin, then lets you sort, filter, build a local catalog, and export CSV — 100% local, no account or backend. Free and open source (Apache-2.0), full code public on GitHub.",
    websiteUrl: listingUrl("pintwist"),
    productImage: "/images/apps/pintwist-1.webp",
    logoUrl: "/images/apps/pintwist-3.webp",
    githubUrl: "https://github.com/iScale-Builders/pintwist",
    techStack: ["Chrome Extension", "JavaScript", "Local-first", "Open Source", "Apache-2.0"],
    pricing: "free",
    platforms: ["web"],
    categories: ["Research", "Pinterest", "Open Source"],
    popularity: 100,
  },
  {
    name: "iScale Etsy",
    slug: "iscale-etsy",
    description:
      "iScale Etsy is the Etsy research lane for finding product angles, shop patterns, listing opportunities, and marketplace signals that can turn print-on-demand ideas into sharper Etsy execution.",
    websiteUrl: listingUrl("iscale-etsy"),
    productImage: thumbnail("iscale-etsy"),
    logoUrl: realAsset("iscale-etsy-icon-128.png"),
    techStack: ["Research", "Data Pipeline", "Marketplace Analysis"],
    pricing: "free",
    platforms: ["web"],
    categories: ["Research", "Etsy", "Listings"],
    popularity: 96,
  },
  {
    name: "iScale Merch",
    slug: "iscale-merch",
    description:
      "iScale Merch is the Merch by Amazon command lane for POD operators: research, listing strategy, Chrome extension workflows, and the future bridge between product data and execution.",
    websiteUrl: listingUrl("iscale-merch"),
    productImage: "/images/apps/iscalemerch-1.webp",
    coverImage: "/images/apps/iscalemerch-2.webp",
    logoUrl: "/images/apps/iscalemerch-3.webp",
    techStack: ["Chrome Extension", "Amazon Merch", "Next.js"],
    pricing: "free",
    platforms: ["web"],
    categories: ["Amazon Merch", "Research", "Listings"],
    popularity: 95,
  },
  {
    name: "iScale Listings",
    slug: "iscale-listings",
    description:
      "iScale Listings is the listing intelligence system for turning niche research into titles, bullets, descriptions, tags, and publish-ready product metadata across POD marketplaces.",
    websiteUrl: listingUrl("iscale-listings"),
    productImage: thumbnail("iscale-listings"),
    logoUrl: realAsset("iscale-listings-icon-128.png"),
    techStack: ["Listing Engine", "Keyword Systems", "POD Metadata"],
    pricing: "free",
    platforms: ["web"],
    categories: ["Listings", "Keywords", "Automation"],
    popularity: 93,
  },
  {
    name: "AutoMerch",
    slug: "automerch",
    description:
      "AutoMerch is the Merch by Amazon upload automation lane: folder-first preparation, upload-only workflows, listing metadata handling, and operator-safe automation for scaling catalog work.",
    websiteUrl: listingUrl("automerch"),
    productImage: realAsset("automerch-pod-cover.png"),
    logoUrl: thumbnail("automerch"),
    techStack: ["Automation", "Upload Workflow", "Merch by Amazon"],
    pricing: "free",
    platforms: ["desktop", "web"],
    categories: ["Automation", "Amazon Merch", "Upload"],
    popularity: 92,
  },
  {
    name: "Amazon Ads Control",
    slug: "amazon-ads-control",
    description:
      "Amazon Ads Control is the local-first control plane for Merch and Amazon Ads: dashboard mapping, read-only mirrors, approval packets, dry-run changes, and operator-safe ad recommendations.",
    websiteUrl: listingUrl("amazon-ads-control"),
    productImage: realAsset("amazon-ads-control-dashboard.png"),
    logoUrl: thumbnail("amazon-ads-control"),
    techStack: ["Next.js", "SQLite", "Amazon Ads"],
    pricing: "paid",
    platforms: ["web"],
    categories: ["Amazon Ads", "Analytics", "Automation"],
    popularity: 91,
  },
  {
    name: "iScale Images",
    slug: "iscale-images",
    description:
      "iScale Images is the image-generation and asset pipeline for POD: prompt queues, transparent cleanup, variation systems, and product-ready image operations.",
    websiteUrl: listingUrl("iscale-images"),
    productImage: "/images/apps/iscale-images-1.png",
    coverImage: "/images/apps/iscale-images-2.png",
    galleryImages: [
      "/images/apps/iscale-images-1.png",
      "/images/apps/iscale-images-2.png",
      "/images/apps/iscale-images-3.png",
    ],
    logoUrl: "/images/apps/iscale-images-3.png",
    techStack: ["Image Generation", "Automation", "Asset Pipeline"],
    pricing: "free",
    platforms: ["web"],
    categories: ["Images", "Automation", "Design"],
    launchStatus: "launched",
    popularity: 90,
  },
  {
    name: "iScale Keywords",
    slug: "iscale-keywords",
    description:
      "iScale Keywords is the keyword and trademark research lane for POD operators, built to separate usable listing language from risky terms before products go live.",
    websiteUrl: listingUrl("iscale-keywords"),
    productImage: thumbnail("iscale-keywords"),
    logoUrl: thumbnail("iscale-keywords"),
    techStack: ["Keyword Research", "Trademark Checks", "POD"],
    pricing: "free",
    platforms: ["web"],
    categories: ["Keywords", "Compliance", "Research"],
    popularity: 88,
  },
  {
    name: "Design Library Team",
    slug: "design-library-team",
    description:
      "Design Library Team is the app lane for organizing design assets, team review, and reusable POD design intelligence so creative work can become a searchable production library.",
    websiteUrl: listingUrl("design-library-team"),
    productImage: thumbnail("design-library-team"),
    logoUrl: thumbnail("design-library-team"),
    techStack: ["Design Systems", "Asset Library", "Team Workflow"],
    pricing: "free",
    platforms: ["web"],
    categories: ["Design", "Assets", "Workflow"],
    popularity: 80,
  },
  {
    name: "iScaleXchange",
    slug: "iscale-builders",
    description:
      "iScaleXchange is the public app showcase and community-facing builder directory for the iScaleLabs ecosystem: a place to surface the tools, workflows, and products being built.",
    websiteUrl: "https://iscalexchange.com",
    productImage: thumbnail("iscale-builders"),
    logoUrl: thumbnail("iscale-builders"),
    githubUrl: "https://github.com/iScale-Builders/iscale-builders",
    techStack: ["Next.js", "Postgres", "Clerk"],
    pricing: "free",
    platforms: ["web"],
    categories: ["Community", "Directory", "Tools"],
    popularity: 78,
  },
]
