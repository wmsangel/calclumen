import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { HomeAffordabilityCalculator } from "@/components/calculators/home-affordability";

const SLUG = "home-affordability-calculator";

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
    "This home affordability calculator estimates how much house you can afford based on your income, existing debts, down payment and current mortgage terms. It applies the standard front-end and back-end debt-to-income ratios that lenders use to size a mortgage, then works backward to the home price that fits within your monthly budget.",
    "The result includes property tax and homeowners insurance in the monthly payment (the full PITI figure — principal, interest, taxes and insurance), because lenders qualify you on the total housing cost, not just principal and interest. Increasing your down payment, extending the term or lowering the rate all raise the price you can afford.",
  ],
  steps: [
    "Enter your annual gross income and choose your currency.",
    "Add your total monthly debt payments, down payment, mortgage rate and term.",
    "Adjust the property tax rate, annual insurance and the DTI ratios if your lender uses different limits.",
    "Read your affordable home price, maximum monthly payment and loan amount.",
  ],
  faq: [
    {
      q: "What are the front-end and back-end ratios?",
      a: "The front-end ratio caps your housing payment at a percentage of gross monthly income (commonly 28%). The back-end ratio caps all debt payments — housing plus car loans, credit cards and student loans — at a higher percentage (commonly 36%). The calculator uses whichever limit is lower.",
    },
    {
      q: "Does the price include property tax and insurance?",
      a: "Yes. The maximum monthly payment is a full PITI figure, so property tax and homeowners insurance are subtracted before the remaining budget is converted into a loan amount. That keeps the estimate realistic for mortgage qualification.",
    },
    {
      q: "Why is this only an estimate?",
      a: "Lenders also weigh your credit score, employment history, reserves and the specific loan program. Use this as a starting point, then get a pre-approval for a figure a lender will actually stand behind.",
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
      <HomeAffordabilityCalculator />
    </CalcShell>
  );
}
