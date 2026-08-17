import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { RatioCalculator } from "@/components/calculators/ratio-calculator";

const SLUG = "ratio-calculator";

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
    "This ratio calculator does two jobs. In Simplify mode it reduces a ratio like 1920 : 1080 to its lowest terms, and also expresses it as a decimal and in the handy “1 : n” form. In Solve mode it fills in the missing value of a proportion, so if a : b = c : x you get x instantly.",
    "A ratio compares two quantities, and simplifying it means dividing both sides by their greatest common divisor. A proportion sets two ratios equal to each other, which is the classic “cross-multiply” problem from school: x = b × c ÷ a. Both are used constantly for aspect ratios, recipes, scale drawings, and mixing.",
  ],
  steps: [
    "Choose “Simplify” to reduce a ratio, or “Solve proportion” to find a missing term.",
    "In Simplify, type the two parts (A and B). In Solve, type A, B and C for a : b = c : x.",
    "Read the results — the simplified ratio, decimal and 1 : n form, or the missing value x, all update as you type.",
  ],
  faq: [
    {
      q: "How do I simplify a ratio?",
      a: "Divide both numbers by their greatest common divisor (GCD). For 1920 : 1080 the GCD is 120, so it reduces to 16 : 9. The calculator does this automatically in Simplify mode.",
    },
    {
      q: "How do I solve a proportion for the missing number?",
      a: "For a : b = c : x, cross-multiply: x = b × c ÷ a. For example 1 : 2 = 5 : x gives x = 2 × 5 ÷ 1 = 10. Use Solve mode and enter A, B and C.",
    },
    {
      q: "What does the “1 : n” form mean?",
      a: "It rescales the ratio so the first term is 1, which makes it easy to compare. A ratio of 4 : 10 becomes 1 : 2.5, telling you the second quantity is 2.5 times the first.",
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
      <RatioCalculator />
    </CalcShell>
  );
}
