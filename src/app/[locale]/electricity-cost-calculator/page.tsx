import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { ElectricityCostCalculator } from "@/components/calculators/electricity-cost";

const SLUG = "electricity-cost-calculator";

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
    "This electricity cost calculator shows what an appliance costs to run over a day, a month and a year. Enter the device's power in watts, how many hours a day it runs and your electricity rate per kilowatt-hour, and it converts that into real money — so you can see which appliances quietly drive up your bill.",
    "The maths is simple: power (in watts) multiplied by hours of use gives watt-hours, which divided by 1,000 gives kilowatt-hours (kWh) — the unit your utility bills you in. Multiply the kWh by your rate and you have the cost. Running several identical devices? Set the quantity and the totals scale up accordingly.",
  ],
  steps: [
    "Enter the appliance's power rating in watts (check the label or nameplate).",
    "Set how many hours a day it actually runs.",
    "Enter how many of these devices you're running, if more than one.",
    "Add your electricity rate per kWh and choose your currency.",
    "Read the daily, monthly and yearly cost, plus the energy used in kWh.",
  ],
  faq: [
    {
      q: "Where do I find an appliance's wattage?",
      a: "It's usually printed on a label or nameplate on the device or in its manual, shown in watts (W). If only amps and volts are listed, multiply them (watts = volts × amps). For devices rated in kilowatts, multiply by 1,000 to get watts.",
    },
    {
      q: "What is a kilowatt-hour (kWh)?",
      a: "A kilowatt-hour is the energy used by a 1,000-watt device running for one hour. It's the unit utilities charge by. A 1,000 W heater run for 4 hours uses 4 kWh; at a rate of 0.17 per kWh that costs 0.68 per day.",
    },
    {
      q: "What electricity rate should I use?",
      a: "Use the per-kWh rate from your latest electricity bill, since rates vary widely by region and plan. If your bill has tiered or time-of-use pricing, use your average rate for a rough estimate.",
    },
    {
      q: "Does standby power count?",
      a: "Many devices draw a small amount of power even when off or on standby. For an accurate yearly figure, either add standby hours at the lower standby wattage separately, or use a plug-in energy meter to measure real consumption.",
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
      <ElectricityCostCalculator />
    </CalcShell>
  );
}
