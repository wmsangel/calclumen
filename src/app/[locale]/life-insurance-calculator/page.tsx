import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { LifeInsuranceNeedsCalculator } from "@/components/calculators/life-insurance-needs";

const SLUG = "life-insurance-calculator";

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
    "This life insurance calculator estimates how much coverage your family would actually need if you weren't there to provide for them. Instead of a vague rule of thumb, it adds up the real obligations your policy should cover — replacing your income, paying off debts and the mortgage, funding your children's education and covering final expenses — then subtracts the life insurance and savings you already have.",
    "It uses the well-known DIME method: Debt, Income, Mortgage and Education. The biggest piece is usually income replacement — enough years of your salary for your family to stay on their feet and adjust. The good news is that term life insurance buys large amounts of coverage cheaply, so the number this returns is often far more affordable to insure than people expect.",
  ],
  steps: [
    "Enter your annual income and how many years your family would need it replaced.",
    "Add your debts, mortgage balance, a children's education fund and final expenses.",
    "Enter any life insurance and savings you already have.",
    "Read the recommended coverage amount and the breakdown of what it's covering.",
  ],
  faq: [
    {
      q: "How much life insurance do I need?",
      a: "A common guideline is 10–15× your annual income, but a needs-based estimate is more accurate. Add up income replacement (your salary × the years your family needs it), your debts, mortgage, children's education and final expenses, then subtract existing coverage and savings — which is exactly what this calculator does.",
    },
    {
      q: "What is the DIME method?",
      a: "DIME stands for Debt, Income, Mortgage and Education — the four things a policy should cover. You total those (plus final expenses), then subtract what you already have. It's a quick, widely used way to size a policy without underestimating.",
    },
    {
      q: "Term or whole life insurance?",
      a: "For covering a temporary need — income replacement while kids grow up and the mortgage is paid down — term life is usually the best value, offering large coverage for a low monthly premium. Whole life costs far more and mixes in an investment component; most families are better served buying term and investing the difference.",
    },
    {
      q: "How many years of income should I replace?",
      a: "It depends on how long your family would need support — often until your youngest child is financially independent, or until a surviving spouse reaches retirement. Ten years is a common starting point; use more if you have young children or a stay-at-home partner.",
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
      <LifeInsuranceNeedsCalculator />
    </CalcShell>
  );
}
