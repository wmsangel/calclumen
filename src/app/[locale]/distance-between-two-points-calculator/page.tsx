import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { DistanceTwoPointsCalculator } from "@/components/calculators/distance-two-points";

const SLUG = "distance-between-two-points-calculator";

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
    "This calculator finds the straight-line distance between two points on a coordinate plane, along with their midpoint and the slope of the line connecting them. Enter the coordinates of the first point (x₁, y₁) and the second point (x₂, y₂), and it applies the distance formula instantly.",
    "The distance formula comes straight from the Pythagorean theorem: the horizontal gap (x₂ − x₁) and the vertical gap (y₂ − y₁) form the two legs of a right triangle, and the distance between the points is the hypotenuse. That's why d = √((x₂ − x₁)² + (y₂ − y₁)²).",
  ],
  steps: [
    "Enter the x and y coordinates of the first point.",
    "Enter the x and y coordinates of the second point.",
    "Read the distance between them, computed with the distance formula.",
    "Use the midpoint and slope outputs for the rest of the coordinate geometry.",
  ],
  faq: [
    {
      q: "What is the distance formula?",
      a: "The distance between two points (x₁, y₁) and (x₂, y₂) is d = √((x₂ − x₁)² + (y₂ − y₁)²). You subtract the x-values, subtract the y-values, square both, add them, and take the square root.",
    },
    {
      q: "How do I find the midpoint?",
      a: "The midpoint is the average of the two coordinates: ((x₁ + x₂) ⁄ 2, (y₁ + y₂) ⁄ 2). It's the point exactly halfway along the segment joining the two points.",
    },
    {
      q: "What if the slope is undefined?",
      a: "Slope is (y₂ − y₁) ⁄ (x₂ − x₁). If the two points share the same x-value, the line is vertical and the slope is undefined (division by zero). This calculator shows 'Undefined (vertical)' in that case.",
    },
    {
      q: "Can I use negative coordinates?",
      a: "Yes. Enter negative x or y values as needed — for example the distance between (0, 6) and (−6, 0) works fine and comes out to about 8.485.",
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
      <DistanceTwoPointsCalculator />
    </CalcShell>
  );
}
