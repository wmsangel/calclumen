import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { TimesheetCalculator } from "@/components/calculators/timesheet";

const SLUG = "timesheet-calculator";

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
    "This timesheet calculator adds up a full week of work hours from your clock-in and clock-out times. Enter a start and end time for each day, subtract any unpaid break in minutes, and it converts the messy hours-and-minutes into clean decimal hours and a weekly total. Add your hourly rate and it also works out your gross pay.",
    "It handles the two things people most often get wrong by hand: breaks and overnight shifts. Unpaid breaks are deducted per day, and a shift that runs past midnight (for example 22:00 to 06:00) is counted correctly rather than coming out negative. Turn on the overtime option to split anything over 40 hours a week into overtime paid at 1.5×.",
  ],
  steps: [
    "For each day you worked, enter the start time and end time.",
    "Add any unpaid break in minutes — it's subtracted from that day's hours.",
    "Leave days off blank; they simply count as zero hours.",
    "Enter your hourly rate and currency to see gross pay.",
    "Keep 'Overtime over 40 h/week' on to pay hours above 40 at time-and-a-half.",
  ],
  faq: [
    {
      q: "How are hours and minutes turned into decimal hours?",
      a: "The calculator converts each time to minutes, finds the difference, subtracts your break, then divides by 60. So 8 hours 30 minutes becomes 8.50 hours. Decimal hours are what you multiply by an hourly rate to get pay — 8.5 × $20 = $170.",
    },
    {
      q: "Does it handle overnight shifts?",
      a: "Yes. If the end time is earlier than the start time (for example a shift from 22:00 to 06:00), the calculator assumes it crossed midnight and adds 24 hours, giving 8 hours rather than a negative number.",
    },
    {
      q: "How is overtime calculated?",
      a: "With the overtime option on, the first 40 hours in the week are paid at your normal rate and every hour beyond 40 is paid at 1.5× (time-and-a-half). This mirrors the common US FLSA rule, but overtime laws vary by country and state — check your local rules and employment contract.",
    },
    {
      q: "Should I include breaks?",
      a: "Only include unpaid breaks — enter their length in minutes so they're deducted. If your breaks are paid, leave the break field at 0 so those minutes stay in your total. This is an estimate for your own tracking, not official payroll.",
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
      <TimesheetCalculator />
    </CalcShell>
  );
}
