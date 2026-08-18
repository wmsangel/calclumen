import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { EmergencyFundCalculator } from "@/components/calculators/emergency-fund";

const SLUG = "emergency-fund-calculator";

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
    "An emergency fund is the cash you set aside to cover essential expenses if your income stops or an unexpected cost lands. This calculator works out how big that fund should be, based on your monthly essential expenses and how many months of coverage you want, then shows how much more you need to save and how many months your current savings already cover.",
    "A common guideline is three to six months of essential expenses, though many people aim for more if their income is variable or they have dependents. Multiply your monthly essentials by your target number of months to get the goal, subtract what you have already saved, and the gap is what is left to build.",
  ],
  steps: [
    "Enter your monthly essential expenses — rent, food, utilities, insurance and minimum debt payments.",
    "Choose how many months of coverage you want, from 3 to 12.",
    "Enter your current savings set aside for emergencies.",
    "Read your target fund, how much is still to save and how many months you currently cover.",
  ],
  faq: [
    {
      q: "How many months should an emergency fund cover?",
      a: "Three to six months of essential expenses is the usual advice. Consider aiming higher if your income is irregular, you are self-employed, or you support dependents, and lower if you have very stable, secure income.",
    },
    {
      q: "What counts as an essential expense?",
      a: "Costs you cannot easily cut: housing, utilities, groceries, insurance, transport and minimum debt payments. Leave out discretionary spending like dining out, subscriptions and holidays when sizing the fund.",
    },
    {
      q: "Where should I keep my emergency fund?",
      a: "In a safe, easily accessible place such as a high-yield savings account, so the money is there instantly when you need it and is not exposed to market swings.",
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
      <EmergencyFundCalculator />
    </CalcShell>
  );
}
