import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { OvulationCalculator } from "@/components/calculators/ovulation";

const SLUG = "ovulation-calculator";

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
    "This ovulation calculator estimates the days you are most likely to be fertile based on the first day of your last period and the length of your cycle. It works out when ovulation is likely to occur, marks the fertile window around it, and shows when your next period is due, so you can plan around the days that matter most.",
    "The estimate uses the length of your luteal phase — the time between ovulation and your next period, which is typically around 14 days and fairly stable — to count backwards from your expected period. Because cycles vary from month to month and from person to person, treat the fertile window as a guide rather than a guarantee, and combine it with other signs such as basal body temperature or ovulation tests for a clearer picture.",
  ],
  steps: [
    "Pick the first day of your last period, or tap Today to use the current date.",
    "Enter your average cycle length in days (28 is typical).",
    "Adjust the luteal phase if you know it; otherwise leave it at 14 days.",
    "Read your estimated ovulation day, fertile window and next period date.",
  ],
  faq: [
    {
      q: "How is the ovulation date calculated?",
      a: "The calculator subtracts your luteal phase length from your cycle length and counts that many days from the first day of your last period. With a 28-day cycle and a 14-day luteal phase, ovulation is estimated around day 14 of your cycle.",
    },
    {
      q: "What is the fertile window?",
      a: "The fertile window spans the days when conception is most likely — roughly the five days before ovulation plus the day after. Sperm can survive several days in the reproductive tract, so intercourse in the days leading up to ovulation can still result in pregnancy.",
    },
    {
      q: "How accurate is an ovulation estimate?",
      a: "It is an estimate based on averages, not a precise prediction. Cycle length and ovulation timing can shift from month to month due to stress, illness and other factors. For a more reliable read, track basal body temperature, cervical mucus or use ovulation predictor kits.",
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
      <OvulationCalculator />
    </CalcShell>
  );
}
