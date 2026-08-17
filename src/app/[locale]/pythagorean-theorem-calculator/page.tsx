import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { PythagoreanTheoremCalculator } from "@/components/calculators/pythagorean-theorem";

const SLUG = "pythagorean-theorem-calculator";

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
    "The Pythagorean theorem links the three sides of a right triangle: the square of the hypotenuse equals the sum of the squares of the two legs, or a² + b² = c². This calculator solves it in both directions — enter the two legs to find the hypotenuse, or enter the hypotenuse and one leg to find the missing leg.",
    "Along with the side you are looking for, it also reports the triangle's area and perimeter. Area is half the product of the two legs, and the perimeter is simply the sum of all three sides. Because the hypotenuse is always the longest side, the missing-leg mode needs the hypotenuse to be longer than the known leg.",
  ],
  steps: [
    "Choose whether you are finding the hypotenuse (c) or a missing leg.",
    "Enter the two known sides — the two legs, or the hypotenuse and one leg.",
    "Read the highlighted side, plus the triangle's area and perimeter.",
    "Adjust any value and the results recalculate instantly.",
  ],
  faq: [
    {
      q: "What is the Pythagorean theorem?",
      a: "For any right triangle, a² + b² = c², where a and b are the two shorter sides (legs) and c is the hypotenuse — the side opposite the right angle. It only holds for right triangles.",
    },
    {
      q: "How do I find a missing leg?",
      a: "Rearrange the formula to b = √(c² − a²). Enter the hypotenuse and the known leg in the “Find a leg” mode and the calculator does this for you. The hypotenuse must be longer than the leg, otherwise no real triangle exists.",
    },
    {
      q: "What are the sides of a 3-4-5 triangle?",
      a: "3, 4 and 5 form the best-known Pythagorean triple: 3² + 4² = 9 + 16 = 25 = 5². Any triangle whose sides are in a 3:4:5 ratio is a right triangle.",
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
      <PythagoreanTheoremCalculator />
    </CalcShell>
  );
}
