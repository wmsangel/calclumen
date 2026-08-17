import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { PaycheckCalculator } from "@/components/calculators/paycheck";

const SLUG = "paycheck-calculator";

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
    "This paycheck calculator estimates your take-home pay from a gross annual salary. Enter your salary, how often you are paid, your retirement contribution and an estimated income tax rate, and it works out what actually lands in your bank account each pay period.",
    "It subtracts pre-tax retirement contributions, FICA payroll taxes, and estimated income tax from your gross pay. The result is your net annual pay and your take-home amount per paycheck, so you can see the real effect of a raise, a new job or a change in your 401(k) contribution.",
  ],
  steps: [
    "Enter your gross annual salary before any deductions.",
    "Choose how often you are paid — weekly, biweekly, semi-monthly or monthly.",
    "Set your retirement contribution as a percentage of gross pay.",
    "Enter an estimated combined federal and state income tax rate to see your take-home pay.",
  ],
  faq: [
    {
      q: "What is FICA and how much is it?",
      a: "FICA is the payroll tax that funds Social Security and Medicare. It totals 7.65% of gross pay — 6.2% for Social Security and 1.45% for Medicare — and is applied here to your full salary.",
    },
    {
      q: "How is take-home pay calculated?",
      a: "Retirement contributions and FICA are subtracted from gross pay, income tax is applied to the amount after retirement contributions, and the remainder is divided by the number of pay periods in the year.",
    },
    {
      q: "Is this an exact figure?",
      a: "No, it is an estimate. Actual paychecks depend on your specific tax withholding, benefits, local taxes and other deductions, so treat the result as a close approximation rather than an exact net pay.",
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
      <PaycheckCalculator />
    </CalcShell>
  );
}
