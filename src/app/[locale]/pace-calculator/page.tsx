import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { PaceCalculator } from "@/components/calculators/pace-calculator";

const SLUG = "pace-calculator";

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
    "Running pace is the time it takes you to cover a set distance, usually expressed as minutes and seconds per kilometre or per mile. It is the single most useful number for pacing a race or a training run: knowing your pace tells you whether you are on target for a goal finish time and lets you hold a steady, sustainable effort instead of starting too fast and fading.",
    "This calculator turns any distance and time into pace and speed, and shows both metric and imperial figures side by side. Enter the distance you ran and how long it took, and you will see your pace per kilometre, pace per mile, and speed in kilometres and miles per hour — handy for comparing treadmill readouts, race splits and training targets without doing the arithmetic yourself.",
  ],
  steps: [
    "Enter the distance you covered and choose kilometres or miles.",
    "Enter the time it took as hours, minutes and seconds.",
    "Read your pace per kilometre and per mile.",
    "Check your average speed in km/h and mph.",
  ],
  faq: [
    {
      q: "How is running pace calculated?",
      a: "Pace is your total time divided by the distance covered. For example, running 10 km in 50 minutes gives a pace of 5:00 per kilometre. This tool converts your distance to both kilometres and miles, then divides your total time in seconds by each to show pace per km and per mile.",
    },
    {
      q: "What is the difference between pace and speed?",
      a: "Pace measures time per unit of distance (minutes per km or mile), so a smaller number is faster. Speed measures distance per unit of time (km/h or mph), so a larger number is faster. They describe the same effort in inverse ways; runners usually think in pace, while treadmills and cycling computers often show speed.",
    },
    {
      q: "How do I convert pace per mile to pace per kilometre?",
      a: "One mile is 1.609344 kilometres, so a per-mile pace is faster in per-kilometre terms. To convert, divide your per-mile pace by 1.609344. This calculator does it automatically, showing both figures from the same distance and time so you never have to convert by hand.",
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
      <PaceCalculator />
    </CalcShell>
  );
}
