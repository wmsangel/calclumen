import { defaultLocale, type Locale } from "@/lib/i18n/config";

// ── Brand / domain ───────────────────────────────────────────────
// TODO: set the final .com here once the domain is bought. Everything
// (canonical URLs, sitemap, robots, JSON-LD) reads from these two.
export const SITE_NAME = "CalcLumen";
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://calclumen.com"
).replace(/\/$/, "");

export const SITE_TAGLINE = "Fast, free calculators for money, health, and everyday math.";

/** Absolute URL for a locale + optional path (no leading slash on `path`). */
export function absUrl(locale: Locale = defaultLocale, path = ""): string {
  const clean = path.replace(/^\/+/, "");
  return `${SITE_URL}/${locale}${clean ? `/${clean}` : ""}`;
}
