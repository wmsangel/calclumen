import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { InflationCalculator } from "@/components/calculators/inflation";

const SLUG = "inflation-calculator";

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
    "This inflation calculator shows how the value of money changes over time. Switch to 'Future value' to see what a given amount will grow to at a steady inflation rate, or 'Buying power' to see what today's money will actually be worth after inflation erodes it.",
    "The calculation compounds the annual inflation rate over the number of years you choose. A few percent a year seems small, but compounded over a decade or more it makes a large difference — which is why the total change and percentage change are shown alongside the adjusted amount.",
  ],
  steps: [
    "Choose 'Future value' to grow an amount, or 'Buying power' to discount it.",
    "Enter the amount and select your currency.",
    "Set the annual inflation rate and the number of years.",
    "Read the adjusted amount, the total change and the percentage change.",
  ],
  faq: [
    {
      q: "What is the difference between future value and buying power?",
      a: "Future value multiplies your amount by the inflation factor — it is how much you would need in the future to match today's cost. Buying power divides by the factor — it is how much today's money is really worth after inflation.",
    },
    {
      q: "How is inflation compounded?",
      a: "The calculator uses factor = (1 + rate)^years, so each year's inflation applies on top of the previous year's, the same way compound interest works.",
    },
    {
      q: "What inflation rate should I use?",
      a: "Long-run inflation in many developed economies has averaged around 2–3% per year, but it varies by country and period. Use a rate that reflects your own situation or an official long-term average.",
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
      <InflationCalculator />
    </CalcShell>
  );
}
