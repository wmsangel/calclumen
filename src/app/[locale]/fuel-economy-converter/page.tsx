import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { FuelEconomyConverter } from "@/components/calculators/fuel-economy-converter";

const SLUG = "fuel-economy-converter";

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
    "This fuel economy converter switches a vehicle's efficiency between the four figures people actually quote: US miles per gallon, UK (imperial) miles per gallon, litres per 100 kilometres, and kilometres per litre. Enter a value, choose what it is measured in and what you want it in, and the answer updates instantly.",
    "US and UK gallons are different sizes, so 30 US MPG and 30 UK MPG are not the same efficiency — this is why an American and a British spec sheet can disagree about the same car. Every conversion here goes through litres per 100 kilometres as a common pivot, which keeps the maths consistent and lets you read the same vehicle in all four units at once.",
  ],
  steps: [
    "Enter the fuel economy value you already have.",
    "Pick the unit it is measured in under \"From\".",
    "Pick the unit you want under \"To\".",
    "Read the converted figure, plus a table showing the value in all four units.",
  ],
  faq: [
    {
      q: "Why is UK MPG higher than US MPG for the same car?",
      a: "The imperial gallon used in the UK is about 20% larger than the US gallon, so the same car travels further on one UK gallon. That makes the UK MPG number roughly 1.2 times the US MPG figure for identical real-world efficiency.",
    },
    {
      q: "How do MPG and L/100km relate?",
      a: "They move in opposite directions. A higher MPG means a more efficient car, while a lower L/100km means a more efficient car. To convert US MPG to L/100km you divide 235.215 by the MPG value.",
    },
    {
      q: "What is a good fuel economy figure?",
      a: "It depends on the vehicle, but many efficient petrol cars sit around 6 to 8 L/100km, which is roughly 30 to 40 US MPG. Hybrids and small cars can do considerably better, while large SUVs and trucks use more.",
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
      <FuelEconomyConverter />
    </CalcShell>
  );
}
