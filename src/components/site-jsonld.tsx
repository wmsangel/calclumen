import type { Locale } from "@/lib/i18n/config";
import { absUrl, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/seo/site";

/** Organization + WebSite (with Sitelinks Searchbox) structured data for the home page. */
export function SiteJsonLd({ locale }: { locale: Locale }) {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon-512.png`,
      description: SITE_TAGLINE,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_TAGLINE,
      inLanguage: "en",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${absUrl(locale, "search")}?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
