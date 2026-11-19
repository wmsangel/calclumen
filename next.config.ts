import type { NextConfig } from "next";
import { AMAZON_GO_REDIRECTS } from "./src/lib/amazon";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Amazon affiliate cloaking: /go/<slug> -> 302 -> tagged amazon.com URL.
  // Config redirects are free edge redirects (no serverless function). Paired
  // with Disallow:/go/ in robots.ts so crawlers stop hammering the raw tagged
  // links and inflating the Associates click count.
  async redirects() {
    // With ?src=<page-slug> the page label is forwarded as Amazon's ascsubtag
    // (sub-id per page, network rule 2026-11-16); without it, the plain redirect.
    return AMAZON_GO_REDIRECTS.flatMap(({ slug, url }) => [
      {
        source: `/go/${slug}`,
        has: [{ type: "query" as const, key: "src", value: "(?<src>[a-z0-9-]{1,64})" }],
        destination: `${url}&ascsubtag=calclumen-:src`,
        statusCode: 302,
        basePath: false as const,
      },
      {
        source: `/go/${slug}`,
        destination: url,
        statusCode: 302,
        basePath: false as const,
      },
    ]);
  },
};

export default nextConfig;
