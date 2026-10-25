import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { OvenTemperatureConverter } from "@/components/calculators/oven-temperature-converter";

const SLUG = "oven-temperature-converter";

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
    "This oven temperature converter turns a setting between Celsius, Fahrenheit and UK gas marks, and shows the matching fan (convection) temperature so you can move a recipe between ovens without guessing.",
    "Fan ovens run hotter for the same dial number, so the usual rule of thumb is to drop about 20 °C from a conventional recipe temperature (then round to the nearest 10 °C). Gas marks are the numbered dial scale used on many UK cookers; the table below is the standard conventional mapping.",
  ],
  steps: [
    "Enter the oven temperature or gas mark you have.",
    "Choose the scale: °C, °F or Gas mark.",
    "Read the conventional and fan equivalents, the nearest gas mark, and use the reference table below for quick lookups.",
  ],
  faq: [
    {
      q: "What is Gas Mark 4 in Celsius?",
      a: "Gas Mark 4 is 180 °C, or 350 °F, on a conventional oven. The fan equivalent is about 160 °C.",
    },
    {
      q: "How much lower is a fan oven?",
      a: "As a rule of thumb, set a fan (convection) oven about 20 °C lower than a conventional recipe temperature, then round to the nearest 10 °C. Always check your appliance manual — some ovens already adjust for you.",
    },
    {
      q: "What is 350 °F in Celsius / gas mark?",
      a: "350 °F is about 177 °C, which maps to Gas Mark 4 (180 °C / 350 °F on the standard UK table).",
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
      <OvenTemperatureConverter />
    </CalcShell>
  );
}
