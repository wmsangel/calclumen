import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { calculators, categories } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { absUrl, SITE_NAME, SITE_URL } from "@/lib/seo/site";
import { AUTHOR } from "@/lib/seo/author";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({
    locale,
    path: "about",
    title: `About ${SITE_NAME}`,
    description: `What ${SITE_NAME} is, how our calculators work, and how we keep them accurate.`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${absUrl(locale, "about")}#${AUTHOR.id}`,
    name: AUTHOR.name,
    jobTitle: AUTHOR.role,
    worksFor: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    address: { "@type": "PostalAddress", addressLocality: "Bishkek", addressCountry: "KG" },
    url: absUrl(locale, "about"),
    sameAs: [AUTHOR.github],
    knowsAbout: ["web development", "financial calculators", "unit conversion", "search engine optimization"],
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <h1 className="display text-3xl sm:text-4xl">About {SITE_NAME}</h1>
      <p className="mt-4 text-lg text-[var(--ink-soft)] leading-relaxed">
        {SITE_NAME} is a free collection of {calculators.length} calculators and
        converters for money, health, dates, math and everyday conversions — no
        signup, no clutter, just a clear answer the moment you type.
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-2">What we do</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        Every tool lives on its own page and does one job well — from a mortgage
        payment or compound-interest projection to BMI, a due date, or a unit
        conversion. Each page explains the formula in plain English and answers
        the questions people actually ask, so you understand the result and not
        just the number.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/${locale}/${cat.slug}`}
            className="chip"
          >
            {cat.title}
          </Link>
        ))}
      </div>

      <h2 id={AUTHOR.id} className="text-xl font-semibold mt-10 mb-2">Who makes {SITE_NAME}</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        {SITE_NAME} is built and maintained by <strong>{AUTHOR.name}</strong>, a
        software developer based in {AUTHOR.location}. Igor has been building web
        tools since 2010 and has published measurement, finance and productivity
        utilities used by people in more than 100 countries. He writes the
        formulas, codes the calculators, writes the automated tests and reviews
        every page before it goes live; there is no content farm and no AI-written
        filler behind the site. You can find his open-source work on{" "}
        <a href={AUTHOR.github} rel="noopener me" target="_blank" className="prose-link">
          GitHub
        </a>
        .
      </p>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        Igor is not a licensed financial adviser, tax preparer or physician, and{" "}
        {SITE_NAME} does not claim to be. The site&rsquo;s job is to apply
        published formulas and official figures correctly and show you exactly
        how — see our{" "}
        <Link href={`/${locale}/editorial-policy`} className="prose-link">
          editorial policy
        </Link>{" "}
        and{" "}
        <Link href={`/${locale}/disclaimer`} className="prose-link">
          disclaimer
        </Link>
        .
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-2">How we keep it accurate</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        Our calculators use established, published formulas — standard loan
        amortization, the Mifflin-St Jeor equation for calories, the US Navy
        method for body fat, Naegele&rsquo;s rule for due dates, and so on. We
        show the method on each page so you can check the math yourself. When a
        tool relies on a reference table (tax rates, unit factors, indicative
        currency rates), we label it clearly and note when it was last updated.
        Every calculator carries the date its page, logic or figures last
        changed, taken from our version history, and links the primary sources
        it relies on. Each formula lives in a separate module with automated
        tests that run before every release.
      </p>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        That said, results are estimates for general information only and are not
        professional financial, medical, tax or legal advice. For decisions that
        matter, please check with a qualified professional.
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-2">Privacy first</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        {SITE_NAME} runs entirely in your browser — you don&rsquo;t need an
        account, and your inputs never leave your device. Favorites and
        preferences are stored locally on your device, not on our servers. See
        our{" "}
        <Link href={`/${locale}/privacy`} className="prose-link">
          privacy policy
        </Link>{" "}
        for the details.
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-2">Get in touch</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        Spotted a mistake, or want a calculator we don&rsquo;t have yet? We read
        every message — head to our{" "}
        <Link href={`/${locale}/contact`} className="prose-link">
          contact page
        </Link>
        .
      </p>
    </div>
  );
}
