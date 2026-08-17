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
    "This income tax calculator estimates your U.S. federal income tax for the 2024 tax year. Enter your annual income and choose your filing status, and it applies the standard deduction and the progressive federal tax brackets to work out what you owe.",
    "Because the tax system is progressive, only the income that falls inside each bracket is taxed at that bracket's rate. The calculator shows both your effective rate — the share of your total income paid in tax — and your marginal rate, which is the rate on your next dollar of income.",
  ],
  steps: [
    "Enter your annual income before tax.",
    "Choose your filing status: Single or Married filing jointly.",
    "The standard deduction for your status is subtracted automatically.",
    "Read your estimated federal tax, effective rate, marginal rate and after-tax income.",
  ],
  faq: [
    {
      q: "Which tax year does this use?",
      a: "It uses the 2024 federal tax brackets and standard deductions: $14,600 for Single filers and $29,200 for Married filing jointly.",
    },
    {
      q: "What is the difference between effective and marginal rate?",
      a: "The marginal rate is the tax rate on your last dollar of income — the bracket your taxable income lands in. The effective rate is your total tax divided by your total income, which is always lower because the lower brackets are taxed at lower rates.",
    },
    {
      q: "Does this include state tax or credits?",
      a: "No. This is a federal-only estimate for tax year 2024. It does not include state or local income tax, payroll taxes, or credits and adjustments such as the Child Tax Credit, so your actual bill may differ.",
    },
  ],
  extra: (
    <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
      Note: this is a federal-only estimate for the 2024 tax year using the
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
