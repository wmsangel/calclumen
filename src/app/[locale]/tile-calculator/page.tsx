import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { TileCalculator } from "@/components/calculators/tile-calculator";

const SLUG = "tile-calculator";

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
    "This tile calculator works out how many tiles you need to cover a floor and what they will cost. Enter the room dimensions and the size of a single tile, add a waste allowance for cuts and breakages, and it returns the number of tiles to buy along with the floor area.",
    "The estimate divides the total floor area by the area of one tile, then adds the waste percentage before rounding up to a whole tile. Because tiles are bought individually and offcuts cannot always be reused, the waste allowance helps you avoid a second trip to the store part-way through the job.",
  ],
  steps: [
    "Enter the room length and width in feet.",
    "Enter the tile width and height in inches.",
    "Set a waste percentage to cover cuts, breakages and future repairs.",
    "Optionally add a price per tile to see the estimated cost.",
  ],
  faq: [
    {
      q: "How much waste should I allow for tiling?",
      a: "A 10% allowance is typical for a simple square or rectangular room. Add more, around 15% to 20%, for diagonal layouts, patterned tiles or rooms with many corners and obstacles, since these produce more offcuts that cannot be reused.",
    },
    {
      q: "Why does the calculator round up the number of tiles?",
      a: "Tiles are sold as whole units, so any fractional requirement has to be rounded up. Rounding up also gives you a few spare tiles, which is useful for replacing a cracked tile later with an exact colour and batch match.",
    },
    {
      q: "Does tile size affect how many I need?",
      a: "Yes. Larger tiles cover more area each, so you need fewer of them, while smaller tiles and mosaics require many more pieces for the same floor. The calculator accounts for this by using the exact tile dimensions you enter.",
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
      <TileCalculator />
    </CalcShell>
  );
}
