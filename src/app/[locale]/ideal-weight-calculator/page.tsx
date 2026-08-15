import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { IdealWeightCalculator } from "@/components/calculators/ideal-weight";

const SLUG = "ideal-weight-calculator";

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
    "This ideal weight calculator estimates a healthy body weight for your height using four classic clinical formulas — Devine, Robinson, Miller and Hamwi. Each was originally developed to help with medication dosing and quick health screening, and each gives a slightly different target, so the tool also averages them to give you a single, balanced figure in both kilograms and pounds.",
    "Ideal weight formulas depend only on height and sex, so they cannot account for your build, muscle mass, frame size or body composition. A very muscular or large-framed person may sit healthily above these numbers, while the formulas can read low for very tall people. Use the result as a rough reference band rather than a strict goal, and speak with a clinician for personalised advice.",
  ],
  steps: [
    "Select your gender.",
    "Choose Metric (cm) or Imperial (feet and inches).",
    "Enter your height in the chosen units.",
    "Read your average ideal weight, plus the individual Devine, Robinson, Miller and Hamwi estimates.",
  ],
  faq: [
    {
      q: "Which ideal weight formula should I use?",
      a: "There is no single correct one — Devine, Robinson, Miller and Hamwi each use height and sex but different coefficients, so they disagree by a few kilograms. This tool shows all four and their average so you get a range rather than a false sense of a single exact number.",
    },
    {
      q: "How are these formulas calculated?",
      a: "Each formula starts from a base weight for a height of 5 feet (60 inches) and adds a fixed amount for every inch above that. For example, the Devine formula for men is 50 kg plus 2.3 kg per inch over 5 feet, with a lower base for women.",
    },
    {
      q: "Is ideal body weight the same as a healthy weight?",
      a: "Not exactly. These formulas give a single reference figure, whereas a healthy weight is really a range that also depends on muscle, frame and body composition. It is normal and healthy to sit somewhat above or below your calculated ideal weight.",
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
      <IdealWeightCalculator />
    </CalcShell>
  );
}
