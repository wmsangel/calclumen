import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo/site";

export const runtime = "edge";

// Branded Open Graph / Twitter card image, rendered on demand.
// Usage: /api/og?title=Loan%20Calculator&subtitle=Monthly%20payment
export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? SITE_NAME).slice(0, 90);
  const subtitle = (searchParams.get("subtitle") ?? "").slice(0, 120);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f6f5f3",
          padding: "70px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "#5b63e6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M12 1.6c.6 6.8 3.6 9.8 10.4 10.4C15.6 12.6 12.6 15.6 12 22.4 11.4 15.6 8.4 12.6 1.6 12 8.4 11.4 11.4 8.4 12 1.6Z" />
            </svg>
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, color: "#20201e" }}>
            {SITE_NAME}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              color: "#20201e",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div style={{ marginTop: 22, fontSize: 34, color: "#5f5b52" }}>
              {subtitle}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 8, borderRadius: 4, background: "#5b63e6" }} />
          <div style={{ fontSize: 26, color: "#5f5b52" }}>
            Free online calculators
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // Deterministic per (title, subtitle) — let the CDN cache each card so it
      // isn't re-rendered on every social/crawler fetch (cuts function invocations).
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
  );
}
