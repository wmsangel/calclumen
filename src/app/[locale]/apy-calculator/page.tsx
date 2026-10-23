import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { ApyCalculator } from "@/components/calculators/apy";

const SLUG = "apy-calculator";

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
    "This APY calculator converts a nominal interest rate into its annual percentage yield — the real yearly return once compounding is included. Enter the rate and how often it compounds, and optionally a balance and time, to see the effective APY, the interest earned and the ending balance.",
    "Banks quote a nominal rate (APR), but what you actually earn depends on how often interest is added to your balance. Daily or monthly compounding earns a little more than the nominal rate, so APY is the figure to compare savings accounts, CDs and money-market accounts by.",
  ],
  steps: [
    "Enter the nominal annual interest rate (the APR the bank quotes).",
    "Choose how often it compounds — daily, monthly, quarterly or annually.",
    "Optionally add a starting balance and a time in years to see the interest earned.",
    "Read the APY, your ending balance and the interest earned.",
  ],
  faq: [
    {
      q: "What is the difference between APR and APY?",
      a: "APR is the nominal yearly rate, before compounding. APY (annual percentage yield) includes compounding, so it's what you actually earn in a year. A 5% APR compounded monthly is about 5.12% APY. For savings, higher APY is better; compare accounts by APY, not APR.",
    },
    {
      q: "How is APY calculated?",
      a: "APY = (1 + r ÷ n)^n − 1, where r is the nominal annual rate as a decimal and n is the number of compounding periods per year. For 5% compounded daily, that's (1 + 0.05 ÷ 365)^365 − 1 ≈ 5.13%.",
    },
    {
      q: "Does more frequent compounding always mean more money?",
      a: "Yes, but with diminishing returns. Going from annual to monthly compounding adds noticeably to the yield; going from daily to continuous adds almost nothing. For a 5% rate the APY rises from 5.00% (annual) to only about 5.127% (continuous).",
    },
    {
      q: "Is APY the same as interest rate?",
      a: "Not quite. The interest rate (APR) is the base rate; APY is that rate after compounding over a year. They're equal only when interest compounds just once a year.",
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
      <ApyCalculator />
    </CalcShell>
  );
}
