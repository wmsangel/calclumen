import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { UnitConverter } from "@/components/calculators/unit-converter";

const SLUG = "unit-converter";

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
    "This unit converter turns a value from one unit into another across four everyday categories: length, weight, temperature and volume. Type a number, pick the unit you are converting from and the unit you want, and the result updates instantly — no need to look up conversion factors.",
    "Length, weight and volume are converted through a common base unit (the metre, kilogram and litre), so every conversion is exact to the defined factor. Temperature is handled separately because Celsius, Fahrenheit and Kelvin use different zero points, which means an offset — not just a multiplier — is needed to convert between them.",
  ],
  steps: [
    "Choose a category — Length, Weight, Temperature or Volume.",
    "Enter the value you want to convert.",
    "Pick the unit to convert from and the unit to convert to.",
    "Read the converted result underneath, shown to four decimal places.",
  ],
  faq: [
    {
      q: "How many kilometres are in a mile?",
      a: "One mile is exactly 1.609344 kilometres, so to convert miles to kilometres you multiply by 1.609344, and to convert kilometres to miles you divide by the same figure.",
    },
    {
      q: "Is a US gallon different from a UK gallon?",
      a: "Yes. The volume units in this converter are US customary units, where one US gallon is about 3.785 litres. A UK (imperial) gallon is larger, about 4.546 litres, so make sure you know which system a recipe or spec is using.",
    },
    {
      q: "How do I convert Celsius to Fahrenheit?",
      a: "Multiply the Celsius temperature by 9/5 and add 32: °F = °C × 9/5 + 32. For example, 20 °C becomes 20 × 9/5 + 32 = 68 °F.",
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
      <UnitConverter />
    </CalcShell>
  );
}
