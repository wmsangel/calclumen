import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { HsaCalculator } from "@/components/calculators/hsa";

const SLUG = "hsa-calculator";

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
    "This HSA calculator shows how much a health savings account saves you in tax this year and what it can grow to if you invest it. Pick self-only or family coverage and your age, and it applies the 2026 IRS contribution limit — including the $1,000 catch-up at 55 — and flags any amount over it.",
    "An HSA is the only account with a triple tax advantage: contributions are deducted from taxable income, growth isn't taxed, and withdrawals for qualified medical expenses are tax-free. Contribute through payroll and you also skip the 7.65% Social Security and Medicare tax, which even a 401(k) doesn't do. The calculator adds up federal, state and FICA savings so you can see the real after-tax cost of every dollar you put in.",
  ],
  steps: [
    "Choose self-only or family high-deductible health plan (HDHP) coverage and enter your age.",
    "Enter what you and your employer each contribute per year — the limit covers both together.",
    "Add your federal tax bracket and state income tax rate, and tick payroll if you contribute through work.",
    "Enter your current balance, the years until you need the money and an expected return to project growth.",
  ],
  faq: [
    {
      q: "What is the HSA contribution limit for 2026?",
      a: "For 2026 the IRS limit is $4,400 for self-only HDHP coverage and $8,750 for family coverage. If you are 55 or older you can add a $1,000 catch-up contribution. The limit includes anything your employer puts in, so subtract their contribution to find how much you can add yourself.",
    },
    {
      q: "How much tax does an HSA save?",
      a: "Your contribution is taken out of taxable income, so you save your marginal federal rate plus your state rate on every dollar. Through payroll you also avoid 7.65% FICA. Someone in the 22% bracket with a 5% state tax saves about 34.65% — a $3,400 contribution costs only about $2,222 after tax.",
    },
    {
      q: "Which states don't allow the HSA tax deduction?",
      a: "California and New Jersey tax HSA contributions and earnings at the state level, so residents there get only the federal and FICA benefit — enter 0 for the state rate. States with no income tax, such as Texas and Florida, also give no state saving because there is nothing to deduct from.",
    },
    {
      q: "Can you invest HSA money?",
      a: "Yes. Most HSA providers let you move money above a small cash threshold into mutual funds or ETFs, and the growth is tax-free. Paying current medical bills out of pocket and leaving the HSA invested for decades turns it into a stealth retirement account — the projection here shows that growth.",
    },
    {
      q: "What happens to an HSA at 65?",
      a: "The money is always yours and never expires. After 65 you can withdraw it for any purpose without the 20% penalty; non-medical withdrawals are taxed as ordinary income like a traditional IRA, while medical withdrawals — including Medicare premiums — stay tax-free. Once enrolled in Medicare you can no longer contribute.",
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
      <HsaCalculator />
    </CalcShell>
  );
}
