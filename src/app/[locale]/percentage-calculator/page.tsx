import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { PercentageCalculator } from "@/components/calculators/percentage";

const SLUG = "percentage-calculator";

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
    "This percentage calculator handles the three questions that come up most: what is X% of a number, what is the percentage change between two numbers, and what percentage one number is of another. Switch between the three modes and the answer updates instantly.",
    "Percentages are just fractions of 100. “20% of 80” means 20/100 × 80 = 16. A percentage change compares a new value to an original one, so going from 200 to 250 is a +25% change. Knowing which of the three you need is usually the only hard part.",
  ],
  steps: [
    "Pick the mode: “% of a number”, “% change”, or “X is what %”.",
    "Type the two numbers into the fields.",
    "Read the result — it recalculates as you type, no button needed.",
  ],
  faq: [
    {
      q: "How do I calculate what percent one number is of another?",
      a: "Divide the part by the whole and multiply by 100. For example, 30 out of 120 is 30 ÷ 120 × 100 = 25%. Use the “X is what %” mode to do it automatically.",
    },
    {
      q: "How is percentage change calculated?",
      a: "Subtract the original value from the new value, divide by the original, and multiply by 100. From 200 to 250 that is (250 − 200) ÷ 200 × 100 = +25%. A negative result means a decrease.",
    },
    {
      q: "What is 15% of 200?",
      a: "15% of 200 is 30. In general, to find X% of a number you multiply the number by X and divide by 100.",
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
      <PercentageCalculator />
    </CalcShell>
  );
}
