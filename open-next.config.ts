// OpenNext Cloudflare adapter config. Mirrors the proven costtrek setup.
// Incremental cache = Workers STATIC ASSETS: prerendered pages ship as assets
// (served free, no per-request KV cost) instead of being mass-written to KV.
// The site is effectively static — values are baked at build and we redeploy on
// changes — so a read-only cache (no on-the-fly revalidation) is the right fit.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  // Serve prerendered pages straight from the incremental cache before the
  // Next.js server boots — Googlebot measured 0.33–2.8 s TTFB on cache HITs
  // (crawl stats 483 ms avg, 2026-11-12); the network recipe (foundaday 14.11)
  // cut HTML time with the same flag.
  enableCacheInterception: true,
});
