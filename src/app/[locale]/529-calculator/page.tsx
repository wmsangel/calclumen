import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { College529Calculator } from "@/components/calculators/college-savings-529";

const SLUG = "529-calculator";

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
    "A 529 plan is a tax-advantaged account for education savings: your contributions grow tax-free and withdrawals for qualified education costs are never taxed. This calculator projects what your 529 will be worth by the time your child starts college, and compares that to the projected cost of four years of school — so you can see whether you're on track and what the gap looks like.",
    "The two forces that matter most are time and college inflation. Starting early gives compound growth years to work, while tuition has historically risen faster than general inflation — often around 5% a year. The calculator inflates today's college cost to your child's enrollment year across all four years, so the target is realistic rather than today's sticker price.",
  ],
  steps: [
    "Enter your child's current age and the age they'll start college.",
    "Add your current 529 balance and monthly contribution.",
    "Set your expected investment return and today's annual college cost.",
    "Set an inflation rate for college costs, then read your projected balance and how much of the bill it covers.",
  ],
  faq: [
    {
      q: "How much should I save in a 529?",
      a: "A common target is to cover one-third to one-half of projected costs from savings, with the rest coming from income, financial aid and scholarships. This calculator shows your projected coverage so you can pick a monthly contribution that hits your goal.",
    },
    {
      q: "What return should I assume?",
      a: "Many 529 plans use age-based portfolios that start growth-heavy and get more conservative as college nears, so a long-run average of around 5–7% is a reasonable planning assumption. Lower it as your child gets close to enrollment, since there's less time to recover from a downturn.",
    },
    {
      q: "Are 529 withdrawals really tax-free?",
      a: "Yes, as long as the money is used for qualified education expenses such as tuition, fees, books and room and board. Earnings withdrawn for non-qualified expenses are taxed and generally hit with a 10% penalty. Many states also offer a tax deduction or credit on contributions.",
    },
    {
      q: "What if I save more than college costs?",
      a: "Leftover funds can be used for another child, kept for graduate school, or (within limits) rolled into a Roth IRA for the beneficiary. So over-saving is far less risky than it used to be — the money stays usable.",
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
      <College529Calculator />
    </CalcShell>
  );
}
