import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { DeckCalculator } from "@/components/calculators/deck-calculator";

const SLUG = "deck-calculator";

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
    "This deck calculator works out the materials for a rectangular deck: how many decking boards to buy, how many joists sit under them and how many screws hold it all down. Enter the deck's length and width, pick the board size, the gap between boards, the board length you plan to buy and the joist spacing, then add a waste allowance for trimming and bad boards.",
    "The number of board rows comes from the deck width divided by one board plus its gap — a 5.5-inch board with a 3/16-inch gap covers 5.6875 inches per row. A 16 × 12 ft deck therefore needs 26 rows, or 416 linear feet of decking; with 10% waste that is 29 sixteen-foot boards. At 16 inches on center the same deck has 13 joists, and two screws per board at every joist comes to about 676 screws.",
  ],
  steps: [
    "Measure the deck length in the direction the boards will run, and the width across them, in feet.",
    "Choose the board size — most wood and composite decking is 5.5 inches wide.",
    "Set the gap between boards: 3/16 inch is common for wood, check the maker's spec for composite.",
    "Pick the board length you'll buy and the joist spacing (16 in on center for most decking, 12 in for diagonal or some composites).",
    "Add a waste percentage and, optionally, the price per board to estimate the decking cost.",
  ],
  faq: [
    {
      q: "How many deck boards do I need for a 12 × 12 deck?",
      a: "With 5.5-inch boards and a 3/16-inch gap a 12 ft wide deck needs 26 rows. Using 12-ft boards that is 26 boards before waste, or about 29 with 10% extra for cuts and defects.",
    },
    {
      q: "What joist spacing should I use for decking?",
      a: "16 inches on center is the standard for 5/4 and 2× wood decking laid straight. Many composite boards, and any decking laid diagonally, call for 12 inches on center. 24 inches is only for thick 2× boards where the manufacturer and local code allow it.",
    },
    {
      q: "How big should the gap between deck boards be?",
      a: "About 1/8 to 1/4 inch — 3/16 inch is a common middle ground. The gap lets water drain and the boards expand. Kiln-dried or composite boards are usually spaced to the manufacturer's spec, while wet pressure-treated boards can go tight because they shrink as they dry.",
    },
    {
      q: "How many screws do I need per deck board?",
      a: "Two screws at every joist a board crosses. A 16-ft board over joists at 16 inches on center crosses 13 joists, so it takes 26 screws. Hidden fastener systems use one clip per joist crossing instead.",
    },
    {
      q: "How much waste should I allow for decking?",
      a: "About 10% for boards laid straight, covering end cuts and the odd warped board. Diagonal patterns, picture-frame borders and decks with many corners waste more, so allow 15% or more.",
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
      <DeckCalculator />
    </CalcShell>
  );
}
