export function toolStatusLabel(
  status: string,
  websiteUrl?: string | null,
): "Coming soon" | "Testing" | "Available" {
  if (websiteUrl === null || websiteUrl === "") return "Coming soon"

  // Launch scheduling is retired — scheduled posts are live in the exchange.
  if (status === "ongoing") return "Testing"
  return "Available"
}
