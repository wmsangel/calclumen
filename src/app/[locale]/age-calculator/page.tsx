import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { AgeCalculator } from "@/components/calculators/age-calculator";

const SLUG = "age-calculator";

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
    "This age calculator works out exactly how old someone is on any date you choose. Enter a date of birth and the date you want to measure to, and it breaks the age down into years, months and days, along with the total number of days, weeks and months lived. It handles leap years and varying month lengths so the count is accurate.",
    "Beyond a simple age in years, the calculator also tells you which day of the week a person was born on and how many days remain until their next birthday. Use it for birthdays, eligibility checks, anniversaries or any time you need a precise age rather than a rounded number.",
  ],
  steps: [
    "Pick the date of birth, or tap Today if you are measuring from the current day.",
    "Pick the date you want the age calculated at, or tap Today for the age right now.",
    "Read the age in years, months and days, plus the totals in days, weeks and months.",
    "Check the day of the week born and how many days are left until the next birthday.",
  ],
  faq: [
    {
      q: "How is the age in years, months and days calculated?",
      a: "The calculator subtracts the birth date from the chosen date, then borrows across months and years the same way you would by hand. If the day of the month has not been reached yet it borrows days from the previous month, and if the month has not been reached it borrows twelve months from the year. This gives a true calendar age rather than a rounded figure.",
    },
    {
      q: "Does it account for leap years?",
      a: "Yes. The total days count is based on the actual number of calendar days between the two dates, so leap days are included automatically. The years, months and days breakdown also uses real month lengths, so someone born on 29 February is handled correctly.",
    },
    {
      q: "Why do I need to pick the second date?",
      a: "So the tool can measure age at any point in time, not just today. Leave both dates for you to choose and tap Today on the second field whenever you want the current age. This makes it easy to check how old someone was on a past event or will be on a future one.",
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
      <AgeCalculator />
    </CalcShell>
  );
}
