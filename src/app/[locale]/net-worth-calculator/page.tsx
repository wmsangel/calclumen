import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { NetWorthCalculator } from "@/components/calculators/net-worth";

const SLUG = "net-worth-calculator";

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
    "This net worth calculator adds up everything you own and subtracts everything you owe to show your total net worth. List your assets — cash, investments, property — and your liabilities such as mortgages and loans, and the calculator keeps a running total as you type.",
    "Net worth is the single clearest measure of your financial position at a point in time. Tracking it every few months shows whether you are building wealth: rising net worth means your assets are growing faster than your debts, and it can be negative when you owe more than you own.",
  ],
  steps: [
    "List each asset with a label and its current value.",
    "List each liability with a label and its outstanding balance.",
    "Use the add and remove buttons to match your own accounts.",
    "Read your net worth along with total assets and total liabilities.",
  ],
  faq: [
    {
      q: "What counts as an asset?",
      a: "Anything you own that has value: cash and savings, checking accounts, investments and retirement accounts, your home and other property, vehicles, and any money owed to you.",
    },
    {
      q: "What counts as a liability?",
      a: "Everything you owe: your mortgage, student and personal loans, car loans, and outstanding credit card balances. The total of these is subtracted from your assets.",
    },
    {
      q: "Can my net worth be negative?",
      a: "Yes. If your liabilities are larger than your assets — common early in a career or soon after taking on a mortgage — your net worth is negative. The goal over time is to move it into positive territory and keep it growing.",
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
      <NetWorthCalculator />
    </CalcShell>
  );
}
