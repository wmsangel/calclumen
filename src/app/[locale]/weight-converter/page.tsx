import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { WeightConverter } from "@/components/calculators/weight-converter";

const SLUG = "weight-converter";

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
    "This weight converter turns a value from one unit into another across the five most common units of mass: kilograms, grams, pounds, ounces and stones. Type a number, choose the unit you are converting from and the unit you want, and the result updates instantly along with a table showing the same weight in every unit.",
    "All conversions run through a common base unit — the kilogram — using exact factors such as one pound equalling 0.45359237 kilograms and one stone equalling 14 pounds. Because every unit maps to kilograms, converting between any two of them is a single multiply-then-divide step that stays accurate to the defined factor.",
  ],
  steps: [
    "Enter the weight value you want to convert.",
    "Pick the unit to convert from — kg, g, lb, oz or st.",
    "Pick the unit to convert to.",
    "Read the converted value, and use the table to see the weight in all five units at once.",
  ],
  faq: [
    {
      q: "How many pounds are in a kilogram?",
      a: "One kilogram is about 2.2046 pounds. To convert kilograms to pounds you divide by 0.45359237, and to go from pounds back to kilograms you multiply by the same figure.",
    },
    {
      q: "How many pounds are in a stone?",
      a: "One stone is exactly 14 pounds, which is about 6.35029 kilograms. Stones are still commonly used for body weight in the UK and Ireland.",
    },
    {
      q: "What is the difference between mass and weight here?",
      a: "In everyday use the terms are interchangeable, and this tool converts units of mass such as kilograms and pounds. True weight is a force that depends on gravity, but for conversions like these the distinction does not matter.",
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
      <WeightConverter />
    </CalcShell>
  );
}
