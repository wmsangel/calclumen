import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { TraditionalIraCalculator } from "@/components/calculators/traditional-ira";

const SLUG = "traditional-ira-calculator";

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
    "This Traditional IRA calculator projects what your account could be worth at retirement and what it's worth after tax. Enter your age, balance, annual contribution and expected return, and it compounds your savings to retirement — then applies your retirement tax rate to show the after-tax value, since Traditional IRA withdrawals are taxed as income.",
    "A Traditional IRA is tax-deferred: contributions are usually pre-tax, so they lower your taxable income today, and the money grows without yearly tax drag. You pay income tax only when you withdraw in retirement. That makes it most valuable when your tax rate is lower in retirement than it is now.",
  ],
  steps: [
    "Enter your current age, your planned retirement age and your current IRA balance.",
    "Add your annual contribution and the return you expect each year.",
    "Set your tax rate now and your expected tax rate in retirement.",
    "Read the projected balance, its after-tax value, your contributions and the tax-deferred growth.",
  ],
  faq: [
    {
      q: "How is a Traditional IRA taxed?",
      a: "Contributions are typically pre-tax, so they reduce your taxable income in the year you make them. The balance grows tax-deferred, and you pay ordinary income tax on withdrawals in retirement. This calculator shows both the pre-tax balance and the after-tax value using your retirement tax rate.",
    },
    {
      q: "Traditional IRA or Roth IRA — which is better?",
      a: "A Traditional IRA deducts tax now and taxes withdrawals later, so it wins if your tax rate will be lower in retirement. A Roth IRA is funded with after-tax money and withdrawals are tax-free, which wins if your rate will be higher later. If your rate is the same, the two are mathematically equivalent on the same contribution.",
    },
    {
      q: "How much can I contribute to a Traditional IRA?",
      a: "The IRS sets an annual limit that changes over time, with an extra catch-up amount once you reach 50. Contribution deductibility can also phase out at higher incomes if you're covered by a workplace plan. Check the current year's IRS limits before maximizing.",
    },
    {
      q: "What are required minimum distributions (RMDs)?",
      a: "Traditional IRAs require you to start withdrawing a minimum amount each year, currently from age 73. Those withdrawals are taxed as income. Roth IRAs have no RMDs for the original owner. This tool estimates growth to retirement and does not model RMD schedules.",
    },
    {
      q: "What return should I assume?",
      a: "A diversified long-term portfolio has historically returned roughly 6–8% a year before inflation, but returns vary and are never guaranteed. Try a few rates to see a range of outcomes rather than relying on a single number.",
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
      <TraditionalIraCalculator />
    </CalcShell>
  );
}
