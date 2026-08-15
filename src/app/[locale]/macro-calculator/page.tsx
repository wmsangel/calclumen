import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { MacroCalculator } from "@/components/calculators/macro";

const SLUG = "macro-calculator";

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
    "This macro calculator turns a daily calorie target into grams of protein, carbohydrate and fat — your macronutrients. It first adjusts your calories for your goal (maintain, cut or bulk), then splits those calories across the three macros using your chosen ratio, converting each into grams based on the energy each provides: 4 calories per gram of protein and carbs, and 9 calories per gram of fat.",
    "Macros are a framework, not a rigid rule. The best split depends on your training, food preferences and how your body responds, and the presets here are sensible starting points rather than the only right answer. Protein targets in particular matter most for preserving muscle when cutting. Track your results for a couple of weeks and adjust the numbers to match your progress and how you feel.",
  ],
  steps: [
    "Enter your daily calorie target — for example your maintenance calories from a TDEE calculator.",
    "Choose your goal: Maintain keeps calories as-is, Cut lowers them, and Bulk raises them.",
    "Pick a macro split: Balanced, High-protein or Low-carb.",
    "Read your adjusted target calories along with grams of protein, carbs and fat.",
  ],
  faq: [
    {
      q: "How are macros calculated from calories?",
      a: "Each macro is assigned a percentage of your calories based on the chosen split, and those calories are divided by the energy per gram: 4 calories per gram for protein and carbohydrate, and 9 calories per gram for fat. The goal factor scales your total calories first — 0.8 for cutting, 1.0 for maintenance and 1.15 for bulking.",
    },
    {
      q: "What macro split should I choose?",
      a: "Balanced (40% carbs / 30% protein / 30% fat) suits most general goals. High-protein (30/40/30) helps preserve muscle, especially when dieting, while Low-carb (20/40/40) shifts energy toward fat and suits people who prefer fewer carbs. Any split can work if calories and protein are adequate.",
    },
    {
      q: "How much protein do I need?",
      a: "A common guideline is roughly 1.6 to 2.2 grams of protein per kilogram of body weight per day, with the higher end useful when losing fat or building muscle. The high-protein preset in this calculator is designed to push protein toward that range for most people.",
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
      <MacroCalculator />
    </CalcShell>
  );
}
