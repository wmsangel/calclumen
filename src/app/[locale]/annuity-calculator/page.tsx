import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { AnnuityCalculator } from "@/components/calculators/annuity";

const SLUG = "annuity-calculator";

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
    "An annuity is simply a series of equal payments made at regular intervals — monthly deposits into a retirement account, a pension paying you every month, or the payments on a structured settlement. This calculator values that stream both ways: the future value (what your payments grow to with interest) and the present value (the lump sum you'd need today to fund the same payments).",
    "Two settings change the answer. The payment frequency sets how often money goes in and how often interest compounds. And timing matters: in an ordinary annuity payments land at the end of each period, while in an annuity due they land at the start, so every payment earns one extra period of interest. Rent and insurance premiums are annuities due; most loan and savings payments are ordinary annuities.",
  ],
  steps: [
    "Enter the payment made each period and pick your currency.",
    "Enter the annual interest rate (expected return or discount rate) and the term in years.",
    "Choose how often payments are made — monthly, quarterly or yearly.",
    "Pick ordinary annuity (end of period) or annuity due (start of period).",
    "Read the future value, present value, total paid and interest earned; the chart shows the balance growing year by year.",
  ],
  faq: [
    {
      q: "What's the difference between present value and future value of an annuity?",
      a: "Future value is how much a series of payments will be worth at the end of the term once interest has compounded on them. Present value works backwards: it's the single amount you'd need today, invested at the same rate, to produce exactly those payments. Use FV to plan savings and PV to value a pension, lottery payout or settlement.",
    },
    {
      q: "What is the annuity formula?",
      a: "With a periodic rate r and n payments of PMT, the future value is PMT × ((1 + r)^n − 1) / r and the present value is PMT × (1 − (1 + r)^−n) / r. For an annuity due, multiply either result by (1 + r), because each payment earns one more period of interest.",
    },
    {
      q: "Ordinary annuity vs annuity due — which should I use?",
      a: "If payments happen at the end of each period — most savings plans, loan payments and bond coupons — use an ordinary annuity. If they happen at the start — rent, insurance premiums, many lease payments — use an annuity due. The annuity due is always worth slightly more because the money is in place one period sooner.",
    },
    {
      q: "How much does $500 a month grow to in 20 years?",
      a: "At a 6% annual return compounded monthly, $500 paid at the end of each month for 20 years grows to about $231,020. You'd have paid in $120,000, so roughly $111,000 of the balance is interest. The same stream is worth about $69,790 in today's money (its present value).",
    },
    {
      q: "Is this the same as an insurance annuity product?",
      a: "It uses the same math, but commercial annuities also carry fees, surrender charges, mortality credits and rates set by the insurer. Use this calculator to understand the time value of a payment stream and to sanity-check a quote, not as a quote itself.",
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
      <AnnuityCalculator />
    </CalcShell>
  );
}
