import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { absUrl, SITE_NAME, SITE_URL } from "./site";

interface PageMetaArgs {
  locale: Locale;
  /** Path after the locale, no leading slash. "" for the home page. */
  path?: string;
  title: string;
  description: string;
  keywords?: string[];
}

/** Build consistent metadata (canonical, OG, Twitter, social image) for a page. */
export function pageMetadata({
  locale,
  path = "",
  title,
  description,
  keywords,
}: PageMetaArgs): Metadata {
  const url = absUrl(locale, path);
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(
    title,
  )}&subtitle=${encodeURIComponent(description.slice(0, 110))}`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
