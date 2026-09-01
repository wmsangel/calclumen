import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { calculators, categories } from "@/lib/calculators/registry";
import { absUrl } from "@/lib/seo/site";
import { GUIDES } from "@/lib/guides";
import { UNIT_PAGES } from "@/lib/programmatic/units";
import { ROMAN_PAGES } from "@/lib/programmatic/roman";
import { SIZE_PAGES } from "@/lib/programmatic/datasize";
import { CHOOSE_PAGES } from "@/lib/programmatic/combinations";
import { GCFLCM_PAGES } from "@/lib/programmatic/gcflcm";
import { FACTOR_PAGES } from "@/lib/programmatic/factors";

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

    // Calculator pages
    for (const calc of calculators) {
      entries.push({
        url: absUrl(locale, calc.slug),
        lastModified,
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

    // Programmatic data-storage conversion pages (/data/…) — indexable.
    for (const p of SIZE_PAGES) {
      entries.push({
        url: absUrl(locale, `data/${p.slug}`),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }

    // Programmatic "n choose k" combination pages — indexable.
    for (const p of CHOOSE_PAGES) {
      entries.push({
        url: absUrl(locale, `combinations/${p.slug}`),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }

    // Programmatic "Factors of N" pages — indexable.
    for (const p of FACTOR_PAGES) {
      entries.push({
        url: absUrl(locale, `factors/${p.slug}`),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }

    // Programmatic "GCF and LCM of A and B" pages — indexable.
    for (const p of GCFLCM_PAGES) {
      entries.push({
        url: absUrl(locale, `gcf-lcm/${p.slug}`),
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
