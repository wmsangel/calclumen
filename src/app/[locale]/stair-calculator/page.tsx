import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { StairCalculator } from "@/components/calculators/stair";

const SLUG = "stair-calculator";

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
    "This stair calculator turns a single measurement — the total floor-to-floor rise — into a buildable staircase: how many steps, the exact riser height, the total horizontal run and the stringer length to cut. Enter your rise and a target step height, and it divides the rise into equal risers and works out the rest.",
    "It also checks the numbers against typical US residential code: risers no taller than 7.75 inches, treads at least 10 inches deep, and the old carpenter's comfort rule that twice the riser plus the tread should land between 24 and 25 inches. Even risers matter — an uneven last step is both a code fail and a trip hazard.",
  ],
  steps: [
    "Measure the total rise from the lower finished floor to the upper finished floor.",
    "Enter that rise and a target riser height (7–7.75 inches is typical).",
    "Set your tread depth (10–11 inches is common).",
    "Read the step count, actual riser height, total run and stringer length, with code checks.",
  ],
  faq: [
    {
      q: "How do I calculate the number of stairs?",
      a: "Divide the total floor-to-floor rise by your target riser height and round to a whole number — that's the number of risers (steps). Then the actual riser height is the total rise divided by that count, which keeps every step equal.",
    },
    {
      q: "What's the maximum riser height and minimum tread?",
      a: "Under the US residential code (IRC), risers can be at most 7.75 inches and treads at least 10 inches deep. Many builders also follow the comfort rule that 2 × riser + tread should equal about 24–25 inches for a stair that feels natural to climb.",
    },
    {
      q: "What is the stringer length?",
      a: "The stringer is the diagonal board that supports the steps. Its length is the hypotenuse of the total rise and total run — √(rise² + run²) — so you know the minimum board length before accounting for cuts and overhang.",
    },
    {
      q: "Why must all risers be equal?",
      a: "Code requires the difference between the tallest and shortest riser in a flight to be very small (about 3/8 inch). Uneven steps — especially a short or tall final step — are a common trip hazard and will fail inspection, which is why the calculator spreads the rise evenly.",
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
      <StairCalculator />
    </CalcShell>
  );
}
