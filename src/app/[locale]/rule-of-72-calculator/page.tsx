import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { RuleOf72Calculator } from "@/components/calculators/rule-of-72";

const SLUG = "rule-of-72-calculator";

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
    "The Rule of 72 is a fast mental shortcut for compound growth: divide 72 by an annual rate of return and you get the approximate number of years it takes for money to double. At 8% a year, 72 ÷ 8 = 9 years to double. This calculator does it both ways — enter a rate to get the doubling time, or enter a number of years to get the rate you'd need.",
    "It's an estimate, not an exact formula, but it's remarkably close for the rates most investors and savers deal with (roughly 4%–15%). Alongside the Rule-of-72 answer, this tool also shows the mathematically exact figure — from the compound-growth formula — so you can see how small the gap is and when it starts to matter.",
  ],
  steps: [
    "Choose a mode: Time to double (from a rate) or Rate to double (from a number of years).",
    "In Time-to-double mode, enter the annual interest or return rate as a percentage.",
    "In Rate-to-double mode, enter how many years you want your money to double in.",
    "Read the Rule-of-72 estimate next to the mathematically exact value.",
    "Use the summary line to see when your money would 4× and 8× at the same rate.",
  ],
  faq: [
    {
      q: "Why 72 and not another number?",
      a: "72 is chosen because it's close to the mathematically 'correct' constant (about 69.3, from 100 × ln 2) while dividing evenly by many common rates — 2, 3, 4, 6, 8, 9, 12 — which makes the mental math easy. For rates near 8% it's very accurate; for very low or very high rates, 69 or 70 (or the exact formula) is closer.",
    },
    {
      q: "How accurate is the Rule of 72?",
      a: "It's most accurate for rates between about 4% and 15%. At 8% the rule gives 9 years and the exact figure is about 9.0 years — nearly identical. At 2% the rule says 36 years while the exact answer is about 35 years; at 20% the gap widens a little more. This calculator shows both so you can judge.",
    },
    {
      q: "Does it work for any kind of growth?",
      a: "Yes — the Rule of 72 applies to anything that grows (or shrinks) at a compounding percentage: investment returns, savings interest, inflation eroding buying power, even population or revenue growth. For inflation, 72 ÷ inflation rate tells you how fast prices double, i.e. how fast money loses half its value.",
    },
    {
      q: "What rate should I use for investments?",
      a: "Use the average annual return you realistically expect, after fees. Historically, broad stock-market returns have averaged roughly 7%–10% a year over long periods, but results vary widely year to year and past performance doesn't guarantee future returns. This is an estimate for planning, not financial advice.",
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
      <RuleOf72Calculator />
    </CalcShell>
  );
}
