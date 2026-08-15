import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { MarginMarkupCalculator } from "@/components/calculators/margin-markup";

const SLUG = "margin-markup-calculator";

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
    "This margin and markup calculator works out the selling price, profit, profit margin and markup for a product from its cost. Margin and markup are often confused because they describe the same profit from two different angles: margin is profit as a percentage of the selling price, while markup is profit as a percentage of the cost.",
    "Start from whatever you know. Enter a selling price to see the resulting margin and markup, enter a target margin to find the price you need to charge, or enter a markup to price a product up from cost. Because margin uses price as the base and markup uses cost, a given markup always works out to a smaller margin percentage.",
  ],
  steps: [
    "Choose whether you know the selling price, a target margin or a target markup.",
    "Enter the unit cost and choose your currency.",
    "Enter the price, margin or markup depending on the mode you picked.",
    "Read the selling price, profit, margin percentage and markup percentage.",
  ],
  faq: [
    {
      q: "What is the difference between margin and markup?",
      a: "Markup is profit divided by cost, while margin is profit divided by the selling price. A 50% markup on a $40 cost gives a $60 price, which is only a 33.3% margin.",
    },
    {
      q: "How do I convert markup to margin?",
      a: "Margin = markup ÷ (1 + markup). For example a 50% markup converts to 0.5 ÷ 1.5 = 33.3% margin. This calculator does the conversion for you in every mode.",
    },
    {
      q: "Which should I use to set prices?",
      a: "Retailers usually think in margin because it maps directly to how much of each sale is profit, while markup is handy when you price up from a known cost. This tool shows both at once.",
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
      <MarginMarkupCalculator />
    </CalcShell>
  );
}
