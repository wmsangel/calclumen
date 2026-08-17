import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { QuadraticEquationCalculator } from "@/components/calculators/quadratic-equation";

const SLUG = "quadratic-equation-calculator";

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
    "A quadratic equation has the form ax² + bx + c = 0, and this calculator solves it using the quadratic formula, x = (−b ± √(b² − 4ac)) / 2a. Enter the coefficients a, b and c and it returns the roots, the discriminant, and the coordinates of the parabola's vertex.",
    "The discriminant, b² − 4ac, tells you what kind of roots to expect. A positive value gives two distinct real roots, zero gives a single repeated root, and a negative value gives a pair of complex conjugate roots written as real ± imaginary i. The coefficient a must not be zero, otherwise the equation is linear rather than quadratic.",
  ],
  steps: [
    "Enter the coefficient a (it cannot be 0).",
    "Enter the coefficients b and c.",
    "Read the roots, the discriminant, and the vertex.",
    "Change any coefficient to see how the roots and shape of the parabola respond.",
  ],
  faq: [
    {
      q: "What is the quadratic formula?",
      a: "x = (−b ± √(b² − 4ac)) / 2a. It gives the roots of any equation in the form ax² + bx + c = 0, as long as a is not zero.",
    },
    {
      q: "What does the discriminant tell me?",
      a: "The discriminant is b² − 4ac. If it is positive there are two real roots, if it is zero there is one repeated root, and if it is negative the two roots are complex conjugates.",
    },
    {
      q: "Why must a not be zero?",
      a: "If a is 0 there is no x² term, so the equation is linear, not quadratic, and the quadratic formula divides by 2a — which would be division by zero. The calculator shows a note instead.",
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
      <QuadraticEquationCalculator />
    </CalcShell>
  );
}
