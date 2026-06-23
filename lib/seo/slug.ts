/**
 * Deterministic slug helpers.
 *
 * The `category` table has no slug column, so category landing pages derive a
 * stable slug from the category name. Keep this pure and reversible-by-matching:
 * resolve a slug back to a category by slugifying each category name and comparing.
 */

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumeric → hyphen
    .replace(/^-+|-+$/g, "") // trim hyphens
}
