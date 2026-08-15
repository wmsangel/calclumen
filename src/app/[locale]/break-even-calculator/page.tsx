import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { BreakEvenCalculator } from "@/components/calculators/break-even";

const SLUG = "break-even-calculator";

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
    "This break-even calculator tells you how many units you need to sell before a product or business starts making a profit. It compares your fixed costs — rent, salaries, equipment and anything you pay regardless of volume — against the contribution each sale makes after its variable costs are covered.",
    "The contribution margin is the price of one unit minus the variable cost of producing it. Dividing fixed costs by the contribution margin gives the break-even quantity; multiplying that by the price gives the revenue you need. If the price does not exceed the variable cost per unit, there is no contribution and the business can never break even.",
  ],
  steps: [
    "Enter your total fixed costs and choose your currency.",
    "Enter the selling price of one unit.",
    "Enter the variable cost to produce one unit.",
    "Read the break-even units, revenue, contribution margin and CM ratio.",
  ],
  faq: [
    {
      q: "What is the contribution margin?",
      a: "The contribution margin is the selling price of a unit minus its variable cost. It is the amount each sale contributes toward covering fixed costs, and once fixed costs are covered, toward profit.",
    },
    {
      q: "What is the CM ratio?",
      a: "The contribution margin ratio is the contribution margin as a percentage of the selling price. A higher ratio means more of every dollar of sales is available to cover fixed costs and generate profit.",
    },
    {
      q: "Why must the price exceed the variable cost?",
      a: "If each unit costs more to make than it sells for, every sale loses money and no amount of volume will cover the fixed costs. Break-even only exists when the contribution margin is positive.",
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
      <BreakEvenCalculator />
    </CalcShell>
  );
}
