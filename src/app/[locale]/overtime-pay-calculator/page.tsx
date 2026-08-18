import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { OvertimePayCalculator } from "@/components/calculators/overtime-pay";

const SLUG = "overtime-pay-calculator";

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
    "This overtime pay calculator works out your total pay for a week that includes overtime hours. Enter your regular hourly rate, the number of regular hours you worked, the number of overtime hours and the overtime multiplier your employer uses — 1.5 for the common time-and-a-half rate or 2 for double time.",
    "Overtime pay is your hourly rate multiplied by the overtime multiplier, and that higher rate is then applied to each overtime hour. Your regular pay is the standard rate times your regular hours, and your total pay is the two amounts added together. Adjusting the multiplier or the number of overtime hours shows how much your paycheck changes.",
  ],
  steps: [
    "Enter your regular hourly rate and choose your currency.",
    "Type the number of regular hours you worked in the period.",
    "Type the number of overtime hours and set the overtime multiplier (1.5 for time-and-a-half).",
    "Read your total pay, regular pay, overtime pay and the effective overtime rate per hour.",
  ],
  faq: [
    {
      q: "How is overtime pay calculated?",
      a: "Overtime pay equals your hourly rate multiplied by the overtime multiplier, applied to each overtime hour. For example, $20/hr at a 1.5 multiplier gives an overtime rate of $30/hr, so 5 overtime hours pay $150.",
    },
    {
      q: "What is time-and-a-half?",
      a: "Time-and-a-half means a 1.5 overtime multiplier — you earn 1.5 times your normal hourly rate for each overtime hour. Double time uses a multiplier of 2.",
    },
    {
      q: "Does this include taxes or deductions?",
      a: "No. This shows gross pay before tax, benefits and other deductions. Your take-home pay will be lower once those are withheld.",
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
      <OvertimePayCalculator />
    </CalcShell>
  );
}
