import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CookieConsent } from "@/components/cookie-consent";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Content is static and only changes on deploy (which invalidates the cache),
// so serve the prerendered pages from the CDN for a long window instead of
// re-reading the prerender store every ~5 min. This is the main lever on
// Vercel ISR Reads / Fast Origin Transfer. Applies to the whole [locale] tree.
export const revalidate = 604800; // 7 days

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader locale={locale} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter locale={locale} />
      <CookieConsent locale={locale} />
    </>
  );
}
