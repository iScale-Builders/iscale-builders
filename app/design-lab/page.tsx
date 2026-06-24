import type { Metadata } from "next"

import { OrbitalFoundryClient } from "./orbital-foundry-client"

export const metadata: Metadata = {
  title: "Orbital AI Foundry",
  description: "A future-facing interface direction for iScaleXchange.",
  alternates: { canonical: "/design-lab" },
}

export default function DesignLabPage() {
  return <OrbitalFoundryClient />
}
