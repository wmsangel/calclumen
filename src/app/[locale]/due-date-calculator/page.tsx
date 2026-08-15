import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { DueDateCalculator } from "@/components/calculators/due-date";

const SLUG = "due-date-calculator";

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
    "This due date calculator estimates when your baby is likely to arrive using the first day of your last menstrual period. It follows the standard clinical approach of counting 280 days (40 weeks) from that date, and adjusts for cycle lengths that differ from the typical 28 days, so the estimate fits your own rhythm more closely.",
    "Enter an as-of date and the calculator also shows your current gestational age in weeks and days and which trimester you are in. Remember that only a small share of babies arrive exactly on their due date — it marks the middle of a normal range, and your care provider may refine it with an early ultrasound.",
  ],
  steps: [
    "Pick the first day of your last period, or tap Today to use the current date.",
    "Enter your average cycle length in days (28 is typical).",
    "Optionally set an as-of date to see gestational age and trimester.",
    "Read your estimated due date, gestational age, trimester and conception date.",
  ],
  faq: [
    {
      q: "How is the due date calculated?",
      a: "The calculator adds 280 days (40 weeks) to the first day of your last menstrual period, then adjusts for cycle length by adding the difference between your cycle and 28 days. This mirrors the widely used Naegele's rule for estimating a due date.",
    },
    {
      q: "What does gestational age mean?",
      a: "Gestational age counts the time since the first day of your last period, expressed in completed weeks and days. It is usually a couple of weeks more than the actual age of the embryo, because it is measured from before conception occurred.",
    },
    {
      q: "How are trimesters defined here?",
      a: "This tool counts the first trimester through week 13, the second from weeks 14 to 27, and the third from week 28 onward. Definitions vary slightly between sources, so treat the boundaries as approximate rather than exact.",
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
      <DueDateCalculator />
    </CalcShell>
  );
}
