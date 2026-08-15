import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { CompoundInterestCalculator } from "@/components/calculators/compound-interest";

const SLUG = "compound-interest-calculator";

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
    "This compound interest calculator shows how a lump sum and regular monthly contributions grow over time once interest starts earning interest of its own. Enter your starting balance, the annual interest rate, how many years you plan to stay invested, how often interest compounds and how much you add each month to see the projected future value, everything you contributed and how much of the total is pure interest.",
    "Compound interest is the engine behind long-term saving and investing. Because each period's interest is added to the balance and then earns interest itself, growth accelerates the longer you leave the money untouched. Small changes to the rate, the time horizon or your monthly contribution can make a large difference to the final figure, which is why starting early and contributing consistently matters so much.",
  ],
  steps: [
    "Enter your initial deposit and choose your currency.",
    "Type the annual interest rate as a percentage and the number of years.",
    "Pick how often the interest compounds and set your monthly contribution (use 0 for none).",
    "Read your projected future value, total contributions and total interest earned.",
  ],
  faq: [
    {
      q: "How is compound interest calculated?",
      a: "The lump sum grows by FV = P·(1 + r/n)^(n·t), where P is the principal, r is the annual rate as a decimal, n is the number of compounding periods per year and t is the number of years. Monthly contributions are added with the future-value-of-an-annuity formula and both parts are combined to give the total.",
    },
    {
      q: "Does compounding frequency really change the result?",
      a: "Yes, but usually only a little. More frequent compounding (daily rather than annually) means interest is added and starts earning sooner, so the balance ends up slightly higher for the same nominal rate. The gap between monthly and daily compounding is small; the gap between annual and daily is more noticeable over long periods.",
    },
    {
      q: "Why do regular contributions matter so much?",
      a: "Each monthly contribution has its own runway to compound, so money added early grows the most. Adding a steady amount every month often ends up contributing more to the final balance than the initial deposit, especially over long time horizons — which is why consistent investing beats waiting to invest a larger sum later.",
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
      <CompoundInterestCalculator />
    </CalcShell>
  );
}
