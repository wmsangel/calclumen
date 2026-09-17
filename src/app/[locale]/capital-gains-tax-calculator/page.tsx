import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { CapitalGainsCalculator } from "@/components/calculators/capital-gains";

const SLUG = "capital-gains-tax-calculator";

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
    "This capital gains tax calculator estimates the federal (and optional state) tax on profit from selling an investment such as stocks, a fund, crypto or property. Enter what you paid (your cost basis) and what you sold it for, choose whether you held the asset for more or less than a year, and the calculator applies the right 2025 tax rate for your filing status and income.",
    "The holding period matters enormously. A long-term gain — on an asset held more than one year — is taxed at the preferential 0%, 15% or 20% capital-gains rates. A short-term gain — held a year or less — is taxed as ordinary income at your marginal rate, which for most people is much higher. The calculator shows your gain, the tax, your after-tax profit and your effective rate so the difference is easy to see.",
  ],
  steps: [
    "Enter your purchase price (cost basis) and the sale price.",
    "Choose the holding period: long-term (over a year) or short-term.",
    "Pick your filing status and enter your annual taxable income.",
    "Optionally add your state tax rate, then read the federal tax, total tax and after-tax profit.",
  ],
  faq: [
    {
      q: "What's the difference between short-term and long-term capital gains?",
      a: "Long-term gains apply to assets you held for more than one year and are taxed at 0%, 15% or 20% depending on your income. Short-term gains apply to assets held for a year or less and are taxed at your ordinary income tax rate, which is usually higher — so holding just past the one-year mark can sharply cut the tax.",
    },
    {
      q: "How is my long-term capital-gains rate determined?",
      a: "It depends on your filing status and taxable income. For 2025, a single filer pays 0% on long-term gains while taxable income is under about $48,350, 15% up to about $533,400, and 20% above that. The brackets are higher for married-filing-jointly and head-of-household filers.",
    },
    {
      q: "Does this include state taxes?",
      a: "Only if you enter a state rate. Most states tax capital gains as ordinary income (some, like Florida and Texas, have no state income tax). Enter your state's rate to fold it into the total. The federal figure uses 2025 brackets and is an estimate, not tax advice.",
    },
    {
      q: "What if I sold at a loss?",
      a: "If your sale price is below your cost basis you have a capital loss and owe no capital-gains tax. Losses offset other capital gains, and up to $3,000 of net loss can offset ordinary income each year, with any remainder carried forward to future years.",
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
      <CapitalGainsCalculator />
    </CalcShell>
  );
}
