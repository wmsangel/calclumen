import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { BiweeklyMortgageCalculator } from "@/components/calculators/biweekly-mortgage";

const SLUG = "biweekly-mortgage-calculator";

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
    "This biweekly mortgage calculator shows how much you save by paying half your monthly mortgage payment every two weeks instead of the full amount once a month. Enter your loan amount, interest rate and term, and it compares the two schedules — the biweekly payment, how many years earlier the loan is paid off, and the interest you keep.",
    "The trick is simple: there are 52 weeks in a year, so paying every two weeks means 26 half-payments — the equivalent of 13 monthly payments instead of 12. That one extra payment a year goes straight to principal, which shrinks the balance faster and cuts the total interest, often by tens of thousands over a 30-year loan.",
  ],
  steps: [
    "Enter your mortgage loan amount, interest rate and term.",
    "Read the biweekly payment — half of the normal monthly payment.",
    "See how many years sooner the biweekly plan pays off the loan.",
    "Compare total interest on the monthly plan versus the biweekly plan.",
  ],
  faq: [
    {
      q: "How does a biweekly mortgage save money?",
      a: "Paying half the monthly amount every two weeks produces 26 half-payments — one extra full payment each year. That extra payment reduces principal, so less interest accrues and the loan is repaid several years early. The higher your rate and balance, the bigger the saving.",
    },
    {
      q: "Is biweekly the same as just paying extra?",
      a: "Effectively yes — a biweekly schedule equals paying one extra monthly payment per year, spread across the year. You can get the same result by adding 1/12 of your payment to each monthly payment, without signing up for a formal biweekly program.",
    },
    {
      q: "Are there downsides to a biweekly mortgage?",
      a: "Make sure your lender applies biweekly payments to principal immediately and doesn't hold them or charge a setup fee. Also confirm the extra payments have no prepayment penalty. If a service charges for it, paying a little extra yourself each month achieves the same thing for free.",
    },
    {
      q: "How much can I really save?",
      a: "On a typical 30-year loan it often means paying off around 4–6 years early and saving a large share of the interest, depending on the rate. Enter your own numbers above to see the exact figures — this is an estimate, not financial advice.",
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
      <BiweeklyMortgageCalculator />
    </CalcShell>
  );
}
