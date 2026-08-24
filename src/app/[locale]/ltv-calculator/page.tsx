import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { LtvCalculator } from "@/components/calculators/ltv";

const SLUG = "ltv-calculator";

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
    "This loan-to-value (LTV) calculator shows what fraction of a property's value you're borrowing. Enter the property value and your down payment, and it returns your LTV ratio, the loan amount, your down payment percentage, and whether you're likely to need private mortgage insurance (PMI).",
    "LTV is the loan amount divided by the property value, as a percentage. A $300,000 home with a $60,000 down payment means a $240,000 loan and an 80% LTV. Lenders use LTV to price risk: a lower LTV (bigger down payment) usually means better rates and no PMI, while an LTV above 80% typically triggers PMI until you build enough equity.",
  ],
  steps: [
    "Enter the property value and choose your currency.",
    "Enter your down payment amount.",
    "Read your LTV ratio, loan amount and down payment percentage.",
    "Check the note on whether PMI is likely to apply.",
  ],
  faq: [
    {
      q: "What is a good LTV ratio?",
      a: "80% or below is the common target — it usually avoids private mortgage insurance and unlocks better rates. Many loans allow higher LTVs (95% or more), but they cost more in insurance and interest.",
    },
    {
      q: "How is LTV calculated?",
      a: "LTV = loan amount ÷ property value × 100. The loan amount is the property value minus your down payment. So a $240,000 loan on a $300,000 home is 240,000 ÷ 300,000 = 80% LTV.",
    },
    {
      q: "When do I have to pay PMI?",
      a: "On conventional loans, private mortgage insurance is generally required when your LTV is above 80% (a down payment under 20%). It typically drops off once your LTV reaches 80% through payments or rising home value. Rules vary by loan type and lender — this is an estimate, not financial advice.",
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
      <LtvCalculator />
    </CalcShell>
  );
}
