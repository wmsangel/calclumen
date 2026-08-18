import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { VolumeConverter } from "@/components/calculators/volume-converter";

const SLUG = "volume-converter";

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
    "This volume converter changes a quantity from one unit into another, covering both metric measures like litres and millilitres and US customary measures like gallons, quarts, pints, cups and fluid ounces. Enter a value, choose your units, and the result appears straight away.",
    "All conversions pass through a common base unit, the litre, so each answer is exact to the defined factor. One US gallon is 3.785411784 litres and one cubic metre is 1000 litres, which keeps cooking, fuel and container conversions consistent and reliable.",
  ],
  steps: [
    "Enter the volume you want to convert.",
    "Pick the unit to convert from.",
    "Pick the unit to convert to.",
    "Read the converted value, plus the full table of every supported unit.",
  ],
  faq: [
    {
      q: "How many millilitres are in a litre?",
      a: "There are exactly 1000 millilitres in a litre. So to convert litres to millilitres you multiply by 1000, and to go back you divide by 1000.",
    },
    {
      q: "Are these US or UK gallons?",
      a: "The gallon, quart, pint, cup and fluid ounce here are US customary units. One US gallon is about 3.785 litres, whereas a UK (imperial) gallon is larger at about 4.546 litres, so check which system your recipe or spec uses.",
    },
    {
      q: "How many cups are in a litre?",
      a: "Using the US cup of 236.588 millilitres, one litre is about 4.227 cups. Cup sizes vary by country, so this converter uses the US customary definition throughout.",
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
      <VolumeConverter />
    </CalcShell>
  );
}
