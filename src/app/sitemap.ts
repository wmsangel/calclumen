import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { calculators, categories } from "@/lib/calculators/registry";
import { absUrl } from "@/lib/seo/site";
import { GUIDES } from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  // Build-time date, used as lastmod ONLY for the pages that really change on
  // every release (home and category hubs gain new tools). Calculators, guides
  // and the support page omit lastmod: stamping all ~170 URLs "changed today"
  // on each deploy made every lastmod identical and meaningless, so Google
  // could not prioritise anything (GSC 12.11: sitemap read, 0 of 174 indexed
  // via sitemap). A real "unknown" beats a misleading "changed today".
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
      changeFrequency: "monthly",
      priority: 0.6,
    });
    for (const g of GUIDES) {
      entries.push({
        url: absUrl(locale, `guides/${g.slug}`),
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
      changeFrequency: "monthly",
      priority: 0.5,
    });

    // Calculator pages
    for (const calc of calculators) {
      entries.push({
        url: absUrl(locale, calc.slug),
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
