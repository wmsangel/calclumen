import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { MortgageCalculator } from "@/components/calculators/mortgage";

const SLUG = "mortgage-calculator";

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
    "This mortgage calculator estimates your full monthly house payment, not just the loan repayment. Enter the home price, your down payment, the interest rate and the term, and it works out principal and interest, then adds property tax, home insurance, PMI and any HOA fee to give the total you'll actually pay each month.",
    "The four core parts of a payment are often called PITI — principal, interest, taxes and insurance. Principal and interest are fixed by your loan amount, rate and term; property tax and insurance depend on the home; and private mortgage insurance (PMI) is added when your down payment is under 20%. The calculator also shows your total interest over the life of the loan and a year-by-year amortization schedule.",
  ],
  steps: [
    "Enter the home price and your down payment (the percentage updates automatically).",
    "Enter the interest rate and loan term in years.",
    "Add property tax, home insurance, PMI and any HOA fee.",
    "Read your total monthly payment, the breakdown, total interest and amortization schedule.",
  ],
  faq: [
    {
      q: "What is included in a monthly mortgage payment?",
      a: "A typical payment has four parts — principal, interest, property taxes and homeowners insurance (PITI). If your down payment is under 20% it also includes PMI, and a condo or planned community may add an HOA fee. This calculator adds all of them together.",
    },
    {
      q: "How much do I need for a down payment?",
      a: "20% of the price lets you avoid PMI, but many loans allow far less — conventional loans can go to 3–5% down and some government-backed loans lower still. A smaller down payment means a larger loan, a higher monthly payment and, under 20%, added PMI until you build 20% equity.",
    },
    {
      q: "What is PMI and when does it stop?",
      a: "Private mortgage insurance protects the lender when your down payment is below 20%. It's added to your monthly payment and typically drops off automatically once your loan-to-value reaches 78–80%, either through payments or rising home value. Rules vary by loan type.",
    },
    {
      q: "How is the monthly principal and interest calculated?",
      a: "It uses the standard amortization formula: M = P · r · (1+r)^n / ((1+r)^n − 1), where P is the loan amount, r is the monthly interest rate and n is the number of monthly payments. Early payments are mostly interest; later ones are mostly principal, as the schedule shows.",
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
      <MortgageCalculator />
    </CalcShell>
  );
}
