import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { WaterIntakeCalculator } from "@/components/calculators/water-intake";

const SLUG = "water-intake-calculator";

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
    "This water intake calculator estimates how much fluid you should aim to drink each day based on your body weight, how much you exercise and the climate you are in. It starts from a common rule of about 35 millilitres of water per kilogram of body weight, then adds extra for activity and hot conditions to reflect the fluid you lose through sweat.",
    "The result is shown in litres, ounces, cups and glasses so you can track it however suits you. These are general targets, not medical advice: food, other drinks, illness, pregnancy and individual health all affect your real needs. A simple everyday check is the colour of your urine — pale straw suggests you are well hydrated.",
  ],
  steps: [
    "Choose your unit, kilograms or pounds, and enter your weight.",
    "Enter the number of minutes you exercise on a typical day.",
    "Select Normal or Hot for your climate.",
    "Read your daily water target in litres, ounces, cups and glasses.",
  ],
  faq: [
    {
      q: "How is the daily water target calculated?",
      a: "The base is about 35 millilitres per kilogram of body weight. The calculator adds roughly 350 millilitres for every 30 minutes of exercise, and another 500 millilitres if you select a hot climate, then converts the total into litres, ounces, cups and glasses.",
    },
    {
      q: "Does other liquid and food count toward the total?",
      a: "Yes. Beverages like tea, milk and juice contribute to hydration, and water-rich foods such as fruit and vegetables add a meaningful amount too. The target here refers to total fluid intake, so you do not need to drink all of it as plain water.",
    },
    {
      q: "Can I drink too much water?",
      a: "Very rarely, drinking excessive water in a short time can dilute blood sodium to dangerous levels, a condition called hyponatremia. For most people this is not a concern, but if you have kidney, heart or hormonal conditions, follow the fluid guidance from your doctor.",
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
      <WaterIntakeCalculator />
    </CalcShell>
  );
}
