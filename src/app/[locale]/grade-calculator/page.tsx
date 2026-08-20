import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { GradeCalculator } from "@/components/calculators/grade";

const SLUG = "grade-calculator";

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
    "This grade calculator works two ways. In Course grade mode, enter each assignment, its score as a percentage and how much it's worth, and it returns your weighted course grade with the matching letter. In Final grade needed mode, enter your current grade, your target and how much the final exam counts, and it tells you the exact score you need on that final.",
    "A weighted grade isn't a simple average — each item counts in proportion to its weight. A 95% on homework worth 10% moves your grade far less than a 95% on a final worth 40%. The calculator multiplies every score by its weight, adds them up and divides by the total weight, so the number reflects what actually determines your grade.",
  ],
  steps: [
    "Pick a mode: Course grade (weighted average) or Final grade needed.",
    "For a course grade, add each item with its score (%) and weight (%).",
    "Watch the total weight — for a true final grade it should add up to 100%.",
    "For the final, enter your current grade, target grade and the final's weight.",
    "Read the required final score and the letter grade it maps to.",
  ],
  faq: [
    {
      q: "How is a weighted grade calculated?",
      a: "Multiply each score by its weight, add those products together, then divide by the sum of the weights. For example, 80% (weight 30) and 90% (weight 20) gives (80×30 + 90×20) ÷ 50 = 84%. Weights don't have to total 100% for a grade-in-progress, but they should for your final course grade.",
    },
    {
      q: "What score do I need on my final?",
      a: "Use Final grade needed mode. The formula is (target − current × (1 − finalWeight)) ÷ finalWeight, where finalWeight is the final's share of your grade as a decimal. The calculator does this for you and flags cases where the target is impossible (needs over 100%) or already secured.",
    },
    {
      q: "What letter grade does my percentage equal?",
      a: "This tool uses the common US scale: 93+ is an A, 90–92 A−, 87–89 B+, 83–86 B, 80–82 B−, and so on down to F below 60. Your school's cut-offs may differ slightly, so check your syllabus for the exact thresholds.",
    },
    {
      q: "Can I use it for test or assignment grades?",
      a: "Yes. To grade a single test, enter points earned as the score. To combine several tests and assignments into an overall mark, add each as an item with its weight and read the weighted result.",
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
      <GradeCalculator />
    </CalcShell>
  );
}
