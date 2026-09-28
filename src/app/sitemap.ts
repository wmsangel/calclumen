import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { calculators, categories } from "@/lib/calculators/registry";
import { absUrl } from "@/lib/seo/site";
import { GUIDES } from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  // Build-time date, used as lastmod for pages we actively edit (home,
  // hubs, calculators, guides). The static programmatic pages below omit
  // lastmod on purpose — they don't change, so a real "unknown" beats a
  // misleading "changed today" (which makes engines distrust lastmod).
  const lastModified = new Date();

  for (const locale of locales) {
    // Home
    entries.push({
      url: absUrl(locale),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    });

    // Category hubs
    for (const cat of categories) {
      entries.push({
        url: absUrl(locale, cat.slug),
        lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    // Guides
    entries.push({
      url: absUrl(locale, "guides"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    });
    for (const g of GUIDES) {
      entries.push({
        url: absUrl(locale, `guides/${g.slug}`),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }

    // Info / legal pages
    for (const p of ["about", "contact", "privacy", "cookies", "terms"]) {
      entries.push({
        url: absUrl(locale, p),
        changeFrequency: "yearly",
        priority: 0.2,
      });
    }

    // Support / donate page
    entries.push({
      url: absUrl(locale, "support"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    });

    // Calculator pages
    for (const calc of calculators) {
      entries.push({
        url: absUrl(locale, calc.slug),
        lastModified,
        changeFrequency: "monthly",
        priority: calc.popular ? 0.9 : 0.8,
      });
    }

    // Note: ALL thin templated clusters are intentionally noindex and kept out
    // of the sitemap — the math clusters (factors, gcf-lcm, multiples, is-prime,
    // simplify, decimal-to-fraction, fraction-to-decimal, percent,
    // number-in-words) since 2026-09-17, and units, roman-numerals, data and
    // combinations added 2026-09-28 after a domain-wide Google quality
    // demotion (159k→~2 impressions/day). The site now submits only its ~150
    // substantive pages (calculators, guides, hubs). All thin pages stay
    // reachable for users and via internal links.
  }

  return entries;
}
