import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { SquareFootageCalculator } from "@/components/calculators/square-footage-calculator";

const SLUG = "square-footage-calculator";

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
    "This square footage calculator measures the area of a space and helps you price materials for it. Choose a shape — rectangle, circle or triangle — enter its dimensions, and it returns the total area in square feet along with square yards and square metres for easy comparison.",
    "Set a quantity to add up several identical areas at once, such as multiple rooms or panels, and add a price per square foot to estimate the material cost. It is handy for flooring, tiling, turf, carpet and any project quoted by the square foot.",
  ],
  steps: [
    "Pick the shape that matches the area you are measuring.",
    "Enter the required dimensions in feet.",
    "Set a quantity if you are covering several identical areas.",
    "Optionally add a price per square foot to estimate the total cost.",
  ],
  faq: [
    {
      q: "How do I calculate square footage?",
      a: "For a rectangle, multiply length by width. For a circle, multiply pi by the radius squared. For a triangle, take half of the base times the height. This calculator applies the right formula automatically for the shape you select.",
    },
    {
      q: "How many square feet are in a square yard?",
      a: "One square yard equals nine square feet, because a yard is three feet on each side and three times three is nine. To convert square feet to square yards, divide the area by nine.",
    },
    {
      q: "How do I add extra for waste and cuts?",
      a: "Flooring and tiling projects usually need extra material for cuts and mistakes. A common approach is to add 5 to 10 percent to the measured area, which you can do here by increasing the quantity or the dimensions slightly.",
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
      <SquareFootageCalculator />
    </CalcShell>
  );
}
