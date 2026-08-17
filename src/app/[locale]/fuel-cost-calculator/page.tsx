import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { FuelCostCalculator } from "@/components/calculators/fuel-cost-calculator";

const SLUG = "fuel-cost-calculator";

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
    "This fuel cost calculator works out how much a trip will cost in fuel based on the distance you are driving, your vehicle's efficiency and the current price of fuel. It handles both miles and kilometres, and accepts efficiency in MPG (US), litres per 100 km or kilometres per litre, so you can use whichever figures your car and country use.",
    "Enter the trip distance, choose the matching units, and set the fuel price per gallon or per litre. The calculator converts everything to a consistent basis, then reports the total fuel cost, how much fuel you will need and the cost for each mile or kilometre travelled — handy for budgeting a commute, comparing routes or splitting costs on a road trip.",
  ],
  steps: [
    "Enter the trip distance and choose miles or kilometres.",
    "Enter your fuel efficiency and pick its unit — MPG (US), L/100km or km/L.",
    "Set the fuel price per gallon or per litre, and choose your currency.",
    "Read the total fuel cost, fuel needed and cost per mile or kilometre.",
  ],
  faq: [
    {
      q: "Which efficiency unit should I use?",
      a: "Use whichever matches your car's readout. MPG (US) is common in the United States, litres per 100 km is used across most of Europe, and kilometres per litre is common in parts of Asia and Latin America. The price field switches between per gallon and per litre to match.",
    },
    {
      q: "Does MPG here mean US or UK gallons?",
      a: "This calculator uses US gallons for the MPG option. A UK (imperial) gallon is larger, so if your figure is in UK MPG the cost will be slightly off — convert it or use L/100km instead for accuracy.",
    },
    {
      q: "How is the cost per mile or kilometre worked out?",
      a: "It divides the total fuel cost by the distance you entered, in the distance unit you selected. So if a 300-mile trip costs 35 in fuel, the cost per mile is about 0.117.",
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
      <FuelCostCalculator />
    </CalcShell>
  );
}
