import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { RoofingCalculator } from "@/components/calculators/roofing-calculator";

const SLUG = "roofing-calculator";

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
    "This roofing calculator turns the flat footprint of your roof into its real sloped surface area, then works out how many roofing squares, shingle bundles and underlayment rolls to order. Enter the length and width of the roof including the overhangs, pick the pitch, and add a waste allowance for cuts, starter strips and ridge caps.",
    "A steeper roof has more surface than the ground it covers, so the footprint is multiplied by a pitch factor: the square root of 1 + (rise ÷ 12)². A 6/12 roof has a factor of about 1.118, so a 1,500 sq ft footprint becomes roughly 1,677 sq ft of roof. Roofers sell and quote by the square (100 sq ft), and standard architectural shingles come three bundles to the square.",
  ],
  steps: [
    "Measure the length and width of the roof footprint in feet, including the eave and rake overhangs.",
    "Choose the roof pitch — the inches of rise per 12 inches of horizontal run.",
    "Set a waste percentage: about 10% for a simple gable, 15% or more for hips, valleys and dormers.",
    "Check bundles per square (3 for most asphalt shingles, 4 for some heavy designer lines).",
    "Optionally enter the price per bundle to see the estimated shingle cost.",
  ],
  faq: [
    {
      q: "What is a roofing square?",
      a: "A roofing square is 100 square feet of roof surface. Shingles, underlayment and labour are usually priced per square, so a 2,000 sq ft roof is 20 squares before waste.",
    },
    {
      q: "How many bundles of shingles are in a square?",
      a: "Most three-tab and architectural asphalt shingles are packaged three bundles per square, each bundle covering about 33.3 sq ft. Some heavier premium shingles need four or five bundles per square, so check the wrapper.",
    },
    {
      q: "How do I find my roof pitch?",
      a: "Hold a level horizontally against the roof or a rafter, measure 12 inches along it, then measure straight up to the roof surface. That vertical distance in inches is the rise, so 6 inches means a 6/12 pitch.",
    },
    {
      q: "How much waste should I add for shingles?",
      a: "Around 10% covers a plain gable roof. Hip roofs, valleys, dormers and skylights create more cut-offs, so 15% to 20% is safer. Starter strips and ridge caps also come from the waste allowance unless you buy them separately.",
    },
    {
      q: "Can I measure the roof from the ground?",
      a: "Yes — measure the outside of the house walls, add the overhang on each side, and use this calculator's pitch factor to convert the footprint to sloped area. It avoids climbing on the roof and is accurate enough for ordering.",
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
      <RoofingCalculator />
    </CalcShell>
  );
}
