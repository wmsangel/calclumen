import type { Metadata } from "next";
import Link from "next/link";
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
    path: "disclaimer",
    title: `Disclaimer — ${SITE_NAME} Results Are Estimates`,
    description: `${SITE_NAME} calculators give estimates for general information. They are not financial, tax, legal or medical advice; here is what that means and when to check with a professional.`,
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
      <h1 className="display text-3xl sm:text-4xl">Disclaimer</h1>
      <p className="text-[var(--ink-soft)] text-sm mt-2">Last updated: November 14, 2026</p>

      <p className="text-[var(--ink-soft)] leading-relaxed mt-6">
        {SITE_NAME} calculators are tools for general information and education.
        They apply published formulas and official figures to the numbers you
        type in, and they are only as accurate as those inputs and the stated
        assumptions. The results are estimates, not quotes, filings or diagnoses.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Not financial or investment advice</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        Loan, mortgage, savings, retirement and investment calculators model a
        simplified version of the real product. A lender&rsquo;s actual payment,
        rate, fees and amortization can differ; investment returns are not
        guaranteed and past performance does not predict the future. Nothing on
        this site is a recommendation to buy, sell or hold any financial product.
        Talk to a licensed financial adviser or your lender before making a
        decision.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Not tax advice</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        Tax calculators use the federal (and where stated, state or UK) rates,
        limits and thresholds for the tax year named on the page, and ignore many
        credits, deductions, phase-outs and local rules that may apply to you.
        They estimate withholding or liability for planning only. Your return,
        or a qualified tax professional, is the authority on what you owe.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Not medical advice</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        BMI, calorie, body-fat, heart-rate, pregnancy and similar calculators use
        population-level formulas that cannot account for your individual health,
        medical history or medication. They are not a diagnosis and should not
        replace a consultation with a doctor or other qualified health
        professional. If you are unwell, seek medical care.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Not legal or professional advice</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        Construction, DIY and business calculators give planning quantities and
        indicative figures. Building codes, material specifications and
        accounting rules vary by place and project; check them with a qualified
        contractor, engineer or accountant before relying on a result.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Accuracy and liability</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        We test every calculator and keep its figures current as described in our{" "}
        <Link href={`/${locale}/editorial-policy`} className="prose-link">
          editorial policy
        </Link>
        , but we cannot guarantee that any result is complete, correct or
        suitable for your situation. To the fullest extent permitted by law,{" "}
        {SITE_NAME} accepts no liability for loss or damage arising from use of
        the site. Our{" "}
        <Link href={`/${locale}/terms`} className="prose-link">
          terms of use
        </Link>{" "}
        apply. Found an error? Please{" "}
        <Link href={`/${locale}/contact`} className="prose-link">
          tell us
        </Link>
        .
      </p>
    </div>
  );
}
