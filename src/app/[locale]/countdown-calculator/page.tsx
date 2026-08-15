import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { CountdownCalculator } from "@/components/calculators/countdown-calculator";

const SLUG = "countdown-calculator";

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
    "This countdown calculator shows how long is left until a date that matters to you. Give your event a name, pick the target date and the date you are counting from, and it tells you the number of days remaining, the number of weeks, and a full breakdown in years, months and days. It is perfect for holidays, weddings, launches, exams and deadlines.",
    "If the target date has already passed, the calculator does not break — it flips the count around and tells you how many days ago the event was. That makes it just as useful for tracking how long ago something happened as for counting down to something ahead.",
  ],
  steps: [
    "Type a name for the event you are counting to, such as a birthday or a launch.",
    "Pick the target date, or tap Today to set it to the current day.",
    "Pick the date you are counting from, or tap Today to count from now.",
    "Read the days remaining, the weeks and the years / months / days breakdown.",
  ],
  faq: [
    {
      q: "How are the days remaining counted?",
      a: "The calculator takes the difference between the target date and the from date and rounds up to whole days, so a date later today still counts as a full day away. If the target is in the past it shows the same number of days with an 'ago' label instead of counting down.",
    },
    {
      q: "What happens if my target date is in the past?",
      a: "It still works. Rather than showing a negative number, the tool shows how many days, weeks and calendar months and years have passed since the event, labelled as 'ago'. That way the same calculator handles both future countdowns and past anniversaries.",
    },
    {
      q: "Can I count down from a date other than today?",
      a: "Yes. The from date is a separate field, so you can measure the gap between any two dates. Tap Today on the from field whenever you want a live countdown from the current day, or pick a specific date to plan around.",
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
      <CountdownCalculator />
    </CalcShell>
  );
}
