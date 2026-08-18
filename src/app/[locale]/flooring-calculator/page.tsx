import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { FlooringCalculator } from "@/components/calculators/flooring-calculator";

const SLUG = "flooring-calculator";

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
    "This flooring calculator works out how many boxes of flooring you need to cover a room and what it will cost. Enter the room dimensions and how much area a single box covers, add a waste allowance for cuts, and it returns the boxes to buy along with the floor area.",
    "The estimate takes the floor area, adds the waste percentage, and divides by the coverage printed on each box before rounding up to a whole box. Because flooring is sold in sealed boxes and offcuts cannot always be reused, the waste allowance helps you finish the room without ordering again.",
  ],
  steps: [
    "Enter the room length and width in feet.",
    "Enter the coverage per box from the flooring's packaging.",
    "Set a waste percentage to cover cuts, mistakes and future repairs.",
    "Optionally add a price per box to see the estimated cost.",
  ],
  faq: [
    {
      q: "How much flooring waste should I allow?",
      a: "A 10% allowance suits most straight-laid rooms. Increase it to around 15% for diagonal or herringbone layouts, patterned planks, or rooms with many alcoves and angles, since these produce more unusable offcuts.",
    },
    {
      q: "Why buy flooring by the box?",
      a: "Flooring is sold in sealed boxes that each cover a fixed area, so you cannot buy an exact fractional amount. The calculator rounds up to whole boxes, which also leaves a few spare planks for replacing any that are damaged later.",
    },
    {
      q: "Should I keep leftover flooring?",
      a: "Yes. Keeping a spare box or two from the same batch means you can repair damage later with planks that match in colour and finish, which can be hard to source once a particular batch has sold out.",
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
      <FlooringCalculator />
    </CalcShell>
  );
}
