import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { calculators, categories } from "@/lib/calculators/registry";
import { CURRENCIES } from "@/lib/format";
import { absUrl } from "@/lib/seo/site";
import { PERCENT_PAGES } from "@/lib/programmatic/percent";
import { GUIDES } from "@/lib/guides";

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

    // Programmatic: percentage long-tail pages
    for (const p of PERCENT_PAGES) {
      entries.push({
        url: absUrl(locale, `${p.a}-percent-of-${p.b}`),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }

    // Programmatic: currency conversion pages (a subset of common pairs)
    for (const from of CURRENCIES) {
      for (const to of CURRENCIES) {
        if (from === to) continue;
        entries.push({
          url: absUrl(locale, `convert/${from.toLowerCase()}-to-${to.toLowerCase()}`),
          changeFrequency: "daily",
          priority: 0.4,
        });
      }
    }
  }

  return entries;
}
