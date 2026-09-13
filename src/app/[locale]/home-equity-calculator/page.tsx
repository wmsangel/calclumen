import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { HomeEquityCalculator } from "@/components/calculators/home-equity";

const SLUG = "home-equity-calculator";

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
    "This home equity calculator shows how much you could borrow against your house with a home equity loan or HELOC. Enter your home's value, your current mortgage balance and the lender's maximum combined loan-to-value (CLTV), and it works out your equity, the credit available to you, and the monthly payment on the amount you want to borrow.",
    "Home equity is your home's value minus what you still owe. Lenders let you borrow against it up to a combined loan-to-value limit — usually 80% to 90% of the value across all loans on the home. Your available credit is that limit minus your existing mortgage balance, and the payment depends on the amount, rate and term you choose.",
  ],
  steps: [
    "Enter your home's current value and your remaining mortgage balance.",
    "Set the maximum CLTV your lender allows (often 80–90%).",
    "Enter how much you want to borrow, the rate and the repayment term.",
    "Read your equity, the credit available, and the monthly payment and total interest.",
  ],
  faq: [
    {
      q: "How much equity can I borrow from my home?",
      a: "Most lenders cap your total home debt at 80–90% of the value (the CLTV). Take that percentage of your home's value, subtract your current mortgage balance, and the remainder is roughly what you can borrow. This calculator does that for you.",
    },
    {
      q: "What is the difference between a home equity loan and a HELOC?",
      a: "A home equity loan gives you a lump sum at a fixed rate with set monthly payments. A HELOC is a revolving line of credit you draw from as needed, usually at a variable rate. Both are secured by your home; this tool estimates the payment on a fixed amount either way.",
    },
    {
      q: "What is CLTV?",
      a: "Combined loan-to-value is all the debt secured by your home divided by its value. If your home is worth $400,000 and you owe $250,000, your current CLTV is 62.5%. A lender allowing 85% CLTV would let total debt reach $340,000, leaving $90,000 you could borrow.",
    },
    {
      q: "Is my home equity payment tax-deductible?",
      a: "Interest on a home equity loan or HELOC may be tax-deductible when the funds are used to buy, build or substantially improve the home securing the loan, subject to limits. Rules vary and change — check current guidance or a tax professional. This is an estimate, not tax advice.",
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
      <HomeEquityCalculator />
    </CalcShell>
  );
}
