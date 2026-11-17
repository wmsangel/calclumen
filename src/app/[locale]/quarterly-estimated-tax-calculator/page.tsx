import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { QuarterlyEstimatedTaxCalculator } from "@/components/calculators/quarterly-estimated-tax";

const SLUG = "quarterly-estimated-tax-calculator";

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
    "If you earn money without an employer withholding tax — freelancing, contracting on a 1099, running a side business or a sole proprietorship — the IRS expects you to pay as you go through quarterly estimated tax payments on Form 1040-ES. This calculator works out what you owe for tax year 2026: self-employment tax on your net profit, federal income tax after the standard deduction and the optional QBI deduction, any Additional Medicare Tax, and a flat estimate for state tax. It then applies the safe-harbor rules to tell you the amount to send each quarter so you avoid an underpayment penalty.",
    "The key idea is the safe harbor. You do not have to predict your tax to the dollar: as long as your withholding plus estimated payments reach the smaller of 90% of this year's tax or 100% of last year's tax (110% if last year's adjusted gross income was over $150,000), there is no penalty even if you end up owing more in April. And if the balance you would owe after withholding is under $1,000, estimated payments are not required at all. Enter last year's total tax from Form 1040 line 24 to let the calculator pick the cheaper safe harbor for you.",
    "Worked example: a single freelancer with $80,000 of net profit, no W-2 job and no prior-year return. Self-employment tax is 15.3% of 92.35% of the profit, $11,304. Half of that is deducted, so AGI is $74,348; after the $16,100 standard deduction and a 20% QBI deduction of $11,650, taxable income is $46,599 and federal income tax comes to $5,344, for a total of $16,647. Ninety percent of that is the safe harbor, so $3,746 is due each quarter — plus state tax, if your state has one.",
  ],
  steps: [
    "Pick your filing status and enter your expected net profit for the year (income minus business expenses). Add W-2 wages, other income and any federal tax already withheld if you also have a job.",
    "Enter last year's total tax (Form 1040 line 24) and say whether last year's AGI was over $150,000 — this sets the prior-year safe harbor at 100% or 110%.",
    "Choose whether to apply the 20% QBI deduction, enter your state's flat rate, and read the quarterly amount, the full tax breakdown and the four due dates. Copy the result or the link to keep it.",
  ],
  methodology: [
    "Self-employment tax follows Schedule SE: 92.35% of net profit is subject to 12.4% Social Security tax up to the 2026 wage base of $184,500 (W-2 wages use up the base first) and 2.9% Medicare tax with no cap. Half of the self-employment tax is an adjustment to income. Adjusted gross income is wages plus other income plus net profit minus that deduction; taxable income is AGI minus the 2026 standard deduction ($16,100 single, $32,200 married filing jointly) and, if selected, the qualified business income deduction — 20% of profit after the SE deduction, capped at 20% of taxable income, which is the simplified rule that applies below the income thresholds.",
    "Federal income tax uses the 2026 brackets from IRS Rev. Proc. 2025-32 (10% to 37%). The 0.9% Additional Medicare Tax applies to wages plus self-employment earnings above $200,000 ($250,000 married filing jointly). The required annual payment follows Publication 505: the smaller of 90% of the current year's total federal tax and 100% (or 110%) of last year's tax; nothing is required if the balance due after withholding is under $1,000. What remains after withholding and payments already made is split into four equal instalments due April 15, June 15 and September 15, 2026 and January 15, 2027.",
    "Not modelled: itemized deductions, tax credits (child tax credit, education, health-insurance premium credits), retirement-plan and HSA deductions, the self-employed health-insurance deduction, capital-gains rates, AMT, the annualized income method for uneven income, state rules beyond a flat rate, and local taxes. Married filing separately uses different thresholds and is not offered. Figures are estimates for planning; the IRS worksheet in Form 1040-ES or a tax professional is the authority on what you owe.",
  ],
  sources: [
    { label: "IRS Form 1040-ES (2026), Estimated Tax for Individuals", url: "https://www.irs.gov/forms-pubs/about-form-1040-es" },
    { label: "IRS Publication 505, Tax Withholding and Estimated Tax — chapter 2", url: "https://www.irs.gov/publications/p505" },
    { label: "IRS Rev. Proc. 2025-32 — 2026 brackets and standard deduction", url: "https://www.irs.gov/pub/irs-drop/rp-25-32.pdf" },
    { label: "IRS — About Schedule SE (Form 1040), Self-Employment Tax", url: "https://www.irs.gov/forms-pubs/about-schedule-se-form-1040" },
    { label: "Social Security Administration — Contribution and benefit base", url: "https://www.ssa.gov/oact/cola/cbb.html" },
  ],
  faq: [
    {
      q: "When are quarterly estimated taxes due in 2026?",
      a: "For tax year 2026 the four payments are due April 15, June 15 and September 15, 2026 and January 15, 2027. The periods are not equal quarters: the second payment covers only April and May. If a date falls on a weekend or legal holiday, the deadline moves to the next business day, and you can skip the January payment if you file your return and pay the full balance by February 1, 2027.",
    },
    {
      q: "What is the safe harbor for estimated taxes?",
      a: "You avoid the underpayment penalty if your withholding and estimated payments for the year total at least the smaller of 90% of this year's tax or 100% of last year's tax — 110% if your adjusted gross income on last year's return was more than $150,000 ($75,000 if married filing separately). You also owe no penalty if the balance due after withholding is under $1,000. The calculator applies these rules automatically when you enter last year's tax.",
    },
    {
      q: "Do I need to make estimated payments if I also have a W-2 job?",
      a: "Only if your withholding does not cover the safe harbor. Many people with a side business avoid quarterly payments entirely by raising the withholding on their W-2 paycheck with a new Form W-4 — withholding counts as if it were paid evenly through the year, which estimated payments do not. Enter your wages and withholding above to see whether anything is left to pay.",
    },
    {
      q: "What happens if I pay too little or pay late?",
      a: "The IRS charges an underpayment penalty, which is essentially interest (the federal short-term rate plus 3 percentage points, set quarterly) on the shortfall for each period it was unpaid, computed on Form 2210. It is not a flat fine, so paying late in the year is cheaper than not paying at all, and catching up by the January deadline limits the cost. If your income is uneven, the annualized income installment method on Form 2210 can reduce or remove the penalty.",
    },
    {
      q: "How do I actually pay?",
      a: "Online through IRS Direct Pay from a bank account (free), through your IRS Online Account, by card through an approved processor (fee applies), by EFTPS, or by mailing the 1040-ES voucher with a check. Choose tax year 2026 and payment type 'Estimated tax'. Keep the confirmations — you will enter the total on your return.",
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
      <QuarterlyEstimatedTaxCalculator />
    </CalcShell>
  );
}
