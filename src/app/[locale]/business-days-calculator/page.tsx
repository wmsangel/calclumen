import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { BusinessDaysCalculator } from "@/components/calculators/business-days-calculator";

const SLUG = "business-days-calculator";

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
    "This business days calculator counts the working days between two dates, skipping every Saturday and Sunday. Pick a start date and an end date and it returns the number of business days, how many weekend days fall in the range, and the total number of calendar days. It is handy for estimating project timelines, delivery windows, notice periods and payroll ranges.",
    "You can choose whether the start day itself is included in the count, which matters when you are measuring a period that begins on the day work starts versus the day after. Note that public holidays are not subtracted, so in regions with many holidays you may want to deduct those separately.",
  ],
  steps: [
    "Pick the start date, or tap Today to begin from the current day.",
    "Pick the end date you want to count through.",
    "Choose whether to include the start day in the total.",
    "Read the business days, weekend days and total calendar days.",
  ],
  faq: [
    {
      q: "Which days count as business days?",
      a: "Monday through Friday are counted as business days, while Saturday and Sunday are treated as weekend days and excluded. The calculator walks through every date in the range and adds up only the weekdays, so the count is exact rather than an estimate.",
    },
    {
      q: "Are public holidays excluded?",
      a: "No. This tool only removes weekends, not national or regional public holidays, because those vary widely by country and state. If your range includes holidays that your workplace observes, subtract them from the business days total to get your net working days.",
    },
    {
      q: "What does 'include start day' do?",
      a: "When set to Yes, the start date is counted as the first day if it falls on a weekday. When set to No, counting begins the day after the start date. Use No when the start date marks the moment a clock begins and the first full working day comes afterwards.",
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
      <BusinessDaysCalculator />
    </CalcShell>
  );
}
