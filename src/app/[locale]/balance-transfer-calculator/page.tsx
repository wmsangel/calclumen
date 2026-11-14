import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { BalanceTransferCalculator } from "@/components/calculators/balance-transfer";

const SLUG = "balance-transfer-calculator";

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
    "This balance transfer calculator tells you whether moving a credit-card balance to a card with a 0% (or low) promotional APR will actually save money once the transfer fee is counted. It runs two scenarios side by side with the same monthly payment: keep paying the balance at your current APR, or transfer it, pay the fee, enjoy the promo rate for the promo period, and then pay the new card's regular APR on whatever is left.",
    "The key number is whether you can clear the transferred balance before the promo ends. If you can, the fee is the only cost and the saving is usually large; if you cannot, interest at the regular rate starts again on the remainder, and a long payoff can eat the benefit. Interest is accrued monthly at APR ÷ 12 on the outstanding balance, the standard simplified model for card interest.",
  ],
  steps: [
    "Enter your current balance, the card's APR and the monthly payment you can afford.",
    "Enter the transfer offer: the fee (usually 3–5% of the balance), the promo APR and how many months it lasts, and the card's regular APR afterwards.",
    "Read the verdict, how long each option takes to pay off, and the payment needed to clear the balance within the promo window.",
  ],
  methodology: [
    "Both scenarios use the standard card model: each month the balance accrues interest at APR ÷ 12, then your payment is applied. In the stay scenario the current APR runs until the balance is cleared. In the transfer scenario the transfer fee is added to the balance, the promotional APR applies for the promo months and the card's regular APR applies to whatever is left.",
    "Savings is the stay scenario's total interest minus the transfer scenario's interest plus fee. The payment to clear in promo is the balance plus fee divided by the promo months (at 0%), or the equivalent amortized payment at a non-zero promo rate.",
    "Not modelled: a missed payment ending the promo early, interest on new purchases, deferred-interest terms, minimum-payment rules and the fee cap some issuers apply. Regulation Z requires issuers to disclose the promo rate, its end date and the go-to rate; check your offer against those terms.",
  ],
  sources: [
    { label: "CFPB — Credit cards: understanding your rights and costs", url: "https://www.consumerfinance.gov/consumer-tools/credit-cards/" },
    { label: "12 CFR Part 1026 (Regulation Z) — Truth in Lending", url: "https://www.ecfr.gov/current/title-12/chapter-X/part-1026" },
  ],
  faq: [
    {
      q: "Is a balance transfer worth it if there is a 3% fee?",
      a: "Usually yes when the balance is large, the current APR is high and you can pay most of it off during the promo. On a $5,000 balance at 24% APR, a 3% fee is $150, while a year of interest at 24% is roughly $1,000 — so the fee is small compared with the interest avoided. The calculator shows the exact comparison for your numbers.",
    },
    {
      q: "What happens when the promo period ends?",
      a: "Any remaining balance starts accruing interest at the card's regular APR, which is often as high as the card you left. That is why the “payment to clear in promo” figure matters: paying at least that much each month means you never pay interest on the transferred balance.",
    },
    {
      q: "Can I lose the 0% rate?",
      a: "Yes. Most issuers cancel the promotional APR if you miss a payment, and new purchases on the card may accrue interest immediately at the regular rate. The model assumes on-time payments and no new spending on the card.",
    },
    {
      q: "Does a balance transfer hurt my credit score?",
      a: "Applying for the new card adds a hard inquiry and a new account, which can dip the score briefly; paying the balance down faster lowers your credit utilization, which tends to help over time. This calculator only covers the money side, not scoring.",
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
      <BalanceTransferCalculator />
    </CalcShell>
  );
}
