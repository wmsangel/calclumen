import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { FractionCalculator } from "@/components/calculators/fraction";

const SLUG = "fraction-calculator";

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
    "This fraction calculator adds, subtracts, multiplies, and divides two fractions, then reduces the answer to its simplest form. Enter a numerator and denominator for each fraction, pick an operator, and you get the result as a fraction, a mixed number, and a decimal all at once.",
    "The arithmetic follows the usual rules: to add or subtract you put both fractions over a common denominator, to multiply you multiply straight across, and to divide you multiply by the reciprocal of the second fraction. The result is then simplified by dividing the numerator and denominator by their greatest common divisor.",
  ],
  steps: [
    "Type the numerator and denominator of the first fraction.",
    "Choose an operator: add, subtract, multiply, or divide.",
    "Type the numerator and denominator of the second fraction.",
    "Read the simplified fraction, its mixed-number form, and the decimal value below.",
  ],
  faq: [
    {
      q: "How do you add two fractions?",
      a: "Give both fractions a common denominator, add the numerators, and simplify. For 1/2 + 1/3 the common denominator is 6, so it becomes 3/6 + 2/6 = 5/6.",
    },
    {
      q: "How is a fraction converted to a mixed number?",
      a: "Divide the numerator by the denominator to get the whole part, and the remainder over the denominator is the fractional part. For example 7/3 is 2 1/3 because 3 goes into 7 twice with a remainder of 1.",
    },
    {
      q: "Why is the answer automatically simplified?",
      a: "The calculator divides the numerator and denominator by their greatest common divisor, so 4/8 is shown as 1/2. This gives the smallest equivalent fraction, which is the standard way to express a result.",
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
      <FractionCalculator />
    </CalcShell>
  );
}
