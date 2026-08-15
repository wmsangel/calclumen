import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { BmiCalculator } from "@/components/calculators/bmi";

const SLUG = "bmi-calculator";

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
    "Body Mass Index (BMI) is a simple screening number that relates your weight to your height. It is calculated from your weight and height alone and sorts adults into broad categories — underweight, normal, overweight and obese — which health organizations use as a quick, low-cost indicator of whether your weight may pose a health risk.",
    "BMI has real limitations. Because it only uses height and weight, it cannot tell muscle from fat: very muscular people such as athletes often score as overweight despite low body fat, while older adults who have lost muscle can score as normal while carrying excess fat. It also ignores where fat is stored, sex, age and ethnicity. Treat BMI as a starting point, not a diagnosis, and talk to a clinician for a fuller picture.",
  ],
  steps: [
    "Choose Metric (cm and kg) or Imperial (feet, inches and pounds).",
    "Enter your height — in centimetres, or as feet and inches.",
    "Enter your weight in kilograms or pounds.",
    "Read your BMI, weight category and the healthy weight range for your height.",
  ],
  faq: [
    {
      q: "What is the BMI formula?",
      a: "In metric units, BMI = weight (kg) ÷ height (m)², where height in metres is your centimetres divided by 100. In imperial units, BMI = 703 × weight (lb) ÷ height (in)², where height is your total height in inches (feet × 12 + inches).",
    },
    {
      q: "Is BMI an accurate measure of health?",
      a: "BMI is a useful population-level screening tool but not a precise measure of body fat or health for any one person. It does not account for muscle mass, body composition, fat distribution, age, sex or ethnicity, so athletes and older adults can be misclassified. Use it alongside measures like waist circumference and a doctor's assessment.",
    },
    {
      q: "What is a healthy BMI range?",
      a: "For most adults a BMI from 18.5 to 24.9 is considered the healthy range. Below 18.5 is underweight, 25 to 29.9 is overweight, and 30 or above is classed as obese. This calculator also shows the weight range that would keep you within the healthy band for your height.",
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
      <BmiCalculator />
    </CalcShell>
  );
}
