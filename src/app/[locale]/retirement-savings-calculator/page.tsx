import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { RetirementSavingsCalculator } from "@/components/calculators/retirement-savings";

const SLUG = "retirement-savings-calculator";

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
    "This retirement savings calculator projects how much your nest egg will be worth by the time you retire. It combines the money you have saved so far with your regular monthly contributions and compounds everything at your expected annual rate of return, month by month, until your retirement age.",
    "Because returns compound, the earlier you start and the more consistently you contribute, the larger the share of your final balance that comes from growth rather than your own deposits. You can also model a yearly increase to your contributions to mirror pay raises, which meaningfully lifts the final total over a long career.",
  ],
  steps: [
    "Enter your current age and the age at which you plan to retire.",
    "Enter how much you have saved today and how much you add each month.",
    "Set your expected annual return and, optionally, a yearly contribution increase.",
    "Read your projected balance at retirement, total contributions and total growth.",
  ],
  methodology: [
    "The projection compounds monthly: each month the balance grows by the annual return divided by 12, then the monthly contribution is added, from today until the retirement age you enter. It is the future value of the current balance plus the future value of an annuity of contributions at the same monthly rate. The result is nominal dollars unless you enter a real (inflation-adjusted) return.",
    "Not modelled: employer matching (see the 401(k) calculator), annual contribution limits, taxes on withdrawal, fees, sequence-of-returns risk and years with losses — a fixed return is an illustration, not a forecast. For how long the money lasts after retirement, use the retirement withdrawal rules of thumb (the 4% guideline) rather than this accumulation model.",
  ],
  sources: [
    { label: "U.S. SEC Investor.gov — Saving and investing for retirement", url: "https://www.investor.gov/additional-resources/retirement-toolkit" },
    { label: "U.S. Department of Labor — Top 10 ways to prepare for retirement", url: "https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/top-10-ways-to-prepare-for-retirement" },
  ],
  faq: [
    {
      q: "What rate of return should I assume?",
      a: "A common long-term assumption for a diversified stock-and-bond portfolio is around 6–7% per year before inflation. Lower it if your mix is more conservative. The calculator lets you try different rates so you can see how sensitive the result is.",
    },
    {
      q: "How does the annual contribution increase work?",
      a: "It raises your monthly contribution by the percentage you enter once every 12 months, mimicking annual pay raises. Even a small yearly bump compounds into a noticeably larger balance over several decades.",
    },
    {
      q: "Does this account for inflation or taxes?",
      a: "No. The projection is in nominal terms and ignores taxes and inflation. To estimate purchasing power in today's money, use a return figure net of expected inflation, or discount the final balance separately.",
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
      <RetirementSavingsCalculator />
    </CalcShell>
  );
}
