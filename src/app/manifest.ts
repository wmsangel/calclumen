import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Free Online Calculators`,
    short_name: SITE_NAME,
    description:
      "Fast, free calculators for money, health, and everyday math. No signup.",
    start_url: "/en",
    scope: "/",
    display: "standalone",
    background_color: "#f6f5f3",
    theme_color: "#5b63e6",
    lang: "en",
    categories: ["utilities", "finance", "productivity", "education"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
