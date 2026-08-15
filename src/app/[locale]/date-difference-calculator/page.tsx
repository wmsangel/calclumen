import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { DateDifferenceCalculator } from "@/components/calculators/date-difference";

const SLUG = "date-difference-calculator";

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
    "This date difference calculator counts how much time falls between two dates. Pick a start date and an end date and it shows the total number of days, the number of weeks, and a full calendar breakdown in years, months and days. It works for spans in the past as well as the future.",
    "Use it to see how many days are left until a deadline, birthday, holiday or due date, or to measure how long ago something happened. If your end date is earlier than your start date the calculator still works — it shows the size of the gap and notes that the dates are reversed.",
  ],
  steps: [
    "Pick the From date, or tap Today to use the current date.",
    "Pick the To date you want to measure to.",
    "Read the total days, weeks and the years / months / days breakdown.",
    "Swap the dates or use Today on either field to measure a different span.",
  ],
  faq: [
    {
      q: "Does the count include the end date?",
      a: "No. The total is the number of whole days between the two dates, so it counts the gap from the start date up to the end date. If you also want to include the final day (for example when counting an event that runs through the end date), add one to the total.",
    },
    {
      q: "How many weeks are between the dates?",
      a: "The calculator divides the total number of days by 7 and shows the result to one decimal place. For example, 30 days is 4.3 weeks. Multiply the whole-week part by 7 to see how many leftover days remain.",
    },
    {
      q: "Does it count business days only?",
      a: "No. This tool counts every calendar day, including weekends and public holidays. To estimate working days, a rough rule is to multiply the number of full weeks by 5, then add the leftover weekdays.",
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
      <DateDifferenceCalculator />
    </CalcShell>
  );
}
