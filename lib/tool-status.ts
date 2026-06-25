export function toolStatusLabel(status: string): "Testing" | "Available" {
  // Launch scheduling is retired — scheduled posts are live in the exchange.
  if (status === "ongoing") return "Testing"
  return "Available"
}
