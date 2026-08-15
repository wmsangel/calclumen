import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { SavingsGoalCalculator } from "@/components/calculators/savings-goal";

const SLUG = "savings-goal-calculator";

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
    "This savings goal calculator tells you exactly how much to set aside each month to reach a target amount by a chosen date. Enter your goal, what you have saved already, how many years you have and the annual return you expect to earn, and it works out the monthly deposit that gets you there.",
    "Because your balance earns compound interest along the way, you usually need to deposit less than the raw goal divided by the number of months. The calculator accounts for the growth of both your current savings and each future deposit, then shows how much of the goal comes from your own contributions versus interest earned.",
  ],
  steps: [
    "Enter your savings goal and choose your currency.",
    "Enter how much you have already saved toward it.",
    "Set the number of years you have and the annual return you expect.",
    "Read the required monthly deposit, your total deposits and the interest earned.",
  ],
  faq: [
    {
      q: "How is the required monthly deposit calculated?",
      a: "It uses the future-value-of-an-annuity formula. The calculator grows your current savings to the target date, subtracts that from your goal, and solves for the level monthly deposit whose compounded value fills the remaining gap.",
    },
    {
      q: "What does 'Goal already reached' mean?",
      a: "If your current savings, once compounded at the expected return, will grow to meet or exceed your goal on their own, no further deposits are required, so the calculator shows that the goal is already reached.",
    },
    {
      q: "What annual return should I use?",
      a: "Use the rate you realistically expect from where the money is held. A savings account might be 1–4%, while a diversified investment portfolio is often assumed at 5–7%. A higher return lowers the deposit you need, but also carries more risk.",
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
      <SavingsGoalCalculator />
    </CalcShell>
  );
}
