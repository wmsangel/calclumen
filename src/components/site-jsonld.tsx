import type { Locale } from "@/lib/i18n/config";
import { calculators } from "@/lib/calculators/registry";
import { absUrl, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/seo/site";
import { AUTHOR } from "@/lib/seo/author";

/** Organization + WebSite (with Sitelinks Searchbox) structured data for the home page. */
export function SiteJsonLd({ locale }: { locale: Locale }) {
  const featured = calculators.filter((c) => c.popular).slice(0, 15);
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png`, width: 512, height: 512 },
      description: SITE_TAGLINE,
      foundingDate: "2026",
      founder: {
        "@type": "Person",
        "@id": `${absUrl(locale, "about")}#${AUTHOR.id}`,
        name: AUTHOR.name,
        jobTitle: AUTHOR.role,
        url: absUrl(locale, "about"),
        sameAs: [AUTHOR.github],
      },
      sameAs: [AUTHOR.github],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        url: absUrl(locale, "contact"),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_TAGLINE,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${absUrl(locale, "search")}?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Popular ${SITE_NAME} calculators`,
      itemListElement: featured.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.heading,
        url: absUrl(locale, c.slug),
      })),
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
