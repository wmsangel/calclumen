import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { CalorieCalculator } from "@/components/calculators/calorie";

const SLUG = "calorie-calculator";

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
    "This calorie calculator estimates how many calories your body needs each day. It starts from your basal metabolic rate (BMR) — the energy you would burn at complete rest just to keep your body running — using the Mifflin-St Jeor equation, which is one of the most accurate formulas for healthy adults. Enter your sex, age, height and weight in metric or imperial units.",
    "Your total daily energy expenditure (TDEE) is your BMR multiplied by an activity factor that accounts for movement and exercise. Eat around your TDEE to maintain your weight, eat below it to create a deficit and lose weight, or eat above it to build a surplus and gain weight. A daily change of about 500 calories corresponds to roughly half a kilogram (one pound) per week.",
  ],
  steps: [
    "Choose your sex and enter your age in years.",
    "Switch between metric and imperial, then enter your height and weight.",
    "Pick the activity level that best matches your typical week.",
    "Read your maintenance calories (TDEE), plus targets for mild weight loss, weight gain and your BMR.",
  ],
  faq: [
    {
      q: "What is TDEE?",
      a: "TDEE (total daily energy expenditure) is the total number of calories you burn in a day, including your resting metabolism (BMR) plus all movement and exercise. It is calculated by multiplying your BMR by an activity multiplier ranging from 1.2 (sedentary) to 1.9 (extra active). Eating at your TDEE keeps your weight stable.",
    },
    {
      q: "How many calories should I cut to lose 1 lb per week?",
      a: "One pound of body fat is roughly 3,500 calories, so an average deficit of about 500 calories per day adds up to around one pound (0.45 kg) of weight loss per week. That is why the mild weight-loss target subtracts 500 calories from your TDEE.",
    },
    {
      q: "How accurate is this calculator?",
      a: "The Mifflin-St Jeor equation is an estimate that works well for most healthy adults, but it does not account for body composition, medical conditions or individual metabolism, so real needs can vary by a few hundred calories. Use it as a starting point, then adjust based on how your weight changes over two to three weeks.",
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
      <CalorieCalculator />
    </CalcShell>
  );
}
