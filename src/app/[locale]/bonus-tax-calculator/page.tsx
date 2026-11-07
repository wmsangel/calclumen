import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { BonusTaxCalculator } from "@/components/calculators/bonus-tax";

const SLUG = "bonus-tax-calculator";

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
    "This bonus tax calculator shows how much of a bonus you will actually receive after US withholding. Bonuses are “supplemental wages”, and when they are paid separately from your regular paycheck most employers use the IRS percentage method: a flat 22% federal withholding on the first $1,000,000 of supplemental wages in a year, and 37% on anything above that. Social Security (6.2%, up to the annual wage base) and Medicare (1.45%, plus 0.9% on wages over $200,000) are withheld on top, and your state may withhold its own flat rate.",
    "The figures use the 2026 rates published in IRS Publication 15 (Circular E). Remember that withholding is not the same as the tax you ultimately owe: a bonus is taxed as ordinary income on your annual return, so depending on your bracket you may get some of the 22% back as a refund — or owe a little more.",
  ],
  steps: [
    "Enter the bonus amount.",
    "Enter the wages you have already been paid this year, so the Social Security wage base and the Additional Medicare Tax threshold are applied correctly.",
    "If you have had other bonuses this year, enter them too (only matters above $1,000,000). Add your state's supplemental withholding rate, or leave 0.",
    "Read your take-home bonus and the breakdown of federal, Social Security, Medicare and state withholding.",
  ],
  faq: [
    {
      q: "Why is 22% taken out of my bonus?",
      a: "Because the IRS lets employers withhold a flat 22% on supplemental wages (bonuses, commissions, severance) paid separately from regular pay, instead of using your W-4 tax tables. It is a withholding rate, not a special “bonus tax” — the bonus is taxed as ordinary income when you file.",
    },
    {
      q: "Will I get some of the withholding back?",
      a: "Possibly. If your marginal income-tax rate is below 22%, too much was withheld and the difference comes back as a refund. If you are in a higher bracket, you may owe more at filing time. Social Security and Medicare withholding is not refundable in this way.",
    },
    {
      q: "What if my bonus is paid together with my regular paycheck?",
      a: "Then the employer may use the aggregate method instead: the bonus is added to that period's regular wages and withheld as if it were all regular pay, which can take out more or less than 22% depending on your income. This calculator models the separate-payment (percentage) method.",
    },
    {
      q: "Does the state tax bonuses too?",
      a: "Most states with an income tax withhold on bonuses, often at their own flat supplemental rate; a few (such as Texas, Florida and Washington) have no state income tax. Enter your state's rate in the state field, or 0 if it does not apply.",
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
      <BonusTaxCalculator />
    </CalcShell>
  );
}
