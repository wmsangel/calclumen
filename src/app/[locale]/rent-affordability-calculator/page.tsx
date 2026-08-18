import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { RentAffordabilityCalculator } from "@/components/calculators/rent-affordability";

const SLUG = "rent-affordability-calculator";

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
    "This rent affordability calculator turns your gross monthly income into a sensible rent range. It follows the widely used 30% rule: as a rough guideline, no more than 30% of your gross (pre-tax) monthly income should go toward rent. Enter your income to see a recommended maximum along with a more comfortable target and an upper stretch limit.",
    "The 30% rule is a starting point, not a hard cap. Spending less — closer to 25% — leaves more room for saving, debt payments and other bills, while going up to 35% may be workable in expensive cities but leaves a thinner cushion. Landlords often expect your income to be around three times the rent, which lines up with the same 30% guideline.",
  ],
  steps: [
    "Enter your gross monthly income before tax and choose your currency.",
    "Read the recommended maximum rent, set at 30% of your income.",
    "Compare the comfortable figure at 25% for more breathing room.",
    "Use the stretch figure at 35% as an upper limit, not a target.",
  ],
  faq: [
    {
      q: "What is the 30% rule for rent?",
      a: "It is a common budgeting guideline suggesting you spend no more than 30% of your gross monthly income on rent. On a $5,000 monthly income that works out to about $1,500 in rent.",
    },
    {
      q: "Should I use gross or net income?",
      a: "The 30% rule is traditionally based on gross (pre-tax) income, and that is what landlords usually check. If you prefer a more cautious budget, apply the same percentages to your take-home pay instead.",
    },
    {
      q: "Is it ever okay to spend more than 30%?",
      a: "Yes. In high-cost cities many renters spend 35% or more. It can be fine if you have low other debts and stable income, but it leaves less room for savings and unexpected costs.",
    },
  ],
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
      <RentAffordabilityCalculator />
    </CalcShell>
  );
}
