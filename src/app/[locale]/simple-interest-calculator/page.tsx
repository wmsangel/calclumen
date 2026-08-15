import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { SimpleInterestCalculator } from "@/components/calculators/simple-interest";

const SLUG = "simple-interest-calculator";

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
    "This simple interest calculator works out the interest charged or earned on a principal amount over time, without any compounding. Enter the principal, the annual interest rate and the time in years, and it returns the interest amount and the total you will owe or receive.",
    "Simple interest is calculated only on the original principal, so it grows in a straight line rather than accelerating the way compound interest does. It is commonly used for short-term loans, car finance and some bonds, which makes it a quick way to estimate a cost or return.",
  ],
  steps: [
    "Enter the principal amount and choose your currency.",
    "Type the annual interest rate as a percentage.",
    "Set the time period in years.",
    "Read the interest amount and the total amount.",
  ],
  faq: [
    {
      q: "How is simple interest calculated?",
      a: "Simple interest uses the formula I = P × r × t, where P is the principal, r is the annual rate as a decimal and t is the time in years. The total amount is simply the principal plus that interest.",
    },
    {
      q: "How does simple interest differ from compound interest?",
      a: "Simple interest is charged only on the original principal, so it is the same each year. Compound interest is charged on the principal plus previously accumulated interest, so it grows faster over time.",
    },
    {
      q: "Can I use a period shorter than a year?",
      a: "Yes. Enter the time as a fraction of a year — for example, 0.5 for six months or 0.25 for three months — and the interest is prorated accordingly.",
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
      <SimpleInterestCalculator />
    </CalcShell>
  );
}
