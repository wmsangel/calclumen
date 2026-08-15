import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { TipCalculator } from "@/components/calculators/tip";

const SLUG = "tip-calculator";

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
    "This tip calculator works out how much to leave as a gratuity and what the meal costs once the tip is added. Enter the bill amount, choose a tip percentage from the presets or type your own, and see the tip and grand total update instantly in your chosen currency.",
    "When you are eating out with friends, the calculator also splits the bill evenly across the whole table. Set the number of people and it divides both the total and the tip so everyone knows exactly what they owe, without any awkward mental arithmetic at the end of the meal.",
  ],
  steps: [
    "Enter the bill amount and pick your currency.",
    "Choose a tip percentage with the preset buttons, or type a custom percentage.",
    "Set how many people are splitting the bill.",
    "Read the tip amount, the total, and the per-person share.",
  ],
  faq: [
    {
      q: "What is a typical tip percentage in the US?",
      a: "In the United States, 15% to 20% of the bill is standard for table service at a restaurant, with 18% a common default. Many people leave 20% or more for excellent service, while quick counter service or takeout usually warrants little or no tip.",
    },
    {
      q: "Should I tip on the pre-tax or the total amount?",
      a: "Tipping on the pre-tax subtotal is perfectly acceptable and is what many people do, since the tax is not part of the service. Tipping on the post-tax total is also common and slightly more generous. This calculator applies the percentage to whatever bill amount you enter, so use the pre-tax figure if you prefer.",
    },
    {
      q: "How do I split a bill unevenly?",
      a: "This calculator divides the total evenly across everyone. If people ordered very different amounts, work out each person's own subtotal, apply the same tip percentage to each, and add their share of any tax. Splitting evenly is simplest for similar orders, while itemizing is fairer when the orders differ a lot.",
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
      <TipCalculator />
    </CalcShell>
  );
}
