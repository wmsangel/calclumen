import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { AverageCalculator } from "@/components/calculators/average-calculator";

const SLUG = "average-calculator";

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
    "This average calculator takes a list of numbers and reports the three kinds of average at once: the mean, the median and the mode. Paste or type your values separated by commas, spaces or new lines and every statistic recalculates instantly.",
    "The mean is the familiar arithmetic average — the sum divided by how many values there are. The median is the middle value once the numbers are sorted, which is less affected by outliers. The mode is the value that appears most often. Alongside these you also get the count, sum and range so you can sanity-check the data at a glance.",
  ],
  steps: [
    "Type or paste your numbers into the box, separated by commas, spaces or new lines.",
    "The mean, median and mode appear immediately, with count, sum and range below.",
    "Edit the list at any time — every result updates as you type, no button needed.",
  ],
  faq: [
    {
      q: "What is the difference between mean, median and mode?",
      a: "The mean is the sum of all values divided by the count. The median is the middle value when the numbers are sorted. The mode is the value that occurs most frequently. A data set can have one mode, several, or none.",
    },
    {
      q: "How is the median found for an even number of values?",
      a: "Sort the values and take the two in the middle, then average them. For 4, 8, 12, 20 the middle two are 8 and 12, so the median is (8 + 12) ÷ 2 = 10.",
    },
    {
      q: "What does “No mode” mean?",
      a: "It means every value in your list appears exactly once, so no single number occurs more often than the others. If two or more values tie for the highest frequency, all of them are shown.",
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
      <AverageCalculator />
    </CalcShell>
  );
}
