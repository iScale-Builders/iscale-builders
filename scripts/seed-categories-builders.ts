import { randomUUID } from "crypto"

import { db } from "@/drizzle/db"
import { category } from "@/drizzle/db/schema"

const BUILDER_CATEGORIES = [
  "AI Tools",
  "Automation",
  "Content",
  "Design",
  "E-commerce",
  "Marketing",
  "Niche Research",
  "Operations",
  "Productivity",
  "Sales",
  "SEO",
  "Workflows",
]

const seedBuilderCategories = async () => {
  const existing = await db.query.category.findMany()
  const existingNames = new Set(existing.map((c) => c.name))

  const missing = BUILDER_CATEGORIES.filter((name) => !existingNames.has(name)).map((name) => ({
    id: randomUUID(),
    name,
  }))

  if (missing.length === 0) {
    console.log("All builder categories already exist.")
    return
  }

  await db.insert(category).values(missing)
  console.log(
    `Inserted ${missing.length} builder category row(s): ${missing.map((m) => m.name).join(", ")}`,
  )
}

seedBuilderCategories()
  .then(() => {
    console.log("Builder category initialization complete.")
  })
  .catch((error) => {
    console.error("Builder category initialization failed:", error)
    process.exit(1)
  })
