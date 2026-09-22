import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // Allow /api/og explicitly (more specific than the /api/ block) so
        // social crawlers can fetch the OG image; keep the rest of /api hidden.
        allow: ["/", "/api/og"],
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
