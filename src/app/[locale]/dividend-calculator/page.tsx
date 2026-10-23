import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { DividendCalculator } from "@/components/calculators/dividend";

const SLUG = "dividend-calculator";

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
    "This dividend calculator projects the income from a dividend-paying investment. Enter how much you've invested and the dividend yield, and it shows your annual and monthly dividend income. Add an annual dividend-growth rate and a time horizon to see how the income rises, and switch on reinvestment (DRIP) to compound your balance.",
    "Dividend income is the yield times the amount invested. Many companies raise their dividend each year, and reinvesting payouts to buy more shares compounds the effect — the classic engine behind long-term dividend-growth investing. This tool models both, assuming a steady share price.",
  ],
  steps: [
    "Enter the amount invested and the dividend yield (%).",
    "Add the expected annual dividend growth rate, or leave it at 0 for a flat payout.",
    "Set the number of years to project over.",
    "Toggle 'Reinvest dividends (DRIP)' to compound, then read the income and ending balance.",
  ],
  faq: [
    {
      q: "How is dividend income calculated?",
      a: "Annual dividend income is the amount invested times the dividend yield. For example, $10,000 at a 4% yield pays $400 a year, or about $33 a month. If the dividend grows each year, later years pay more.",
    },
    {
      q: "What is a DRIP (dividend reinvestment plan)?",
      a: "A DRIP automatically uses your dividends to buy more shares instead of paying cash. Those extra shares then pay their own dividends, so your income and balance compound over time. Toggle reinvestment on to model this.",
    },
    {
      q: "What is a good dividend yield?",
      a: "Broad-market index funds yield roughly 1.5–3%, while dividend-focused funds and many mature companies yield 3–5%. Very high yields (above about 7–8%) can signal risk, as they sometimes reflect a falling share price or an unsustainable payout.",
    },
    {
      q: "Does this include share-price growth?",
      a: "No. To stay conservative, this calculator assumes the share price doesn't change, so the balance grows only from reinvested dividends. Real returns also depend on capital gains or losses, which vary with the market.",
    },
    {
      q: "Are dividends taxed?",
      a: "Usually yes. Qualified dividends are often taxed at lower long-term capital-gains rates, while ordinary dividends are taxed as income; rates and rules vary by country and account type. Holding dividend stocks in a tax-advantaged account can defer or avoid that tax. This tool shows pre-tax figures.",
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
      <DividendCalculator />
    </CalcShell>
  );
}
