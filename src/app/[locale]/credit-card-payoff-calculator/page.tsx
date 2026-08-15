import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { CreditCardPayoffCalculator } from "@/components/calculators/credit-card-payoff";

const SLUG = "credit-card-payoff-calculator";

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
    "This credit card payoff calculator tells you how long it will take to clear your balance and how much interest it will cost. Switch between two modes: enter a fixed monthly payment to see how many months it takes to reach zero, or set a target number of months to see the payment required to hit that deadline.",
    "Credit card interest compounds on the balance every month, so a large share of a small payment can go straight to interest rather than reducing what you owe. Paying more than the minimum each month shortens the payoff dramatically and cuts the total interest, which is why seeing the numbers side by side helps you choose a payment you can stick to.",
  ],
  steps: [
    "Choose “Fixed payment” to test a set monthly amount, or “Target months” to hit a deadline.",
    "Enter your current balance and the card's APR.",
    "In fixed mode, enter the monthly payment; in target mode, enter the number of months.",
    "Read the payoff time or required payment, along with the total interest and total paid.",
  ],
  faq: [
    {
      q: "Why does it say my payment is too low to cover interest?",
      a: "If your monthly payment is smaller than the interest charged that month, the balance grows instead of shrinking and the card is never paid off. You need to pay more than the monthly interest — balance times APR divided by 12 — to make progress.",
    },
    {
      q: "How much faster is paying more than the minimum?",
      a: "Because interest compounds on the remaining balance, even a modest increase in your monthly payment can cut months or years off the payoff time and save a large amount of interest. Try raising the payment to see the effect.",
    },
    {
      q: "Does this assume I stop using the card?",
      a: "Yes. The calculation assumes no new purchases are added to the balance. Any new spending increases the balance and extends the payoff time beyond what is shown here.",
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
      <CreditCardPayoffCalculator />
    </CalcShell>
  );
}
