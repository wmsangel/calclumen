import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { CarAffordabilityCalculator } from "@/components/calculators/car-affordability";

const SLUG = "car-affordability-calculator";

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
    "This car affordability calculator works backwards from the payment you can comfortably make each month to the car price you can actually afford. Enter your monthly budget, down payment, any trade-in, the loan term, APR and your local sales tax rate, and it returns a realistic target price to shop within.",
    "It first converts your monthly budget into the largest loan you could carry over the term at that APR, then adds your down payment and trade-in and works the sales tax back out of the total — because tax is charged on the car, not on the loan. The result is the sticker price you can reach, not just the amount you can borrow.",
  ],
  steps: [
    "Enter the monthly payment you're comfortable making and your currency.",
    "Add your down payment and any trade-in value.",
    "Set the loan term in months and the APR you expect to be offered.",
    "Enter your local sales tax rate.",
    "Read the car price you can afford, the loan amount and the interest involved.",
  ],
  faq: [
    {
      q: "Should my whole car budget go to the payment?",
      a: "No. This tool sizes the loan payment only. Insurance, fuel, maintenance and registration are extra, so leave room in your overall budget for them. A common guideline is to keep all car costs — payment plus running costs — under about 15–20% of take-home pay.",
    },
    {
      q: "How does the down payment change what I can afford?",
      a: "Every dollar of down payment (or trade-in) adds directly to the price you can reach on top of what the loan covers, and it lowers the amount financed — so you pay less interest for the same car. A bigger down payment is the fastest way to raise your affordable price.",
    },
    {
      q: "Why is sales tax handled separately?",
      a: "Sales tax is charged on the vehicle price, not on your loan, so it eats into your budget. The calculator solves for the price whose tax, financed alongside it, still fits your payment — which is why the affordable price is lower than the raw loan-plus-cash figure when tax is high.",
    },
    {
      q: "What term and APR should I use?",
      a: "Use the APR you've actually been quoted (from a lender or credit union pre-approval) and a term you're comfortable with. Longer terms raise the price you can reach but cost more interest and risk going underwater — many buyers keep terms to 60 months or less.",
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
      <CarAffordabilityCalculator />
    </CalcShell>
  );
}
