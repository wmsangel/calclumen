import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { DrywallCalculator } from "@/components/calculators/drywall";

const SLUG = "drywall-calculator";

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
    "This drywall calculator works out how many sheets of drywall (sheetrock) you need to hang a room, along with the finishing materials that go with them: joint compound, paper tape and screws. Enter the room size and wall height, choose whether to include the ceiling, and subtract the doors and windows you won't be covering.",
    "The board count uses the wall perimeter times the height plus the ceiling area, minus a standard allowance of 21 sq ft per door and 15 sq ft per window, then adds a waste factor for offcuts and rounds up to whole sheets. Finishing materials follow common trade rules of thumb — about a gallon of joint compound per 100 sq ft, roughly 370 ft of tape per 1,000 sq ft and around one screw per square foot of board — so you can buy everything in one trip.",
  ],
  steps: [
    "Enter the room length, width and wall height in feet.",
    "Choose whether to include the ceiling, and set the number of doors and windows.",
    "Pick the sheet size you plan to buy and a waste percentage (10% for simple rooms, 15% for lots of corners and cut-outs).",
    "Optionally add the price per sheet to see the board cost, then read the sheets, mud, tape and screws.",
  ],
  faq: [
    {
      q: "How many sheets of drywall do I need for a 12×12 room?",
      a: "With 8 ft walls, one door and two windows, a 12×12 room has about 333 sq ft of wall plus a 144 sq ft ceiling — roughly 477 sq ft in total. With 10% waste that's 17 sheets of 4×8 drywall, or 11 sheets of 4×12 for walls and ceiling.",
    },
    {
      q: "Which drywall sheet size should I use?",
      a: "4×8 sheets are the lightest and easiest to carry and hang alone. 4×12 sheets cover more area per piece, so you get fewer seams to tape and mud, but they are heavy and usually need two people — especially on ceilings.",
    },
    {
      q: "How much waste should I add for drywall?",
      a: "Around 10% covers offcuts in a simple rectangular room. Allow 15% or more for rooms with many corners, soffits, angled ceilings or lots of openings, where more of each sheet ends up as scrap.",
    },
    {
      q: "How much joint compound and tape does drywall need?",
      a: "A common estimate is about one gallon of ready-mixed joint compound per 100 sq ft of drywall for taping plus two finish coats, and roughly 370 linear feet of paper tape per 1,000 sq ft. Textured or level-5 finishes use noticeably more compound.",
    },
    {
      q: "How many screws per sheet of drywall?",
      a: "Plan on about 32 screws for a 4×8 sheet hung on studs 16 inches apart — roughly one per square foot of board. Ceilings typically need closer spacing, so it's worth buying a little extra.",
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
      <DrywallCalculator />
    </CalcShell>
  );
}
