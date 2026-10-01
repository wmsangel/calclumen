import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { RmdCalculator } from "@/components/calculators/rmd";

const SLUG = "rmd-calculator";

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
    "Once you reach age 73, the IRS requires you to start withdrawing a minimum amount from your traditional IRA and most workplace retirement accounts each year — the Required Minimum Distribution (RMD). This calculator gives this year's RMD from your account balance and age, so you can take at least that much and avoid the penalty.",
    "The math is simple: your balance on December 31 of last year divided by a distribution period from the IRS Uniform Lifetime Table, which shrinks as you age — so the percentage you must withdraw rises each year. Roth IRAs are exempt during the owner's lifetime, and the rules differ for inherited accounts.",
  ],
  steps: [
    "Enter your retirement account balance as of December 31 last year.",
    "Enter your age this year.",
    "Read your required minimum distribution for the year, and the IRS distribution period used.",
    "Take at least that amount by the deadline to avoid the penalty.",
  ],
  faq: [
    {
      q: "At what age do RMDs start?",
      a: "Under SECURE 2.0, RMDs begin at age 73 for those who turned 72 after 2022, and the start age rises to 75 in 2033. Your very first RMD can be delayed until April 1 of the year after you turn 73, but every RMD after that is due by December 31.",
    },
    {
      q: "How is the RMD calculated?",
      a: "Take your prior-year-end balance and divide by the distribution period for your age from the IRS Uniform Lifetime Table. For example, at 73 the period is 26.5, so a $500,000 balance gives an RMD of about $18,868.",
    },
    {
      q: "What happens if I don't take my RMD?",
      a: "The shortfall is hit with a penalty — 25% of the amount you failed to withdraw, reduced to 10% if you correct it promptly. That's on top of the regular income tax you owe on the distribution, so it's worth taking at least the minimum on time.",
    },
    {
      q: "Do Roth accounts have RMDs?",
      a: "Roth IRAs have no RMDs during the owner's lifetime, and as of 2024 Roth 401(k)s no longer require them either. Traditional IRAs, SEP/SIMPLE IRAs and pre-tax 401(k) balances do. Inherited accounts follow separate rules.",
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
      <RmdCalculator />
    </CalcShell>
  );
}
