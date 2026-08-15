import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { BodyFatCalculator } from "@/components/calculators/body-fat";

const SLUG = "body-fat-calculator";

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
    "This body fat calculator estimates the percentage of your total weight that is fat using the U.S. Navy circumference method. Instead of just weight and height, it uses tape-measure readings of your neck, waist and — for women — hips, together with your height, to model how much of your body is fat versus lean tissue such as muscle, bone and organs.",
    "Circumference formulas are a quick, no-equipment estimate, not a lab measurement. Accuracy depends on measuring at the right spots with a snug, level tape, and results can differ from methods like DEXA or skinfold calipers. Use the number to track trends over time rather than as an exact figure, and pair it with how you look, feel and perform.",
  ],
  steps: [
    "Select your gender and choose Metric (cm, kg) or Imperial (in, lb).",
    "Enter your height, weight and neck and waist measurements — women also enter hip circumference.",
    "Measure with a flexible tape held snug but not tight, keeping it level around the body.",
    "Read your estimated body fat percentage, category, fat mass and lean mass.",
  ],
  faq: [
    {
      q: "How does the Navy body fat formula work?",
      a: "It uses the log of your waist, neck (and hip for women) circumferences together with your height to estimate body fat percentage. For men it is based on waist minus neck; for women it uses waist plus hip minus neck. Fat mass is then your body weight multiplied by that percentage, and lean mass is the remainder.",
    },
    {
      q: "How accurate is a tape-measure body fat estimate?",
      a: "The circumference method is typically within a few percentage points of clinical methods for most people, but it is still an estimate. Measurement technique, body shape and hydration all affect it. It is most useful for tracking changes in the same person over time rather than for a single precise reading.",
    },
    {
      q: "What is a healthy body fat percentage?",
      a: "Healthy ranges differ by sex because women naturally carry more essential fat. Roughly, fitness-level body fat is about 14–17% for men and 21–24% for women, with athletes lower and 25%+ (men) or 32%+ (women) generally considered obese. These bands are guides, not strict cut-offs.",
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
      <BodyFatCalculator />
    </CalcShell>
  );
}
