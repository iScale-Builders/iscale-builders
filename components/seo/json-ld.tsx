/**
 * Renders a JSON-LD structured-data block.
 *
 * Accepts a single schema object or an array of them. Safe to use in server
 * components; the payload is serialized at render time.
 */

type JsonLdData = Record<string, unknown> | Record<string, unknown>[]

export function JsonLd({ data }: { data: JsonLdData }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c")

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
