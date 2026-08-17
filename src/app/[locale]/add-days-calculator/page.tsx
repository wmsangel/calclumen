import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { AddDaysCalculator } from "@/components/calculators/add-days-calculator";

const SLUG = "add-days-calculator";

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
    "Working out a date a fixed span in the future or past is easy to get wrong by hand, because months have different lengths and leap years add a day. This calculator does the counting for you: pick a start date, choose whether to add or subtract, and enter any mix of days, weeks, months and years to land on the exact resulting date.",
    "It is handy for deadlines, contract terms, delivery windows, warranty periods, appointment scheduling and any 'X days from now' question. Alongside the new date it shows the day of the week it falls on and the total number of days shifted, so you can see at a glance how far the result is from where you started.",
  ],
  steps: [
    "Choose a start date, or tap Today to use the current date.",
    "Select whether to add or subtract time.",
    "Enter the number of days, weeks, months and years to shift.",
    "Read the resulting date, its day of the week and the total days shifted.",
  ],
  faq: [
    {
      q: "How does adding months and years work?",
      a: "Years and months are applied by calendar, so adding one month to January 15 gives February 15. When the target month is shorter, the date rolls to the nearest valid day. Days and weeks are then added on top, with one week counted as seven days.",
    },
    {
      q: "Does the calculator account for leap years?",
      a: "Yes. It uses the calendar to shift dates, so February 29 in leap years and the extra day are handled automatically. That is why the total days shifted can vary slightly between spans that cover a leap day versus those that do not.",
    },
    {
      q: "What is the difference between the result date and total days shifted?",
      a: "The result date is where you land after applying the years, months, weeks and days. The total days shifted is the plain count of days between your start date and that result — useful when a mix of months and years makes the overall gap hard to picture.",
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
      <AddDaysCalculator />
    </CalcShell>
  );
}
