import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { PaintCalculator } from "@/components/calculators/paint-calculator";

const SLUG = "paint-calculator";

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
    "This paint calculator estimates how much paint you need to cover a room's walls and what it will cost. Enter the room dimensions, the number of coats, and how many doors and windows to skip, and it works out the paintable area, the gallons required, and how many cans to buy.",
    "The estimate uses the wall perimeter times the height, then subtracts a standard allowance for each door and window before multiplying by the number of coats. Because paint is sold by the can, the result rounds gallons up to the next whole can so you always buy enough to finish the job.",
  ],
  steps: [
    "Enter the room length, width and wall height in feet.",
    "Set the number of coats, plus the doors and windows to exclude.",
    "Adjust the coverage per gallon if your paint's label differs from 350 sq ft.",
    "Optionally add a price per gallon to see the estimated cost.",
  ],
  faq: [
    {
      q: "How much wall does a gallon of paint cover?",
      a: "Most interior paints cover around 350 square feet per gallon for a single coat on a smooth, primed surface. Rough or porous walls absorb more, so check your paint's label and adjust the coverage figure accordingly.",
    },
    {
      q: "Why does the calculator round up the gallons?",
      a: "Paint is sold in whole cans, so buying exactly the fractional amount you need is not possible. Rounding up to the next full gallon ensures you have enough to complete every coat without running short partway through.",
    },
    {
      q: "How many coats of paint do I need?",
      a: "Two coats is the usual recommendation for an even, durable finish, especially when changing colour. A single coat may work when refreshing the same colour over a well-prepared surface, while dramatic colour changes can need more.",
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
      <PaintCalculator />
    </CalcShell>
  );
}
