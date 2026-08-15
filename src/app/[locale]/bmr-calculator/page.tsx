import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { BmrCalculator } from "@/components/calculators/bmr";

const SLUG = "bmr-calculator";

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
    "Your basal metabolic rate (BMR) is the number of calories your body burns at complete rest just to keep you alive — powering your heart, brain, breathing and other basic functions over a full day. It is the largest single part of most people's daily energy use and the foundation for working out how much you should eat to lose, maintain or gain weight.",
    "This calculator shows your BMR from two well-known equations. The Mifflin-St Jeor equation is the modern default and is generally considered the most accurate for the average person, while the revised Harris-Benedict equation is the classic formula included for comparison. Both use your sex, age, height and weight; they do not include activity, so multiply your BMR by an activity factor to estimate total daily calories.",
  ],
  steps: [
    "Select your gender and choose Metric (cm, kg) or Imperial (ft, in, lb).",
    "Enter your age in years.",
    "Enter your height and weight in the chosen units.",
    "Read your BMR from the Mifflin-St Jeor equation, with the Harris-Benedict estimate for comparison.",
  ],
  faq: [
    {
      q: "What is the Mifflin-St Jeor BMR formula?",
      a: "Using weight in kilograms, height in centimetres and age in years: BMR = 10 × weight + 6.25 × height − 5 × age, then add 5 for men or subtract 161 for women. It is widely regarded as the most accurate general-purpose BMR equation for healthy adults.",
    },
    {
      q: "How is BMR different from TDEE?",
      a: "BMR is what you burn at complete rest. Total daily energy expenditure (TDEE) also includes movement, exercise and digesting food. You estimate TDEE by multiplying BMR by an activity factor — roughly 1.2 for sedentary up to about 1.9 for very active people.",
    },
    {
      q: "Why do the two equations give different numbers?",
      a: "Mifflin-St Jeor and Harris-Benedict were derived from different study populations and use different coefficients, so their estimates usually differ by a modest amount. Neither is exact for any one person; treat them as close estimates and adjust based on how your weight actually changes.",
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
      <BmrCalculator />
    </CalcShell>
  );
}
