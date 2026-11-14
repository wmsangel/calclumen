import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { IncomeTaxCalculator } from "@/components/calculators/income-tax";

const SLUG = "income-tax-calculator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const calc = getCalc(SLUG)!;
  return pageMetadata({
    locale,
    path: SLUG,
    title: calc.heading,
    description: calc.description,
    keywords: calc.keywords,
  });
}

const content: CalcContent = {
  intro: [
    "This income tax calculator estimates your U.S. federal income tax for the 2026 tax year. Enter your annual income and choose your filing status, and it applies the standard deduction and the progressive federal tax brackets to work out what you owe.",
    "Because the tax system is progressive, only the income that falls inside each bracket is taxed at that bracket's rate. The calculator shows both your effective rate — the share of your total income paid in tax — and your marginal rate, which is the rate on your next dollar of income.",
  ],
  steps: [
    "Enter your annual income before tax.",
    "Choose your filing status: Single or Married filing jointly.",
    "The standard deduction for your status is subtracted automatically.",
    "Read your estimated federal tax, effective rate, marginal rate and after-tax income.",
  ],
  methodology: [
    "Taxable income is your gross income minus the 2026 standard deduction ($16,100 single, $32,200 married filing jointly). Tax is then applied progressively through the seven federal brackets for your filing status — 10%, 12%, 22%, 24%, 32%, 35% and 37% — so only the income inside each band is taxed at that band's rate. The effective rate is total tax divided by gross income.",
    "Figures are the inflation-adjusted amounts the IRS published for tax year 2026 (returns filed in 2027). The calculator ignores itemized deductions, the extra deduction for seniors, credits such as the Child Tax Credit, the Qualified Business Income deduction, capital-gains rates, AMT, FICA and all state and local taxes — any of which can move your actual bill substantially.",
  ],
  sources: [
    { label: "IRS Rev. Proc. 2025-32 — Tax year 2026 inflation adjustments", url: "https://www.irs.gov/pub/irs-drop/rp-25-32.pdf" },
    { label: "IRS Topic 551 — Standard deduction", url: "https://www.irs.gov/taxtopics/tc551" },
    { label: "IRS — Federal income tax rates and brackets", url: "https://www.irs.gov/filing/federal-income-tax-rates-and-brackets" },
  ],
  faq: [
    {
      q: "Which tax year does this use?",
      a: "It uses the 2026 federal tax brackets and standard deductions: $16,100 for Single filers and $32,200 for Married filing jointly.",
    },
    {
      q: "What is the difference between effective and marginal rate?",
      a: "The marginal rate is the tax rate on your last dollar of income — the bracket your taxable income lands in. The effective rate is your total tax divided by your total income, which is always lower because the lower brackets are taxed at lower rates.",
    },
    {
      q: "Does this include state tax or credits?",
      a: "No. This is a federal-only estimate for tax year 2026. It does not include state or local income tax, payroll taxes, or credits and adjustments such as the Child Tax Credit, so your actual bill may differ.",
    },
  ],
  extra: (
    <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
      Note: this is a federal-only estimate for the 2026 tax year using the
      standard deduction and statutory brackets. It excludes tax credits, state
      and local taxes, and other adjustments.
    </p>
  ),
};

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <CalcShell locale={locale} slug={SLUG} content={content}>
      <IncomeTaxCalculator />
    </CalcShell>
  );
}
