import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { PregnancyWeightGainCalculator } from "@/components/calculators/pregnancy-weight-gain";

const SLUG = "pregnancy-weight-gain-calculator";

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
    "How much weight should you gain during pregnancy? It depends mostly on your weight before you were pregnant. This calculator uses your pre-pregnancy BMI and the US Institute of Medicine (IOM) guidelines to show your recommended total gain — and how much is healthy by any given week.",
    "Enter your height and pre-pregnancy weight, your current week, and optionally your current weight to see whether you're tracking within the recommended range. It covers both a single baby and twins.",
  ],
  steps: [
    "Pick your units and whether you're carrying one baby or twins.",
    "Enter your height and your weight before pregnancy — these set your pre-pregnancy BMI category.",
    "Enter your current week of pregnancy (1–42).",
    "Optionally add your current weight to see your gain so far and whether it's on track.",
  ],
  faq: [
    {
      q: "How much weight should I gain during pregnancy?",
      a: "For a single baby, the IOM recommends total gain by pre-pregnancy BMI: underweight (BMI under 18.5) 28–40 lb, normal (18.5–24.9) 25–35 lb, overweight (25–29.9) 15–25 lb, and obese (30+) 11–20 lb. Twins have higher ranges. The calculator picks the right range from your BMI.",
    },
    {
      q: "How is the weekly recommendation worked out?",
      a: "Gain is slow in the first trimester — only about 1–4.5 lb total — then steadier in the second and third. The IOM gives weekly rates by BMI category (for example about 1 lb/week for a normal-weight woman), which this adds on top of the first-trimester gain to estimate how much is healthy by your current week.",
    },
    {
      q: "What if I'm above or below the range?",
      a: "The range is a guide, not a hard rule, and one reading doesn't decide anything. Both gaining too little and too much carry some risk, so if your gain is consistently outside the range, talk it through with your doctor or midwife rather than changing your diet drastically on your own.",
    },
    {
      q: "Does the weight come off after birth?",
      a: "Some is lost at delivery (the baby, placenta and fluid — often 10–13 lb), and the rest typically comes off gradually over the following months, especially with breastfeeding and normal activity. How quickly varies a lot from person to person.",
    },
    {
      q: "Is this medical advice?",
      a: "No. It's general information based on population guidelines. Your own healthy target can differ based on your health, your pregnancy and your provider's judgment — always follow the plan your doctor or midwife gives you.",
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
      <PregnancyWeightGainCalculator />
    </CalcShell>
  );
}
