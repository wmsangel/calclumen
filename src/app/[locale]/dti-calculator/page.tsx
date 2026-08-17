import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { DtiCalculator } from "@/components/calculators/dti";

const SLUG = "dti-calculator";

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
    "Your debt-to-income ratio, or DTI, compares how much you owe each month to how much you earn before tax. Lenders lean on it heavily when deciding whether to approve a mortgage or loan, because it shows how much room you have in your budget to take on a new payment. A lower ratio signals that your debts are comfortably within your means; a higher one suggests you may be stretched.",
    "There are two versions. The front-end ratio looks only at housing costs — your rent or mortgage payment — as a share of income. The back-end ratio, the one most lenders focus on, adds every other monthly debt such as car loans, student loans and minimum credit card payments. As a rough guide, a back-end DTI at or below 36% is considered healthy, 37–43% is manageable, and above 43% is high and can make borrowing harder.",
  ],
  steps: [
    "Enter your gross monthly income — what you earn before tax and deductions.",
    "Enter your monthly housing payment, including rent or mortgage, taxes and insurance.",
    "Enter your other monthly debt payments, such as loans and minimum card payments.",
    "Read your DTI ratio, front-end ratio and the category lenders would place you in.",
  ],
  faq: [
    {
      q: "What is a good debt-to-income ratio?",
      a: "As a general rule, a back-end DTI of 36% or below is considered healthy, 37% to 43% is manageable, and above 43% is high. Many mortgage lenders prefer a ratio at or under 43%, though the exact limits vary by lender and loan type.",
    },
    {
      q: "What is the difference between front-end and back-end DTI?",
      a: "The front-end ratio counts only your housing payment as a percentage of gross income. The back-end ratio adds all your other monthly debts, such as car and student loans and credit card minimums. Lenders usually focus on the back-end ratio because it reflects your total obligations.",
    },
    {
      q: "Should I use gross or net income for DTI?",
      a: "DTI uses gross income — your pay before taxes and deductions — because that is the figure lenders work from. Enter your monthly income before anything is taken out, so the ratio matches how a lender would calculate it.",
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
      <DtiCalculator />
    </CalcShell>
  );
}
