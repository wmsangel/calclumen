import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { CagrCalculator } from "@/components/calculators/cagr";

const SLUG = "cagr-calculator";

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
    "This CAGR calculator finds the compound annual growth rate — the single steady yearly rate that would grow a starting amount into an ending amount over a number of years. Enter the beginning value, the ending value and the time span, and it returns the CAGR, the total return over the whole period and the absolute gain.",
    "CAGR is the standard way to compare investments, revenue or any value that compounds, because it strips out year-to-year volatility. A fund that zig-zags and a savings account that grows steadily will show the same CAGR if they start and end at the same values over the same period.",
  ],
  steps: [
    "Enter the beginning value (your starting amount).",
    "Enter the ending value (what it grew to).",
    "Enter the number of years between the two.",
    "Read the CAGR per year, the total return over the period and the total gain.",
  ],
  faq: [
    {
      q: "How is CAGR calculated?",
      a: "CAGR = (ending value ÷ beginning value) raised to the power of (1 ÷ years), minus 1. For example, growing $1,000 to $2,600 over 5 years is (2.6)^(1/5) − 1 ≈ 21.1% a year.",
    },
    {
      q: "What is the difference between CAGR and total return?",
      a: "Total return is the overall percentage change from start to finish, while CAGR expresses that growth as a smooth yearly rate. Growing from $1,000 to $2,600 is a 160% total return but a 21.1% CAGR over 5 years.",
    },
    {
      q: "What is the difference between CAGR and average annual return?",
      a: "A simple average of yearly returns ignores compounding and overstates growth when returns vary. CAGR accounts for compounding, so it reflects the actual rate your money grew. For volatile returns, CAGR is always lower than or equal to the simple average.",
    },
    {
      q: "Can CAGR be negative?",
      a: "Yes. If the ending value is lower than the beginning value, the CAGR is negative, showing the steady annual rate of decline. For example, $1,000 falling to $500 over 4 years is about −15.9% a year.",
    },
    {
      q: "What are the limitations of CAGR?",
      a: "CAGR assumes smooth growth and only looks at the first and last values, so it hides volatility and any deposits or withdrawals in between. It's a clean comparison tool, not a complete picture of risk or cash flow.",
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
      <CagrCalculator />
    </CalcShell>
  );
}
