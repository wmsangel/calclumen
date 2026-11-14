import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { AutoLoanCalculator } from "@/components/calculators/auto-loan";

const SLUG = "auto-loan-calculator";

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
    "This auto loan calculator estimates the monthly payment on a car loan, along with the total interest and the total cost of the vehicle. It factors in your down payment, a trade-in, sales tax on the purchase and any dealer or documentation fees, so the number reflects what you will actually pay each month.",
    "Sales tax is applied to the price after any trade-in credit, then added to the amount financed together with fees, minus your down payment and trade-in. The monthly payment uses the standard amortization formula, so a lower APR or a shorter term reduces the interest you pay over the life of the loan.",
  ],
  steps: [
    "Enter the vehicle price and choose your currency.",
    "Add your down payment, any trade-in value and the sales tax rate.",
    "Set the loan term in months, the APR and any dealer fees.",
    "Read your monthly payment, loan amount, sales tax and total cost.",
  ],
  methodology: [
    "Sales tax is applied to the vehicle price minus your trade-in (the rule in most US states), then the amount financed is price + sales tax + fees − down payment − trade-in. The monthly payment uses the standard amortization formula on that amount at your APR over the term in months; total interest is all payments minus the amount financed, and total cost adds back the down payment and trade-in.",
    "Not modelled: states that tax the full price before trade-in, negative equity rolled in from a previous loan, dealer add-ons, GAP insurance, and rates that depend on your credit tier. Check the dealer's contract for the exact amount financed and APR.",
  ],
  sources: [
    { label: "CFPB — Auto loans: shopping and comparing offers", url: "https://www.consumerfinance.gov/consumer-tools/auto-loans/" },
    { label: "12 CFR Part 1026 (Regulation Z) — Truth in Lending", url: "https://www.ecfr.gov/current/title-12/chapter-X/part-1026" },
  ],
  faq: [
    {
      q: "Is sales tax charged on the trade-in?",
      a: "No. In most states the trade-in value is deducted from the price before sales tax is calculated, so you only pay tax on the difference. This calculator applies tax to the price minus the trade-in.",
    },
    {
      q: "Does the down payment reduce interest?",
      a: "Yes. A larger down payment lowers the amount you finance, which reduces both the monthly payment and the total interest paid over the term of the loan.",
    },
    {
      q: "What does the total cost include?",
      a: "Total cost is the sum of every monthly payment plus your down payment and trade-in value — in other words, everything you put toward the car including financed sales tax and fees.",
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
      <AutoLoanCalculator />
    </CalcShell>
  );
}
