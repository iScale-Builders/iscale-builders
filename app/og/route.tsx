import { ImageResponse } from "next/og"

export const runtime = "edge"

// Branded 1200x630 Open Graph image, driven by query params so any route can
// request a unique preview without a static asset:
//   /og?title=Best%20Etsy%20Tools&badge=Category&subtitle=12%20tools%20ranked
// No DB access here (keeps it edge-fast); callers pass the text they already have.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = (searchParams.get("title") || "iScaleBuilders").slice(0, 120)
  const subtitle = (searchParams.get("subtitle") || "").slice(0, 160)
  const badge = (searchParams.get("badge") || "").slice(0, 40)

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0b1120 0%, #111c33 60%, #0b1120 100%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "#22d3ee",
              color: "#0b1120",
              fontSize: "30px",
              fontWeight: 800,
            }}
          >
            iS
          </div>
          <div style={{ color: "#e2e8f0", fontSize: "30px", fontWeight: 700 }}>iScaleBuilders</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {badge ? (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: "8px 18px",
                borderRadius: "999px",
                border: "1px solid #22d3ee",
                color: "#22d3ee",
                fontSize: "24px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              {badge}
            </div>
          ) : null}
          <div
            style={{
              color: "#ffffff",
              fontSize: title.length > 50 ? "64px" : "80px",
              fontWeight: 800,
              lineHeight: 1.05,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div style={{ color: "#94a3b8", fontSize: "34px", lineHeight: 1.3 }}>{subtitle}</div>
          ) : null}
        </div>

        <div style={{ color: "#64748b", fontSize: "26px" }}>iscalebuilders.com</div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
