import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { BudgetCalculator } from "@/components/calculators/budget";

const SLUG = "budget-calculator";

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
    "This budget calculator applies the popular 50/30/20 rule to your monthly take-home pay. Enter your after-tax income and it splits the total into three buckets so you can see roughly how much to spend on essentials, lifestyle, and your financial future.",
    "The 50% needs bucket covers essentials you cannot easily skip: rent or mortgage, utilities, groceries, insurance, and minimum debt payments. The 30% wants bucket is for lifestyle spending like dining out, entertainment, hobbies, and subscriptions. The 20% savings bucket goes toward savings, investments, and paying down debt faster.",
  ],
  steps: [
    "Enter your monthly after-tax income and pick your currency.",
    "Read the three suggested amounts for needs, wants, and savings.",
    "Compare the targets against what you actually spend each month.",
    "Adjust your spending to move closer to the 50/30/20 split.",
  ],
  faq: [
    {
      q: "What is the 50/30/20 budgeting rule?",
      a: "It is a simple framework that divides your after-tax income into 50% for needs, 30% for wants, and 20% for savings and debt repayment. It gives you a quick starting point without tracking every single expense.",
    },
    {
      q: "Should I use gross or net income?",
      a: "Use your net, after-tax income — the amount that actually lands in your account. The 50/30/20 rule is built around take-home pay, so using gross income would overstate how much you can spend.",
    },
    {
      q: "What if my needs are more than 50%?",
      a: "In higher-cost areas, essentials often exceed half your income. Treat the split as a guide rather than a hard rule: trim the wants bucket where you can, and protect savings even if the exact percentages shift.",
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
      <BudgetCalculator />
    </CalcShell>
  );
}
