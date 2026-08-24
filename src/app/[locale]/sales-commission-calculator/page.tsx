import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { SalesCommissionCalculator } from "@/components/calculators/sales-commission";

const SLUG = "sales-commission-calculator";

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
    "This sales commission calculator works out how much you earn on your sales. Enter your total sales, your commission rate as a percentage, and any base pay, and it shows the commission earned, your total earnings and your effective rate — the share of sales you actually take home once base pay is included.",
    "Commission is simply sales × rate ÷ 100. If you sell $50,000 at a 5% commission rate, you earn $2,500. Adding a base salary on top gives your total pay, which is what most sales roles combine — a fixed base plus a variable commission that rewards higher sales.",
  ],
  steps: [
    "Enter your total sales for the period and choose your currency.",
    "Enter your commission rate as a percentage.",
    "Add any fixed base pay (leave at 0 for commission-only).",
    "Read your commission, total earnings and effective rate.",
  ],
  faq: [
    {
      q: "How do I calculate commission?",
      a: "Multiply your total sales by the commission rate and divide by 100. For example, $50,000 in sales at a 5% rate is 50,000 × 5 ÷ 100 = $2,500 in commission.",
    },
    {
      q: "What is the effective rate?",
      a: "The effective rate is your total earnings (commission plus base pay) as a percentage of sales. With base pay included it's higher than the commission rate; on commission-only it equals the commission rate.",
    },
    {
      q: "Does this handle tiered commission?",
      a: "This tool uses a single flat rate. For tiered plans (a higher rate above a sales threshold), calculate each tier's sales separately and add the results, or use your quoted blended rate for a quick estimate.",
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
      <SalesCommissionCalculator />
    </CalcShell>
  );
}
