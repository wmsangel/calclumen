import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { DebtConsolidationCalculator } from "@/components/calculators/debt-consolidation";

const SLUG = "debt-consolidation-calculator";

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
    "This debt consolidation calculator shows whether combining several debts into a single loan would lower your interest and monthly payment. Enter each debt's balance and interest rate, then the rate and term of the consolidation loan you're considering, and it compares the two side by side.",
    "Consolidation replaces several balances — often high-interest credit cards — with one fixed-rate personal loan. The win comes from a lower rate: paying the same total balance at a lower APR over the same term means less interest and, usually, a smaller monthly payment. The calculator works out your current balance-weighted average rate and shows exactly how much interest a lower rate would save.",
  ],
  steps: [
    "Enter the balance and APR of each debt you want to consolidate (add as many as you need).",
    "Enter the interest rate and term of the new consolidation loan.",
    "Read the new monthly payment, total interest and your current average rate.",
    "Check the interest saved (or added) versus keeping your debts at today's average rate.",
  ],
  faq: [
    {
      q: "What is debt consolidation?",
      a: "Debt consolidation combines multiple debts into a single loan with one monthly payment. It's most useful when the new loan's rate is lower than the average rate on your existing debts — commonly used to replace high-interest credit cards with a fixed-rate personal loan.",
    },
    {
      q: "Does consolidating save money?",
      a: "Only if the new rate is lower than your current balance-weighted average rate. At a lower rate over the same term you pay less interest and usually a smaller monthly payment. Watch for origination fees and don't stretch the term so long that a lower payment ends up costing more interest overall.",
    },
    {
      q: "How is the current average rate calculated?",
      a: "It's a balance-weighted average: each debt's rate is weighted by its balance, so a large high-rate balance moves the average more than a small one. That's the fair rate to compare a single consolidation loan against.",
    },
    {
      q: "Will consolidating hurt my credit?",
      a: "Applying may cause a small temporary dip from the hard inquiry, but paying down revolving credit-card balances can help your utilization over time. Many lenders let you check your rate with a soft pull that doesn't affect your score. This tool is an estimate, not financial advice.",
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
      <DebtConsolidationCalculator />
    </CalcShell>
  );
}
