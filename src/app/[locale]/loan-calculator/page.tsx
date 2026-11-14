import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { LoanCalculator } from "@/components/calculators/loan";

const SLUG = "loan-calculator";

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
    "This loan calculator works out the monthly payment on any fixed-rate loan or mortgage, along with the total interest you will pay and the total cost over the life of the loan. Enter the amount you are borrowing, the annual interest rate (APR) and the term in years.",
    "The monthly payment is calculated with the standard amortization formula. Early payments are mostly interest and later payments are mostly principal, but the amount you pay each month stays the same for a fixed-rate loan. Lowering the rate or shortening the term both reduce the total interest.",
  ],
  steps: [
    "Enter the loan amount and choose your currency.",
    "Type the annual interest rate (APR) as a percentage.",
    "Set the term in years — 30 for a typical mortgage, 5 for a car loan.",
    "Read your monthly payment, total interest and total cost.",
  ],
  methodology: [
    "The payment comes from the standard amortization formula for a fixed-rate, fully amortizing loan: payment = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1), where P is the amount borrowed, r the annual rate divided by 12 and n the number of monthly payments. At 0% the payment is simply P ÷ n.",
    "Total interest is the sum of all payments minus the principal. The schedule shows, for every month, how much of the payment is interest (balance × r) and how much reduces the balance, so you can see the balance at any point.",
    "Not modelled: origination fees and other costs (use the APR calculator to include them), variable rates, fees for late or early payment, and balloon or interest-only structures.",
  ],
  sources: [
    { label: "CFPB — What is the difference between a loan interest rate and the APR?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-loan-interest-rate-and-the-apr-en-135/" },
    { label: "12 CFR Part 1026 (Regulation Z) — Truth in Lending", url: "https://www.ecfr.gov/current/title-12/chapter-X/part-1026" },
  ],
  faq: [
    {
      q: "How is the monthly loan payment calculated?",
      a: "It uses the amortization formula M = P·r·(1+r)ⁿ ÷ ((1+r)ⁿ − 1), where P is the principal, r is the monthly interest rate (APR ÷ 12 ÷ 100) and n is the number of monthly payments. For a 0% loan it is simply the principal divided by the number of months.",
    },
    {
      q: "Does this include taxes, insurance or fees?",
      a: "No. It calculates principal and interest only. For a full mortgage payment you would add property tax, homeowners insurance and any HOA or PMI amounts on top.",
    },
    {
      q: "What is APR?",
      a: "APR (annual percentage rate) is the yearly interest rate on the loan. This calculator divides it by 12 to get the monthly rate used in the payment formula.",
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
      <LoanCalculator />
    </CalcShell>
  );
}
