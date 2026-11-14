import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { MortgagePointsCalculator } from "@/components/calculators/mortgage-points";

const SLUG = "mortgage-points-calculator";

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
    "This mortgage points calculator tells you whether paying discount points to lower your interest rate is worth it. A discount point costs 1% of the loan amount and buys a lower rate for the life of the loan — lenders typically cut the rate by around a quarter of a percentage point per point, though the exact trade-off varies, so you enter the two rates your lender quoted.",
    "The calculator compares the monthly payment with and without points and finds the break-even month, when the accumulated monthly savings have paid back the upfront cost. Points only pay off if you keep the loan past that point. Most people sell or refinance well before a 30-year term ends, which is why the result is shown for the number of years you actually expect to keep the loan, not just the full term.",
  ],
  steps: [
    "Enter the loan amount and term.",
    "Enter the interest rate without points and the rate your lender offers with points, plus how many points that costs.",
    "Enter how many years you expect to keep the loan before selling or refinancing.",
    "Read the break-even month, the monthly savings, and whether you come out ahead over the years you keep the loan.",
  ],
  methodology: [
    "One discount point costs 1% of the loan amount and lowers the rate by the amount you enter (commonly 0.25% per point, but it varies by lender and market). The calculator computes the monthly principal-and-interest payment at both rates with the standard amortization formula and takes the difference as your monthly saving.",
    "Break-even months = cost of points ÷ monthly saving. Net after the years you plan to keep the loan = savings over those months minus the points cost; the full-term net does the same over the whole term. Both figures are nominal — a dollar saved in year 20 is counted the same as a dollar paid today.",
    "Not modelled: refinancing before break-even, the time value of money, tax deductibility of points, lender credits (negative points) and changes to taxes, insurance or PMI.",
  ],
  sources: [
    { label: "CFPB — What are discount points and lender credits?", url: "https://www.consumerfinance.gov/ask-cfpb/what-are-discount-points-and-lender-credits-and-how-do-they-work-en-136/" },
    { label: "Freddie Mac — Primary Mortgage Market Survey", url: "https://www.freddiemac.com/pmms" },
  ],
  faq: [
    {
      q: "How much does one mortgage point cost?",
      a: "One discount point costs 1% of the loan amount — $4,000 on a $400,000 loan. Lenders also let you buy fractions of a point. Points are paid at closing, on top of other closing costs.",
    },
    {
      q: "How much does a point lower the rate?",
      a: "Commonly about 0.25 percentage points per point, but it is not fixed: the discount depends on the lender, the loan program and market conditions, and the second point often buys less than the first. Always compare the actual rate sheet rather than assuming 0.25%.",
    },
    {
      q: "When are points a bad idea?",
      a: "When you will not keep the loan past the break-even month — because you plan to move, expect to refinance if rates fall, or need the cash for a bigger down payment instead. Paying points on a loan you refinance two years later simply loses the upfront cost.",
    },
    {
      q: "Are mortgage points tax-deductible?",
      a: "Discount points on a loan to buy or build your main home are generally deductible as mortgage interest in the year paid if you itemize and meet IRS conditions; points on a refinance are usually deducted over the life of the loan. This calculator does not include any tax effect — check IRS Publication 936 or a tax professional.",
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
      <MortgagePointsCalculator />
    </CalcShell>
  );
}
