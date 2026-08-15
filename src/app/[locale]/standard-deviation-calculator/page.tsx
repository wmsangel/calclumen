import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { StandardDeviationCalculator } from "@/components/calculators/standard-deviation";

const SLUG = "standard-deviation-calculator";

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
    "This standard deviation calculator measures how spread out a set of numbers is around their mean. Paste or type your values separated by commas, spaces, or new lines, choose whether the data is a sample or a whole population, and it returns the standard deviation, variance, mean, and a few supporting statistics.",
    "Standard deviation is the square root of the variance, which is the average of the squared distances from the mean. The sample version divides by one less than the count to correct for estimating from a subset, while the population version divides by the full count. Use “Sample” when your numbers are a subset of a larger group and “Population” when they are the complete set.",
  ],
  steps: [
    "Choose “Sample” or “Population” depending on what your data represents.",
    "Enter your numbers separated by commas, spaces, or line breaks.",
    "Read the standard deviation, variance, and mean below.",
    "Check the count, sum, and range for a quick sanity check on your data.",
  ],
  faq: [
    {
      q: "What's the difference between sample and population standard deviation?",
      a: "Sample standard deviation divides the sum of squared differences by N − 1, while population standard deviation divides by N. Use the sample version when your numbers are a sample drawn from a larger group, and the population version when they represent the entire group.",
    },
    {
      q: "How is standard deviation calculated?",
      a: "Find the mean, subtract it from each value and square the result, add those squared differences, divide by N − 1 (sample) or N (population) to get the variance, then take the square root. The square root brings the measure back to the original units.",
    },
    {
      q: "Why does sample standard deviation need at least two numbers?",
      a: "The sample formula divides by N − 1, so a single value would mean dividing by zero. At least two data points are required for the calculation to be defined.",
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
      <StandardDeviationCalculator />
    </CalcShell>
  );
}
