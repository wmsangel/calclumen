// Cluster pages returned to the index (treatment step 3+5, 2026-11-28).
// Only URLs with real demand — Bing >=20 impressions/28d or a Google impression in
// Oct 2026 — are index,follow + in the sitemap; the rest of each cluster stays
// noindex,follow. List frozen in research/index-core-2026-11-16.md. Success test
// 2027-01-05: Google impressions on these URLs, otherwise the clusters are closed.
export type CoreCluster = "units" | "data" | "combinations";

export const CLUSTER_CORE: Record<CoreCluster, string[]> = {
  units: [
    "120-sqm-to-sqft",
    "14-inches-to-mm",
    "148-cm-to-inches",
    "191-cm-to-inches",
    "22-fahrenheit-to-celsius",
    "35-celsius-to-fahrenheit",
    "35-kg-to-lbs",
    "45-celsius-to-fahrenheit",
    "49-lbs-to-kg",
    "50-kg-to-lbs",
    "58-km-to-miles",
    "61-meters-to-yards",
    "67-miles-to-km",
    "68-inches-to-cm",
    "69-miles-to-km",
    "7-miles-to-km",
    "75-miles-to-km",
    "78-lbs-to-kg",
    "82-inches-to-cm",
    "83-kg-to-lbs",
    "95-meters-to-feet",
  ],
  data: [
    "16-tb-to-gb",
    "20-gb-to-mb",
    "2000-kb-to-mb",
    "250-gb-to-mb",
    "32-gb-to-mb",
    "5-tb-to-gb",
    "512-mb-to-kb",
    "64-gb-to-mb",
    "7-gb-to-mb",
    "9-gb-to-mb",
  ],
  combinations: [
    "10-choose-10",
    "10-choose-2",
    "10-choose-5",
    "10-choose-7",
    "11-choose-2",
    "11-choose-3",
    "11-choose-6",
    "11-choose-8",
    "12-choose-1",
    "13-choose-5",
    "15-choose-5",
    "4-choose-2",
    "4-choose-3",
    "5-choose-2",
    "5-choose-4",
    "5-choose-5",
    "6-choose-2",
    "6-choose-3",
    "7-choose-3",
    "8-choose-4",
    "9-choose-0",
    "9-choose-1",
    "9-choose-4",
    "9-choose-5",
    "9-choose-6",
    "9-choose-8",
  ],
};

export function isCoreCluster(cluster: CoreCluster, slug: string): boolean {
  return CLUSTER_CORE[cluster].includes(slug);
}

/** robots metadata: indexable only for the allowlist. */
export function clusterRobots(cluster: CoreCluster, slug: string) {
  return isCoreCluster(cluster, slug)
    ? { index: true, follow: true }
    : { index: false, follow: true };
}

/** Other allowlisted pages of the same cluster (crawlable "next lookups"). */
export function coreSiblings(cluster: CoreCluster, slug: string, limit = 8): string[] {
  return CLUSTER_CORE[cluster].filter((s) => s !== slug).slice(0, limit);
}
