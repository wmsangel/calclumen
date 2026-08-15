import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { DebtPayoffCalculator } from "@/components/calculators/debt-payoff";

const SLUG = "debt-payoff-calculator";

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
    "This debt payoff calculator shows how quickly you can become debt-free when you commit an extra amount to your balances each month. List every debt with its balance, interest rate (APR) and minimum payment, add how much extra you can pay, and choose a payoff strategy. The calculator simulates each month until every balance reaches zero.",
    "Two popular strategies are supported. The snowball method targets the smallest balance first for quick wins and motivation, while the avalanche method targets the highest APR first to minimise the total interest you pay. As each debt is cleared, its freed-up minimum payment rolls into the next debt, accelerating your progress.",
  ],
  steps: [
    "Enter each debt's balance, APR and minimum payment, adding or removing rows as needed.",
    "Type the extra amount you can put toward your debts every month and pick your currency.",
    "Choose the Snowball or Avalanche strategy.",
    "Read how many months until you are debt-free, plus the total interest and total amount paid.",
  ],
  faq: [
    {
      q: "What is the difference between the snowball and avalanche methods?",
      a: "The snowball method pays off the smallest balance first, giving you quick psychological wins. The avalanche method pays off the highest-APR debt first, which usually costs you the least interest overall. Both roll each cleared debt's payment into the next debt.",
    },
    {
      q: "Why does it say my payments are too low?",
      a: "If the interest added each month is larger than what you are paying, a balance never shrinks. Increase the minimum payments or the extra monthly amount so that total payments exceed the monthly interest, and the calculator will find a payoff date.",
    },
    {
      q: "Does the extra payment go to one debt or all of them?",
      a: "Every debt receives its minimum payment first. The extra amount, plus any minimums freed by cleared debts, is then applied to the single highest-priority debt for your chosen strategy, with any overflow rolling to the next debt.",
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
      <DebtPayoffCalculator />
    </CalcShell>
  );
}
