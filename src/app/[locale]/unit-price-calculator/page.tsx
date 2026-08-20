import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { UnitPriceCalculator } from "@/components/calculators/unit-price";

const SLUG = "unit-price-calculator";

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
    "This unit price calculator tells you which product is the better deal by comparing price per unit — per gram, ounce, litre, sheet, or whatever unit you choose. Enter the price and size of each option and it divides one by the other, ranks them, and marks the cheapest per unit so the bigger box isn't mistaken for the better value.",
    "The maths is simple but easy to get wrong in a shop: a larger pack often looks cheaper because the total price is higher for more product, yet its price per unit can be worse. Comparing per-unit costs is the only fair way to judge, and this tool also shows how much you save versus the most expensive option.",
  ],
  steps: [
    "Set the unit you're comparing in (g, oz, ml, sheets…) and your currency.",
    "Enter each product's price and its size in that unit.",
    "Add more items with the button to compare three or more at once.",
    "Read the per-unit price for each and see which is marked Best value.",
    "Check the savings figure to see how much the cheapest beats the priciest.",
  ],
  faq: [
    {
      q: "How is unit price calculated?",
      a: "Divide the total price by the size (quantity). A 500 g pack at 4.50 is 4.50 ÷ 500 = 0.009 per gram; a 900 g pack at 7.20 is 0.008 per gram — so the larger pack is the better deal here. The calculator does this for every item and compares them.",
    },
    {
      q: "Do all items need the same unit?",
      a: "Yes. Enter every size in the same unit so the comparison is fair. If one product is listed in kilograms and another in grams, convert them to a common unit first (1 kg = 1000 g), then enter both in that unit.",
    },
    {
      q: "Is the biggest size always the cheapest per unit?",
      a: "Usually, but not always. Retailers sometimes price mid-size or promotional packs lower per unit than the largest one. That's exactly why checking price per unit matters — the 'family size' isn't guaranteed to be the best value.",
    },
    {
      q: "Can I compare more than two products?",
      a: "Yes. Use Add item to line up as many options as you like. The calculator ranks them all and highlights the lowest price per unit, with the savings shown against the most expensive option in the list.",
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
      <UnitPriceCalculator />
    </CalcShell>
  );
}
