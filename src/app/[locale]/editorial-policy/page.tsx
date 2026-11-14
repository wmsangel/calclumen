import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE_NAME } from "@/lib/seo/site";
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
    path: "editorial-policy",
    title: `Editorial Policy — How ${SITE_NAME} Checks Its Math`,
    description: `Who builds ${SITE_NAME}'s calculators, where the formulas and tax figures come from, how each tool is tested, when pages are updated and how we fix mistakes.`,
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
      <h1 className="display text-3xl sm:text-4xl">Editorial policy</h1>
      <p className="text-[var(--ink-soft)] text-sm mt-2">Last updated: November 14, 2026</p>

      <p className="text-[var(--ink-soft)] leading-relaxed mt-6">
        {SITE_NAME} publishes calculators, not opinions. A calculator is only
        useful if its math is right and its assumptions are visible, so this page
        sets out who builds the tools, where the numbers come from, how we test
        them and what happens when something is wrong.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Who writes and reviews the calculators</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        Every calculator on this site is designed, coded and reviewed by{" "}
        <Link href={`/${locale}/about#${AUTHOR.id}`} className="prose-link">
          {AUTHOR.name}
        </Link>
        , a software developer based in {AUTHOR.location} who has built financial
        and measurement tools for the web since 2010. We do not employ a staff of
        licensed financial, tax or medical professionals, and we say so plainly:
        our pages explain published formulas and official figures, they do not
        give individual advice. See the{" "}
        <Link href={`/${locale}/disclaimer`} className="prose-link">
          disclaimer
        </Link>
        .
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Where the formulas and figures come from</h2>
      <ul className="text-[var(--ink-soft)] leading-relaxed mt-3 list-disc pl-5 space-y-2">
        <li>
          <strong>Formulas</strong> are the standard, published ones: loan
          amortization, compound interest, the Mifflin-St Jeor equation, the US
          Navy body-fat method, Naegele&rsquo;s rule, and so on. Each calculator
          page has a &ldquo;How it works&rdquo; section that states the formula
          and what it does not model.
        </li>
        <li>
          <strong>Tax rates, limits and thresholds</strong> come from the primary
          source — IRS publications and revenue procedures, the Social Security
          Administration, HMRC and gov.uk — and the tax year is named on the page.
          We link the source next to the figure.
        </li>
        <li>
          <strong>Unit factors</strong> follow the International System of Units
          and NIST definitions; indicative currency rates are labelled as such and
          are not quotes.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">How each calculator is tested</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        The math behind a calculator lives in a separate module with automated
        tests that compare its output against hand-worked examples and published
        reference values (for example, an IRS worked example or a lender&rsquo;s
        amortization table). The whole suite runs before every release; a
        failing test blocks the deploy. We then open the page and check the
        default example by hand.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Dates and updates</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        The &ldquo;Updated&rdquo; date on a calculator is the date its page,
        logic or figures last changed — taken from our version history, not
        from the day the site was rebuilt. Tax-year figures are reviewed when the
        IRS and HMRC publish the next year&rsquo;s numbers (usually October to
        December) and the year shown on the page is changed at the same time.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Corrections</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        If you find a wrong result, a stale figure or a typo, please use the{" "}
        <Link href={`/${locale}/contact`} className="prose-link">
          contact page
        </Link>{" "}
        or the feedback button on any calculator. We reply to every report, fix
        confirmed errors in the next release (normally within a few days) and
        add a test so the same mistake cannot come back.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Advertising and independence</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        {SITE_NAME} is funded by display advertising and clearly labelled
        affiliate links. Advertisers never see, influence or sponsor a
        calculator&rsquo;s formula, defaults or results. How that works is
        described on our{" "}
        <Link href={`/${locale}/advertising`} className="prose-link">
          advertising disclosure
        </Link>{" "}
        page.
      </p>
    </div>
  );
}
