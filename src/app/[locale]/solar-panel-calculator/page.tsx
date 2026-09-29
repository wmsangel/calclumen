import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { SolarPanelCalculator } from "@/components/calculators/solar-panel";

const SLUG = "solar-panel-calculator";

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
    "This solar panel calculator estimates how many panels your home needs, how big the system would be, what it costs and how long it takes to pay for itself. It works back from your actual power bill: your monthly cost and rate give your usage, and the local peak sun hours and panel wattage set how much a system has to produce to cover it.",
    "The result folds in the things that make real systems smaller than the sticker math suggests — a loss factor for the inverter, wiring and heat — and the things that make them cheaper, like the 30% US federal tax credit. You get a realistic panel count, system size in kilowatts, installed cost before and after the credit, and a payback period in years.",
  ],
  steps: [
    "Enter your average monthly electricity bill and your rate per kWh.",
    "Set the panel wattage and the peak sun hours for your area (roughly 4–6 in much of the US).",
    "Add the installed cost per watt and the share of your bill you want to offset.",
    "Read the panel count, system size, cost after the tax credit and payback period.",
  ],
  faq: [
    {
      q: "How many solar panels do I need?",
      a: "It depends on how much electricity you use, your panel wattage and your local sun hours. This calculator divides your daily usage (adjusted for real-world losses) by the daily output of one panel to get the count. As a rough guide, a typical US home needs about 15–25 modern 400W panels for a full offset.",
    },
    {
      q: "What are peak sun hours?",
      a: "Peak sun hours are the number of hours per day the sun delivers 1,000 W/m² of energy — the standard test condition. It's not daylight hours; it's a way to express your location's solar resource. Much of the US sees 4–6 peak sun hours a day on average.",
    },
    {
      q: "How is the payback period calculated?",
      a: "It's the installed cost after the 30% federal tax credit divided by your annual bill savings. Real payback also depends on electricity price inflation, net-metering rules and any state or utility incentives, which can shorten it further.",
    },
    {
      q: "Does this include the federal tax credit?",
      a: "Yes. The 'cost after tax credit' figure and the payback period apply the 30% US residential clean-energy credit. Incentives change and vary by country and state, so treat it as an estimate and confirm what applies to you.",
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
      <SolarPanelCalculator />
    </CalcShell>
  );
}
