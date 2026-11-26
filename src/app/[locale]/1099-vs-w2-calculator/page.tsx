import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { W2Vs1099Calculator } from "@/components/calculators/w2-vs-1099";

const SLUG = "1099-vs-w2-calculator";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const calc = getCalc(SLUG)!;
  return pageMetadata({ locale, path: SLUG, title: calc.heading, description: calc.description, keywords: calc.keywords });
}

const content: CalcContent = {
  intro: [
    "A 1099 contract that pays more than a W-2 salary is not automatically the better deal. As a contractor you pay both halves of Social Security and Medicare (15.3% self-employment tax instead of the employee's 7.65%), buy your own health insurance, fund your own retirement, and get no paid days off; in return you deduct business expenses and usually the 20% qualified business income deduction. This calculator puts the two offers side by side for tax year 2026 and tells you two things: which arrangement leaves more in your pocket once taxes and benefits are counted, and the break-even 1099 rate — the gross contract income that matches the W-2 package exactly.",
    "Worked example (single filer, no state tax): a $90,000 salary with $7,000 of employer-paid health premiums, a $3,600 401(k) match and 25 paid days off is worth $91,399 a year — $72,145 take-home plus $19,254 of benefits. A $110,000 contract with $5,000 of expenses and $8,400 of self-paid health insurance leaves $74,190 after $14,836 of self-employment tax and $7,574 of income tax — $17,209 less than the job. The break-even contract rate is $134,757, about 1.5 times the salary, or $65 an hour at 2,080 hours.",
    "The multiple most recruiters quote — 'add 25–30% to your salary for 1099' — is roughly right for a bare salary and too low once a good benefits package is in the picture. Use the fields on the W-2 side to value what the employer actually pays for; on the 1099 side, be honest about expenses (only what you would genuinely spend) and remember that income tax applies to profit, not gross.",
  ],
  steps: [
    "Enter the W-2 offer: salary, the employer's share of health premiums, the 401(k) match and paid days off (and your own pre-tax 401(k) deferral, if you make one).",
    "Enter the 1099 offer: gross contract income, deductible business expenses, the health insurance you would buy yourself and any SEP-IRA or Solo 401(k) contribution; choose whether the QBI deduction applies.",
    "Compare the verdict, the two total values and the break-even rate; copy the result or the link to send to a recruiter or your accountant.",
  ],
  methodology: [
    "W-2 side: employee FICA is 6.2% Social Security up to the 2026 wage base ($184,500) plus 1.45% Medicare, with 0.9% Additional Medicare Tax on wages over $200,000 ($250,000 married filing jointly). Federal income tax uses the 2026 standard deduction ($16,100 single, $32,200 joint) and brackets from Rev. Proc. 2025-32; a pre-tax 401(k) deferral reduces taxable wages. Benefits are counted at cost to the employer: health premium share, 401(k) match, and paid days off valued at salary ÷ 260 working days. Total value = take-home + your 401(k) deferral + benefits.",
    "1099 side: net profit = gross − business expenses. Self-employment tax (Schedule SE) is 15.3% of 92.35% of profit (12.4% Social Security up to the wage base, 2.9% Medicare, no cap), half of it deductible; self-paid health insurance and SEP/Solo 401(k) contributions are above-the-line deductions; the QBI deduction is 20% of qualified income capped at 20% of taxable income (the simplified rule below the income thresholds). Take-home = profit − taxes − health premiums − retirement contribution; total value adds the retirement contribution back, because it is still your money. The break-even 1099 rate is found numerically: the gross contract income at which the 1099 total value equals the W-2 total value.",
    "Not modelled: state-specific brackets (flat rate only), itemized deductions and credits, the employer's share of FICA as an argument for a lower salary, unemployment and disability insurance, workers' compensation, the value of an employer HSA contribution, equity compensation, and the risk side of contracting (gaps between contracts, late invoices). The IRS, not the label on the contract, decides who is an employee — see the common-law test.",
  ],
  sources: [
    { label: "IRS — Independent contractor (self-employed) or employee?", url: "https://www.irs.gov/businesses/small-businesses-self-employed/independent-contractor-self-employed-or-employee" },
    { label: "IRS Topic 751 — Social Security and Medicare withholding rates", url: "https://www.irs.gov/taxtopics/tc751" },
    { label: "IRS — About Schedule SE (Form 1040), Self-Employment Tax", url: "https://www.irs.gov/forms-pubs/about-schedule-se-form-1040" },
    { label: "IRS Rev. Proc. 2025-32 — 2026 brackets and standard deduction", url: "https://www.irs.gov/pub/irs-drop/rp-25-32.pdf" },
    { label: "IRS Publication 535 — Self-employed health insurance deduction", url: "https://www.irs.gov/publications/p535" },
  ],
  faq: [
    { q: "How much more should a 1099 contractor make than a W-2 employee?", a: "Enough to cover the employer half of FICA (7.65%), the benefits you lose and the paid time off, plus the risk of gaps between contracts. For a bare salary with no benefits that is roughly 20–30% more; with employer health insurance, a 401(k) match and 25 days off it is closer to 50%, as the example above shows. The calculator gives the exact break-even figure for your numbers." },
    { q: "Is 1099 income taxed more than W-2 income?", a: "Income tax rates are the same; the difference is payroll tax. An employee pays 7.65% and the employer pays the other 7.65%; a contractor pays both halves as 15.3% self-employment tax, but on 92.35% of profit, with half of it deductible, and after business expenses — so the real gap is smaller than 7.65 points. The 20% QBI deduction, available to most sole proprietors, narrows it further." },
    { q: "Can I deduct my health insurance as a 1099 contractor?", a: "Yes, usually in full, as an above-the-line deduction (Schedule 1), as long as you are not eligible for an employer plan (including a spouse's) and the business has a profit. It reduces income tax but not self-employment tax. The calculator treats premiums you buy as deductible and as a cash cost." },
    { q: "What about retirement — isn't a 401(k) match free money?", a: "It is, and it is counted on the W-2 side. On the 1099 side you can contribute far more yourself through a SEP-IRA or Solo 401(k) — up to 25% of net earnings plus the employee deferral — which lowers your taxable income. Enter a contribution to see the effect; it stays in your total value because it is still your money." },
    { q: "Can my employer just switch me to 1099 to save money?", a: "Not legally, if the work is the same. The IRS looks at behavioral control, financial control and the relationship, not the contract label; misclassified workers can file Form SS-8 and Form 8919. If you are offered 1099 for what is essentially an employee role, price in that you are taking on the employer's costs and risks." },
  ],
};

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <CalcShell locale={locale} slug={SLUG} content={content}>
      <W2Vs1099Calculator />
    </CalcShell>
  );
}
