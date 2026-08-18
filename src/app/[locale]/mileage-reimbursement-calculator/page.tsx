import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { MileageReimbursementCalculator } from "@/components/calculators/mileage-reimbursement";

const SLUG = "mileage-reimbursement-calculator";

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
    "This mileage reimbursement calculator works out how much you can claim for driving, based on the miles you covered and the rate per mile. Choose the purpose of your trip to load the standard rate, or enter a custom rate if your organization uses a different figure.",
    "The preset rates are the 2024 US IRS standard mileage rates: 67 cents per mile for business, 21 cents for medical or moving, and 14 cents for charity. Your reimbursement is simply the miles driven multiplied by the rate per mile.",
  ],
  steps: [
    "Enter the total miles driven and choose your currency.",
    "Pick the purpose of the trip to load the matching standard rate.",
    "Choose Custom and type your own rate if your organization uses a different one.",
    "Read your reimbursement, the rate per mile and the miles used in the calculation.",
  ],
  faq: [
    {
      q: "What are the 2024 IRS mileage rates?",
      a: "For 2024 the US IRS standard rates are 67 cents per mile for business use, 21 cents per mile for medical or moving purposes, and 14 cents per mile for charitable driving.",
    },
    {
      q: "How is mileage reimbursement calculated?",
      a: "Multiply the number of miles driven by the rate per mile. For example, 100 business miles at $0.67 per mile is $67.",
    },
    {
      q: "Can I use a different rate?",
      a: "Yes. Select Custom and enter any rate per mile your employer or organization uses instead of the IRS standard rate.",
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
      <MileageReimbursementCalculator />
    </CalcShell>
  );
}
