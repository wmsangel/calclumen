import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { PmiCalculator } from "@/components/calculators/pmi";

const SLUG = "pmi-calculator";

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
    "PMI — private mortgage insurance — is what conventional lenders charge when your down payment is under 20% of the home price. It protects the lender, not you, and it's added to your monthly mortgage payment until you've built enough equity. This calculator estimates your monthly and annual PMI, and — using your loan's interest rate and term — how long until you can drop it and how much PMI you'll pay in total before then.",
    "PMI typically runs about 0.3% to 1.5% of the loan amount per year, mostly depending on your down payment and credit score. The key figure is when it ends: you can request cancellation once your balance falls to 80% of the original value, and lenders must remove it automatically at 78%. A larger down payment or extra principal payments both shorten that timeline.",
  ],
  steps: [
    "Enter the home price and your down payment.",
    "Add your loan interest rate and term so the calculator can amortize the balance.",
    "Set the annual PMI rate (0.3%–1.5% of the loan is typical; ~0.5% is a common default).",
    "Read your monthly PMI, when it drops off and the total PMI you'll pay until then.",
  ],
  faq: [
    {
      q: "How much is PMI per month?",
      a: "PMI usually costs 0.3% to 1.5% of the loan amount per year, split into monthly payments. On a $360,000 loan at 0.5%, that's $1,800 a year or about $150 a month. Your exact rate depends mainly on your down payment size and credit score.",
    },
    {
      q: "When does PMI go away?",
      a: "You can ask your lender to cancel PMI once your loan balance reaches 80% of the home's original value, and by federal law it's removed automatically when the balance hits 78% (assuming you're current on payments). Paying extra principal reaches that point sooner.",
    },
    {
      q: "How do I avoid PMI entirely?",
      a: "Put down 20% or more on a conventional loan and PMI isn't required at all. Some borrowers also use a piggyback second loan or lender-paid PMI (a higher interest rate instead of a monthly premium), though a 20% down payment is the cleanest way to avoid it.",
    },
    {
      q: "Is PMI the same as homeowners insurance?",
      a: "No. Homeowners insurance protects you and your property against damage and is required for the life of the loan. PMI protects the lender against default and ends once you have enough equity. Both can appear in your monthly payment, but they're different things.",
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
      <PmiCalculator />
    </CalcShell>
  );
}
