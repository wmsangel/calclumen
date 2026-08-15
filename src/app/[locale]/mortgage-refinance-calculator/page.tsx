import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { MortgageRefinanceCalculator } from "@/components/calculators/mortgage-refinance";

const SLUG = "mortgage-refinance-calculator";

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
    "This mortgage refinance calculator shows whether replacing your current home loan with a new one is worth the cost. It compares your existing monthly payment with the payment on a new loan, then tells you how much you save each month, how long it takes to recover the closing costs, and how much interest you save over the life of the loan.",
    "Refinancing lowers your payment when the new rate is below your current one, but it is only worthwhile if you keep the loan long enough to recoup the upfront closing costs. The break-even point is the number of months of savings it takes to pay back those costs. You can also roll the closing costs into the new loan balance instead of paying them out of pocket.",
  ],
  steps: [
    "Enter your current loan balance, rate and the number of months remaining.",
    "Enter the new rate and new term you are being offered, plus the closing costs.",
    "Optionally tick “Roll closing costs into loan” to finance the costs instead of paying them upfront.",
    "Read your new payment, monthly savings, break-even point and total interest saved.",
  ],
  faq: [
    {
      q: "What is the break-even point on a refinance?",
      a: "It is the number of months it takes for your monthly savings to add up to the closing costs. If closing costs are $4,000 and you save $200 a month, you break even after 20 months. If you plan to keep the home past that point, refinancing pays off.",
    },
    {
      q: "Should I roll closing costs into the new loan?",
      a: "Rolling costs into the loan avoids paying cash upfront, but it increases the balance you borrow and the interest you pay over time. Paying costs out of pocket keeps the loan smaller and usually saves more in the long run.",
    },
    {
      q: "Why might refinancing show no savings?",
      a: "If the new rate and term produce a monthly payment equal to or higher than your current one, there are no monthly savings and no break-even point. Extending the term can lower the payment but raise total interest, so always check the lifetime interest figure too.",
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
      <MortgageRefinanceCalculator />
    </CalcShell>
  );
}
