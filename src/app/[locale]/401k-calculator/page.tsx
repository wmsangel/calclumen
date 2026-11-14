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
  methodology: [
    "Each year the calculator adds your contribution (salary × contribution rate) and the employer match — your contribution matched at the employer's percentage, but only up to the match limit as a share of salary — then grows the balance at your expected annual return. Salary rises by the growth rate you set, which raises both contributions in later years.",
    "Not modelled: the IRS annual elective-deferral limit and catch-up contributions, vesting schedules that can forfeit part of the match if you leave, plan fees, taxes on withdrawal (traditional) or contributions (Roth), and years with negative returns. The projection is a smooth-return illustration, not a forecast.",
  ],
  sources: [
    { label: "IRS — 401(k) and profit-sharing plan contribution limits", url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits" },
    { label: "U.S. Department of Labor — A look at 401(k) plan fees", url: "https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/a-look-at-401k-plan-fees" },
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
