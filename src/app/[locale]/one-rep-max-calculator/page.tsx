import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { OneRepMaxCalculator } from "@/components/calculators/one-rep-max";

const SLUG = "one-rep-max-calculator";

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
    "This one-rep max calculator estimates the heaviest weight you could lift for a single repetition of an exercise, without you having to attempt a risky maximal lift. Enter a weight you lifted and how many reps you managed, and it predicts your 1RM by averaging two well-known formulas, Epley and Brzycki.",
    "Your estimated 1RM is a useful anchor for programming: most strength routines prescribe working weights as a percentage of it. The calculator prints a full percentage table so you can quickly read off loads for hypertrophy, strength and power work. Estimates are most accurate for rep counts under about 10 — the further you go beyond that, the more the prediction drifts.",
  ],
  steps: [
    "Choose your unit, kilograms or pounds.",
    "Enter the weight you lifted for the set.",
    "Enter how many clean repetitions you completed.",
    "Read your estimated 1RM and use the percentage table to set training loads.",
  ],
  faq: [
    {
      q: "How is the one-rep max estimated?",
      a: "The calculator uses two formulas: Epley, which is weight × (1 + reps ÷ 30), and Brzycki, which is weight × 36 ÷ (37 − reps). It averages the two for a balanced estimate. Brzycki is only defined below 37 reps, so very high rep counts fall back to Epley alone.",
    },
    {
      q: "How many reps give the most accurate estimate?",
      a: "Sets of around 3 to 10 reps give the most reliable 1RM estimates. As reps climb higher, fatigue, technique and endurance start to dominate, so the prediction becomes less precise. For the best read, use a challenging set that you take close to failure.",
    },
    {
      q: "What is the percentage table for?",
      a: "Strength programs often prescribe loads as a percentage of your 1RM — for example 80% for strength work or 65% for higher-rep hypertrophy. The table converts your estimated max into concrete working weights so you can load the bar without recalculating each set.",
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
      <OneRepMaxCalculator />
    </CalcShell>
  );
}
