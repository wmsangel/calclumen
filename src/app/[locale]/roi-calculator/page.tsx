import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { RoiCalculator } from "@/components/calculators/roi";

const SLUG = "roi-calculator";

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
    "This ROI calculator measures the return on an investment as a percentage of the amount you put in. Enter what you invested, what you got back and how long the money was invested, and it works out your total return, your net profit and an annualized return you can compare against other opportunities.",
    "Return on investment (ROI) is the simplest way to judge whether an investment paid off. Because a 30% gain over one year is very different from 30% over five years, the calculator also shows the annualized ROI, which spreads the total return evenly across each year for a fair, time-adjusted comparison.",
  ],
  steps: [
    "Enter the amount you invested and choose your currency.",
    "Enter the total amount you received back.",
    "Set how many years the money was invested.",
    "Read your ROI percentage, net profit and annualized ROI.",
  ],
  faq: [
    {
      q: "How is ROI calculated?",
      a: "ROI is the net profit divided by the amount invested, expressed as a percentage: ROI = (amount returned − amount invested) ÷ amount invested × 100. A result of 30% means you earned 30 cents for every dollar invested.",
    },
    {
      q: "What is annualized ROI?",
      a: "Annualized ROI converts your total return into an equivalent yearly rate, using the formula (amount returned ÷ amount invested)^(1 ÷ years) − 1. It lets you compare investments held for different lengths of time on an equal footing.",
    },
    {
      q: "Can ROI be negative?",
      a: "Yes. If the amount returned is less than the amount invested, both the net profit and the ROI are negative, showing that the investment lost money.",
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
      <RoiCalculator />
    </CalcShell>
  );
}
