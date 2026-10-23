import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { FireCalculator } from "@/components/calculators/fire";

const SLUG = "fire-calculator";

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
    "This FIRE calculator finds your 'FIRE number' — the amount you need invested to retire on your savings — and projects how many years of saving it takes to get there. Enter your annual spending, current savings, how much you add each year and your expected return, and it works out the target and the timeline to financial independence.",
    "FIRE stands for Financial Independence, Retire Early. The idea is simple: once your investments can cover your yearly spending at a safe withdrawal rate, work becomes optional. At the common 4% rule, that's 25 times your annual expenses — but the real number depends on your spending, your savings rate and the return you earn.",
  ],
  steps: [
    "Enter your annual expenses — the spending your portfolio needs to cover.",
    "Add your current invested savings and how much you contribute each year.",
    "Set your expected annual return and your safe withdrawal rate (4% is common).",
    "Read your FIRE number and the years until financial independence.",
  ],
  faq: [
    {
      q: "What is a FIRE number?",
      a: "Your FIRE number is the nest egg that can fund your lifestyle indefinitely: annual expenses divided by your safe withdrawal rate. At a 4% rate, $40,000 of annual spending needs $1,000,000 — that's the 25× rule of thumb.",
    },
    {
      q: "What is the 4% rule?",
      a: "The 4% rule says you can withdraw about 4% of your portfolio in the first year of retirement, then adjust for inflation, with a low chance of running out over 30 years. It comes from the Trinity study. For a longer early retirement, many FIRE savers use a more conservative 3–3.5%.",
    },
    {
      q: "How is the time to FIRE calculated?",
      a: "The calculator grows your current savings at your expected return and adds your yearly contributions, year by year, until the balance reaches your FIRE number. Saving more or spending less both pull that date much closer, because they raise your savings rate and lower the target at once.",
    },
    {
      q: "What return should I assume?",
      a: "A diversified stock-heavy portfolio has historically returned roughly 7% a year after inflation, but returns vary widely and aren't guaranteed. Because FIRE is usually planned in today's money, use a real (inflation-adjusted) return rather than a nominal one.",
    },
    {
      q: "What's the difference between lean FIRE and fat FIRE?",
      a: "Lean FIRE covers a frugal lifestyle on a smaller number, while fat FIRE funds a more comfortable budget and so needs a bigger portfolio. Both use the same math — just change your annual expenses to see how the target and timeline shift.",
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
      <FireCalculator />
    </CalcShell>
  );
}
