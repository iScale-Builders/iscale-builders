export interface IScaleLabsAppSeed {
  name: string
  slug: string
  builderEmail?: string
  description: string
  websiteUrl: string
  productImage: string
  logoUrl: string
  githubUrl?: string
  techStack: string[]
  pricing: "free" | "freemium" | "paid"
  platforms: string[]
  categories: string[]
  popularity: number
}

const thumbnail = (slug: string) => `/images/apps/${slug}.png`
const realAsset = (filename: string) => `/images/apps/real/${filename}`
const listingUrl = (slug: string) => `https://iscalebuilders.com/projects/${slug}`

export const iscaleLabsApps: IScaleLabsAppSeed[] = [
  {
    name: "PromoteFlow",
    slug: "promoteflow",
    builderEmail: "dobrin22@gmail.com",
    description:
      "PromoteFlow is the promotion command center for turning real iScaleLabs work into launch content, social posts, replies, short-form clips, community prompts, and distribution workflows without losing the thread of what is actually being built.",
    websiteUrl: listingUrl("promoteflow"),
    productImage: thumbnail("promoteflow"),
    logoUrl: thumbnail("promoteflow"),
    techStack: ["Content Engine", "Social Workflow", "AI Agents"],
    pricing: "freemium",
    platforms: ["web"],
    categories: ["Content", "Marketing", "Automation"],
    popularity: 110,
  },
  {
    name: "PinTwist",
    slug: "pintwist",
    description:
      "PinTwist is the Pinterest research and automation app for print-on-demand sellers: scan Pinterest surfaces, collect pin signals, organize trend data, and turn visual research into product ideas and content direction.",
    websiteUrl: listingUrl("pintwist"),
    productImage: realAsset("pintwist-screenshot.png"),
    logoUrl: realAsset("pintwist-logo-icon.png"),
    githubUrl: "https://github.com/qminati/pintwist",
    techStack: ["Chrome Extension", "JavaScript", "Local Storage"],
    pricing: "freemium",
    platforms: ["web"],
    categories: ["Research", "Automation", "Pinterest"],
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
    pricing: "freemium",
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
    productImage: realAsset("iscale-merch-watchlist.png"),
    logoUrl: realAsset("iscale-merch-icon-128.png"),
    techStack: ["Chrome Extension", "Amazon Merch", "Next.js"],
    pricing: "freemium",
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
    pricing: "freemium",
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
    pricing: "freemium",
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
    productImage: thumbnail("iscale-images"),
    logoUrl: thumbnail("iscale-images"),
    techStack: ["Image Generation", "Automation", "Asset Pipeline"],
    pricing: "freemium",
    platforms: ["web"],
    categories: ["Images", "Automation", "Design"],
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
    pricing: "freemium",
    platforms: ["web"],
    categories: ["Keywords", "Compliance", "Research"],
    popularity: 88,
  },
  {
    name: "Data Research",
    slug: "data-research",
    description:
      "Data Research is the research workbench behind iScaleLabs data products: collection plans, source maps, evaluation notes, and structured research missions.",
    websiteUrl: listingUrl("data-research"),
    productImage: thumbnail("data-research"),
    logoUrl: thumbnail("data-research"),
    techStack: ["Research Ops", "Data", "Analysis"],
    pricing: "free",
    platforms: ["web"],
    categories: ["Research", "Data", "Operations"],
    popularity: 82,
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
    pricing: "freemium",
    platforms: ["web"],
    categories: ["Design", "Assets", "Workflow"],
    popularity: 80,
  },
  {
    name: "iScale Builders",
    slug: "iscale-builders",
    description:
      "iScale Builders is the public app showcase and community-facing builder directory for the iScaleLabs ecosystem: a place to surface the tools, workflows, and products being built.",
    websiteUrl: "https://iscalebuilders.com",
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
