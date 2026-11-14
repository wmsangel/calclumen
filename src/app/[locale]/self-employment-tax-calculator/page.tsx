import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { SelfEmploymentTaxCalculator } from "@/components/calculators/self-employment-tax";

const SLUG = "self-employment-tax-calculator";

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
    "If you're self-employed — a freelancer, contractor, gig worker or sole proprietor — you pay both halves of Social Security and Medicare yourself. That's self-employment tax (SECA), and it's separate from your income tax. This calculator works out what you owe from your net profit, splits it into the Social Security and Medicare parts, and shows the half you can deduct.",
    "The rate is 15.3% — 12.4% for Social Security plus 2.9% for Medicare — but two rules soften it. You only pay on 92.35% of your net profit, and the Social Security portion stops once your earnings reach the annual wage base; Medicare has no cap. On top of that, half of the tax is deductible against your income taxes, so the effective bite is smaller than 15.3%.",
  ],
  steps: [
    "Enter your net self-employment profit for the year (income minus business expenses).",
    "Check the Social Security wage base — it rises most years; the default is the current figure.",
    "Read your total self-employment tax and the Social Security and Medicare split.",
    "Note the deductible half, which lowers your income-tax bill.",
  ],
  methodology: [
    "Net earnings subject to tax are 92.35% of your net profit from self-employment (Schedule SE line 4a), which mirrors the employer's half of FICA that employees do not pay tax on. Social Security is 12.4% of those earnings up to the 2026 wage base of $184,500; Medicare is 2.9% with no cap. Half of the total is deductible from your income (an adjustment to income, not an itemized deduction).",
    "Not modelled: the 0.9% Additional Medicare Tax above $200,000 ($250,000 married filing jointly), wages from an employer in the same year that use up part of the Social Security base, the optional farm and nonfarm methods, and income tax itself — self-employment tax is paid on top of income tax, usually through quarterly estimated payments.",
  ],
  sources: [
    { label: "IRS — About Schedule SE (Form 1040), Self-Employment Tax", url: "https://www.irs.gov/forms-pubs/about-schedule-se-form-1040" },
    { label: "IRS Topic 554 — Self-employment tax", url: "https://www.irs.gov/taxtopics/tc554" },
    { label: "Social Security Administration — Contribution and benefit base", url: "https://www.ssa.gov/oact/cola/cbb.html" },
  ],
  faq: [
    {
      q: "How much is self-employment tax?",
      a: "It's 15.3% of your net self-employment earnings — 12.4% for Social Security and 2.9% for Medicare. But you only pay on 92.35% of net profit, and the Social Security part stops at the annual wage base, so the effective rate on your full profit is a bit under 15.3%.",
    },
    {
      q: "Why only 92.35% of my profit?",
      a: "Employees split Social Security and Medicare with their employer, and the employer's half isn't taxed. To keep the self-employed on equal footing, you multiply net profit by 0.9235 before applying the 15.3% rate, which mimics excluding that employer-equivalent half.",
    },
    {
      q: "Is any of it deductible?",
      a: "Yes. You can deduct half of your self-employment tax as an above-the-line deduction on your income tax return. It doesn't reduce the SE tax itself, but it lowers your taxable income for income tax.",
    },
    {
      q: "Is this the same as income tax?",
      a: "No — self-employment tax funds Social Security and Medicare and is separate from federal and state income tax, which you also owe on the same profit. High earners additionally pay a 0.9% extra Medicare tax on earnings above $200,000 (single) or $250,000 (married filing jointly).",
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
      <SelfEmploymentTaxCalculator />
    </CalcShell>
  );
}
