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
    path: "privacy",
    title: `Privacy Policy — ${SITE_NAME}`,
    description: `How ${SITE_NAME} handles your data: what we collect, how advertising and analytics cookies work, and the choices you have.`,
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
      <h1 className="display text-3xl sm:text-4xl">Privacy Policy</h1>
      <p className="text-[var(--ink-soft)] text-sm mt-2">
        Last updated: August 2026
      </p>

      <p className="text-[var(--ink-soft)] leading-relaxed mt-6">
        This Privacy Policy explains how {SITE_NAME} (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;) handles information when you use our calculators. We
        built {SITE_NAME} to be usable without accounts or sign-ups, so we ask
        for as little personal information as possible.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">What we collect</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        You do not need to create an account or give us any personal details to
        use our calculators. The values you type into a calculator are processed
        in your browser to produce a result and are not sent to us or stored on
        our servers.
      </p>
      <ul className="text-[var(--ink-soft)] leading-relaxed mt-3 list-disc pl-5 space-y-2">
        <li>
          <strong>Local device storage.</strong> To remember small preferences
          such as your saved or favorited calculators, we store data in your
          browser using <code>localStorage</code>. This data stays on your
          device and can be cleared at any time from your browser settings.
        </li>
        <li>
          <strong>Analytics.</strong> We may use privacy-conscious analytics to
          understand which pages are visited and how the site performs, so we can
          improve it. This is aggregate usage information and is not used to
          identify you personally.
        </li>
        <li>
          <strong>Server logs.</strong> Like most websites, our hosting provider
          may automatically record standard technical information such as
          IP address, browser type, and the pages requested, for security and
          reliability purposes.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        Third-party advertising
      </h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        {SITE_NAME} is supported by advertising. We use Google AdSense to display
        ads. Google and its partners use cookies and similar technologies to
        serve ads based on your prior visits to this and other websites. This
        allows Google to show you ads that may be more relevant to you.
      </p>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        Third-party vendors, including Google, use cookies to serve ads based on
        someone&rsquo;s past visits to our site. Google&rsquo;s use of
        advertising cookies enables it and its partners to serve ads to you based
        on your visit to {SITE_NAME} and/or other sites on the Internet.
      </p>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        {SITE_NAME} may also use Ezoic to serve and optimize advertising. Ezoic
        and its advertising partners may collect and process data, and use
        cookies and similar technologies, to personalize and measure ads. For
        details on the data Ezoic collects and the partners involved, see the{" "}
        <a
          href="https://www.ezoic.com/privacy-policy/"
          className="prose-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ezoic privacy policy
        </a>
        . The current list of Ezoic advertising partners and the categories of
        data they use is shown below:
      </p>
      <div className="text-[var(--ink-soft)] leading-relaxed mt-3 text-sm">
        {/* Ezoic auto-populates this with its vendor/data disclosure once the
            Ezoic script loads (NEXT_PUBLIC_EZOIC=1). Harmless when empty. */}
        <span id="ezoic-privacy-policy-embed"></span>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-2">Third-party analytics</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        Analytics providers we use may set their own cookies or use similar
        identifiers to measure traffic and usage trends. These providers process
        data according to their own privacy policies. We do not sell your
        personal information.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Your choices</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        You have several ways to control advertising and cookies:
      </p>
      <ul className="text-[var(--ink-soft)] leading-relaxed mt-3 list-disc pl-5 space-y-2">
        <li>
          You can opt out of personalized advertising by visiting{" "}
          <a
            href="https://www.google.com/settings/ads"
            className="prose-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </a>
          .
        </li>
        <li>
          You can opt out of personalized ads from many other vendors at{" "}
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
          You can block or delete cookies through your browser settings, and
          clear the local preferences we store at any time.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">Children&rsquo;s privacy</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        {SITE_NAME} is intended for a general audience and is not directed at
        children under 13. We do not knowingly collect personal information from
        children. If you believe a child has provided us with personal
        information, please contact us so we can remove it.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Changes to this policy</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        We may update this Privacy Policy from time to time. When we do, we will
        revise the &ldquo;Last updated&rdquo; date above. Continued use of the
        site after changes means you accept the revised policy.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Contact</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        If you have questions about this Privacy Policy, email us at{" "}
        <a href="mailto:info@calclumen.com" className="prose-link">
          info@calclumen.com
        </a>
        .
      </p>
    </div>
  );
}
