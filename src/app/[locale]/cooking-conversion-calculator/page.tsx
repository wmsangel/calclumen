import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { CookingConversionCalculator } from "@/components/calculators/cooking-conversion-calculator";

const SLUG = "cooking-conversion-calculator";

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
    "This cooking conversion calculator turns one kitchen measure into another — teaspoons, tablespoons, fluid ounces, cups, millilitres, litres, pints and quarts. Type an amount, choose the units, and the converted quantity appears immediately, so you can follow any recipe without hunting for a conversion chart.",
    "All units are converted through millilitres, so the results stay consistent no matter which pair you pick. This is volume-based conversion: a cup of flour and a cup of water take up the same space but weigh different amounts, so use a weight scale when a recipe lists grams for dry ingredients.",
  ],
  steps: [
    "Enter the amount you want to convert.",
    "Pick the unit it is currently in under \"From\".",
    "Pick the unit you want the result in under \"To\".",
    "Read the converted amount, plus a quick table in common kitchen units.",
  ],
  faq: [
    {
      q: "How many millilitres are in a cup?",
      a: "This calculator uses the US legal cup of about 236.588 millilitres. Note that a metric cup is 250 millilitres and a UK cup can differ, so check which system your recipe uses.",
    },
    {
      q: "How many teaspoons are in a tablespoon?",
      a: "One tablespoon equals three teaspoons. In millilitres that is roughly 14.79 ml for a tablespoon and 4.93 ml for a teaspoon, which is why three teaspoons make up one tablespoon.",
    },
    {
      q: "Can I use this for dry ingredients?",
      a: "It converts by volume, which works well for liquids and for volume-based recipes. For dry ingredients measured by weight, such as grams of flour or sugar, a kitchen scale gives more accurate results because density varies.",
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
      <CookingConversionCalculator />
    </CalcShell>
  );
}
