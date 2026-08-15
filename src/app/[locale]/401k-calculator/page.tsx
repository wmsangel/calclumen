import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { K401Calculator } from "@/components/calculators/k401";

const SLUG = "401k-calculator";

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
    "This 401(k) calculator projects the value of your workplace retirement account at retirement, including the employer match. It grows your current balance and your yearly contributions at your expected rate of return, while your salary — and therefore your contributions — rises each year with the pay-growth rate you set.",
    "The employer match is often the highest-return money in your plan: many employers match a percentage of what you put in, up to a limit expressed as a share of your salary. The calculator applies the match only up to that limit, so you can see how much free money you collect and how contributions, the match and compound growth each add to the final total.",
  ],
  steps: [
    "Enter your current age, retirement age, salary and current 401(k) balance.",
    "Set the percentage of salary you contribute each year.",
    "Enter your employer's match rate and the match limit as a percentage of salary.",
    "Set your expected annual return and salary growth, then read your projected balance and its breakdown.",
  ],
  faq: [
    {
      q: "How does the employer match work here?",
      a: "The employer matches a percentage of your contribution, but only on the part of your contribution up to the match limit. For example, a 50% match up to 6% of salary means the employer adds 50 cents for every dollar you contribute, on the first 6% of your pay.",
    },
    {
      q: "Should I always contribute at least up to the match?",
      a: "Contributing at least enough to get the full employer match is usually the first priority in retirement saving, because the match is an immediate, guaranteed return on your money that you forfeit if you contribute less.",
    },
    {
      q: "Does this include contribution limits or taxes?",
      a: "No. The projection does not enforce annual IRS contribution limits and does not model taxes on withdrawals. It is a nominal, pre-tax growth estimate to help you compare contribution and match scenarios.",
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
      <K401Calculator />
    </CalcShell>
  );
}
