import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { RothIraCalculator } from "@/components/calculators/roth-ira";

const SLUG = "roth-ira-calculator";

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
    "This Roth IRA calculator projects the value of your account at retirement and shows how much of that total is tax-free growth. It compounds your current balance and yearly contributions at your expected rate of return until the retirement age you choose. Because a Roth IRA is funded with after-tax money, qualified withdrawals in retirement — both your contributions and all of the growth — come out completely tax-free.",
    "To make that advantage concrete, the calculator also estimates what the same contributions would be worth in an ordinary taxable brokerage account, where investment gains are taxed. The difference is the tax you save by using a Roth IRA. It is often large, because decades of compounding turn into a big pile of gains that a Roth shelters entirely.",
  ],
  steps: [
    "Enter your current age and the age you plan to retire.",
    "Enter your current Roth IRA balance and how much you contribute each year.",
    "Set your expected annual return and the capital-gains tax rate you'd otherwise pay.",
    "Read your projected tax-free balance and the tax you save versus a taxable account.",
  ],
  faq: [
    {
      q: "Why is a Roth IRA withdrawal tax-free?",
      a: "You contribute money you have already paid income tax on, so the IRS lets qualified withdrawals — generally after age 59½ and once the account is at least five years old — come out with no further tax on either your contributions or the investment growth.",
    },
    {
      q: "How is the 'tax saved vs taxable account' figure calculated?",
      a: "It compares your Roth balance with the same contributions grown in a taxable account, where the gains are taxed at the capital-gains rate you enter. The Roth pays no tax on those gains, so the difference is your estimated tax saving. It is a simplified estimate and does not model dividend taxes each year or changing tax brackets.",
    },
    {
      q: "Does this enforce the annual contribution limit?",
      a: "No. The IRS sets an annual Roth IRA contribution limit (with a higher catch-up limit from age 50) and phases out eligibility at higher incomes. The calculator uses whatever contribution you enter, so make sure your amount is within the current limit for your situation.",
    },
    {
      q: "Roth IRA or traditional IRA / 401(k)?",
      a: "A Roth is usually favoured if you expect to be in the same or a higher tax bracket in retirement, since you lock in today's tax rate and withdraw tax-free later. Traditional accounts give you a tax deduction now but are taxed on withdrawal. Many savers use both, and always contribute at least enough to a 401(k) to capture any employer match first.",
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
      <RothIraCalculator />
    </CalcShell>
  );
}
