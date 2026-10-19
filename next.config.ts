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
    return AMAZON_GO_REDIRECTS.map(({ slug, url }) => ({
      source: `/go/${slug}`,
      destination: url,
      statusCode: 302,
      basePath: false as const,
    }));
  },
};

export default nextConfig;
