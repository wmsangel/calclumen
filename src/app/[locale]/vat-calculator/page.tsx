import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { VatCalculator } from "@/components/calculators/vat";

const SLUG = "vat-calculator";

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
    "This VAT calculator adds Value Added Tax to a net price or removes it from a gross price. Use 'Add VAT' when you have a price before tax and want the gross amount, or 'Remove VAT' when you have a VAT-inclusive total and need the net price and the VAT portion.",
    "The rate presets cover the most common UK bands — the 20% standard rate, the 5% reduced rate and the 0% zero rate — but you can type any rate for other countries. The calculator splits every figure into the VAT amount, the net price and the gross price.",
  ],
  steps: [
    "Choose 'Add VAT' to add tax on top, or 'Remove VAT' to work it out of a gross total.",
    "Enter the amount and select your currency.",
    "Type the VAT rate or tap a preset (20%, 5% or 0%).",
    "Read the VAT amount, net price and gross price.",
  ],
  faq: [
    {
      q: "How do I remove VAT from a gross price?",
      a: "Divide the VAT-inclusive gross by (1 + rate ÷ 100) to get the net price, then subtract the net from the gross to find the VAT. The 'Remove VAT' mode does this automatically.",
    },
    {
      q: "What are the standard UK VAT rates?",
      a: "The standard rate is 20%, the reduced rate is 5% (used for things like domestic energy) and the zero rate is 0% (used for most food and children's clothing). Other countries set their own rates.",
    },
    {
      q: "What is the difference between net and gross?",
      a: "Net is the price before VAT and gross is the price including VAT. Businesses often quote net prices, while consumers usually see gross prices.",
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
      <VatCalculator />
    </CalcShell>
  );
}
