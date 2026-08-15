import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { TimeDurationCalculator } from "@/components/calculators/time-duration-calculator";

const SLUG = "time-duration-calculator";

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
    "This time duration calculator works out how much time passes between a start time and an end time. Enter the two times, subtract any unpaid break, and it shows the duration in hours and minutes, the equivalent in decimal hours, and the total number of minutes. It is built for timesheets, shift logs, billing and any task where you need to turn clock times into a total.",
    "The calculator handles overnight shifts, so if the end time is earlier in the day than the start time it correctly rolls over past midnight. Decimal hours make it easy to multiply by an hourly rate, while the minutes total is useful for precise scheduling.",
  ],
  steps: [
    "Enter the start time using the time picker.",
    "Enter the end time you finished at.",
    "Set the number of unpaid break minutes to subtract.",
    "Turn on overnight shift if the end time is on the next day, then read the totals.",
  ],
  faq: [
    {
      q: "How does the overnight shift option work?",
      a: "When the shift crosses midnight, the end time reads as earlier than the start time. Turning on overnight shift, or simply having an end time earlier than the start, tells the calculator to add a full day to the end time so the duration comes out correct rather than negative.",
    },
    {
      q: "What are decimal hours?",
      a: "Decimal hours express the duration as a single number instead of hours and minutes. For example, eight hours and thirty minutes becomes 8.50 decimal hours. This format is convenient for payroll because you can multiply it directly by an hourly pay rate.",
    },
    {
      q: "How is the break subtracted?",
      a: "The break minutes you enter are removed from the gap between the start and end times before the total is shown. So a nine-to-five span with a thirty minute break returns seven and a half hours. If the break is larger than the worked time the calculator flags that the result is not valid.",
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
      <TimeDurationCalculator />
    </CalcShell>
  );
}
