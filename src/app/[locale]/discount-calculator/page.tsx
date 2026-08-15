import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { DiscountCalculator } from "@/components/calculators/discount";

const SLUG = "discount-calculator";

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
    "This discount calculator shows the sale price after a percentage off, how much you save and the effective discount when two offers are stacked. Enter the original price and the discount to see what you actually pay, and optionally add a second discount and a sales tax rate for the final checkout figure.",
    "Stacked discounts are applied one after the other, not added together, so 25% off followed by another 10% off is not 35% off — the second discount only applies to the already-reduced price. The effective discount shows the true combined percentage, and the final price adds any sales tax to the discounted amount.",
  ],
  steps: [
    "Enter the original price and choose your currency.",
    "Enter the discount percentage.",
    "Optionally add a second stacked discount and a tax rate.",
    "Read the sale price, amount saved, effective discount and final price.",
  ],
  faq: [
    {
      q: "How do stacked discounts work?",
      a: "The discounts are applied in sequence. A 25% discount followed by a 10% discount leaves you paying 90% of 75%, which is 67.5% of the original — an effective discount of 32.5%, not 35%.",
    },
    {
      q: "What is the effective discount?",
      a: "The effective discount is the total percentage you saved compared with the original price, after any stacked discounts. It is the single number that best describes the deal.",
    },
    {
      q: "Is tax added before or after the discount?",
      a: "Sales tax is normally charged on the discounted price, so this calculator applies the discounts first and then adds tax to arrive at the final price you pay.",
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
      <DiscountCalculator />
    </CalcShell>
  );
}
