import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE_NAME } from "@/lib/seo/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({
    locale,
    path: "cookies",
    title: `Cookie Policy — ${SITE_NAME}`,
    description: `What cookies ${SITE_NAME} uses, the difference between essential, analytics, and advertising cookies, and how to manage them.`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="display text-3xl sm:text-4xl">Cookie Policy</h1>
      <p className="text-[var(--ink-soft)] text-sm mt-2">
        Last updated: August 2026
      </p>

      <p className="text-[var(--ink-soft)] leading-relaxed mt-6">
        This Cookie Policy explains how {SITE_NAME} uses cookies and similar
        technologies, and how you can control them. It should be read together
        with our Privacy Policy.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">What cookies are</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        Cookies are small text files that a website stores in your browser. They
        let a site remember information between visits, such as your preferences,
        and help site owners and advertisers understand how a site is used. Some
        technologies, like <code>localStorage</code>, do a similar job of storing
        data in your browser without being cookies in the strict sense.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        Categories of cookies we use
      </h2>
      <ul className="text-[var(--ink-soft)] leading-relaxed mt-3 list-disc pl-5 space-y-2">
        <li>
          <strong>Essential.</strong> These are needed for the site to function
          and to remember basic choices, such as whether you have responded to
          our cookie notice. The site cannot work properly without them.
        </li>
        <li>
          <strong>Analytics.</strong> These help us understand which pages are
          popular and how the site performs, so we can improve it. They collect
          aggregate usage information.
        </li>
        <li>
          <strong>Advertising.</strong> These are set by our advertising partner
          to display ads and, where permitted, to make them more relevant to you
          and to measure ad performance.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        What {SITE_NAME} stores itself
      </h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        {SITE_NAME} itself does not set advertising or tracking cookies. To
        remember small preferences such as your favorite calculators, we store a
        little data in your browser&rsquo;s <code>localStorage</code>. This is
        not a cookie, it never leaves your device, and it is not used to track
        you. You can clear it at any time from your browser settings.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        Google AdSense and analytics cookies
      </h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        We use Google AdSense to display ads. Google and its partners set
        cookies to serve and measure ads, and in some cases to personalize them
        based on your browsing. We may also use analytics services that set
        cookies or similar identifiers to measure traffic. These third parties
        process data under their own policies.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        How to manage or disable cookies
      </h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        You are in control of cookies. You can:
      </p>
      <ul className="text-[var(--ink-soft)] leading-relaxed mt-3 list-disc pl-5 space-y-2">
        <li>
          Change your choice on our cookie notice, or use your browser settings
          to block or delete cookies. All major browsers (Chrome, Firefox,
          Safari, Edge) let you manage cookies in their privacy settings.
        </li>
        <li>
          Opt out of personalized advertising through{" "}
          <a
            href="https://www.google.com/settings/ads"
            className="prose-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </a>{" "}
          and{" "}
          <a
            href="https://www.aboutads.info/choices/"
            className="prose-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            aboutads.info
          </a>
          .
        </li>
        <li>
          Note that blocking essential cookies may affect how parts of the site
          work.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">Consent</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        When you first visit {SITE_NAME}, we show a cookie notice so you can
        accept all cookies or reject non-essential ones. Your choice is
        remembered on your device. You can change it later by clearing your
        browser storage, which will make the notice appear again.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Contact</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        Questions about our use of cookies? Email us at{" "}
        <a href="mailto:info@calclumen.com" className="prose-link">
          info@calclumen.com
        </a>
        .
      </p>
    </div>
  );
}
