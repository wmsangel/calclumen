import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { calculators, categories } from "@/lib/calculators/registry";
import { absUrl } from "@/lib/seo/site";
import { GUIDES } from "@/lib/guides";
import { UNIT_PAGES } from "@/lib/programmatic/units";
import { ROMAN_PAGES } from "@/lib/programmatic/roman";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Home
    entries.push({ url: absUrl(locale), changeFrequency: "weekly", priority: 1 });

    // Category hubs
    for (const cat of categories) {
      entries.push({
        url: absUrl(locale, cat.slug),
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

    // Calculator pages
    for (const calc of calculators) {
      entries.push({
        url: absUrl(locale, calc.slug),
        changeFrequency: "monthly",
        priority: calc.popular ? 0.9 : 0.8,
      });
    }

    // Programmatic unit-conversion pages (/units/…) — indexable, so included.
    for (const p of UNIT_PAGES) {
      entries.push({
        url: absUrl(locale, `units/${p.slug}`),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }

    // Programmatic "N in Roman numerals" pages — indexable.
    for (const p of ROMAN_PAGES) {
      entries.push({
        url: absUrl(locale, `roman-numerals/${p.slug}`),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }

    // Note: the templated percent (/X-percent-of-Y) and currency
    // (/convert/…) pages are intentionally noindex, so they're kept out of
    // the sitemap. They stay reachable for users and internal links.
  }

  return entries;
}
