export function toolStatusLabel(status: string): "Coming soon" | "Testing" | "Available" {
  if (status === "scheduled") return "Coming soon"
  if (status === "ongoing") return "Testing"
  return "Available"
}
