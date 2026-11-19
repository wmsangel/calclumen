import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { ExtraPaymentCalculator } from "@/components/calculators/extra-payment";

const SLUG = "extra-payment-calculator";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const calc = getCalc(SLUG)!;
  return pageMetadata({ locale, path: SLUG, title: calc.heading, description: calc.description, keywords: calc.keywords });
}

const content: CalcContent = {
  intro: [
    "Every dollar you pay above the scheduled mortgage or loan payment goes straight to principal, and because interest is charged on the balance, that dollar also stops earning interest for the lender for the rest of the term. This extra payment calculator shows exactly what that is worth: enter your balance, rate and remaining term, then add an extra amount each month, a lump sum once a year (a bonus or tax refund), a one-time payment, or any combination, and see the interest saved, how many years you cut off, and the balance year by year next to the original schedule.",
    "Worked example: a $300,000 mortgage at 6.5% with 30 years left has a scheduled payment of $1,896 and costs $382,633 in interest over its life. Paying an extra $200 every month clears it in 23 years 1 month instead of 30 — 6 years 11 months sooner — and cuts total interest to $279,185, a saving of $103,449 for $53,936 of extra payments (the last one is partial). The same $2,400 a year paid as a single lump sum each December saves $99,670 and takes two months longer, because the money sits on the balance longer before it is applied.",
    "Timing matters more than most people expect. A one-time $20,000 payment in the first month of a 30-year loan at 6.5% saves far more interest than the same $20,000 in year 20, because early in the term almost all of each payment is interest. The calculator keeps your scheduled payment unchanged, which is how most US lenders apply prepayments by default; if you instead ask the lender to recast the loan, the payment drops and the term stays — a different decision, usually with a fee.",
  ],
  steps: [
    "Enter the current balance, the interest rate and the remaining term in years (for a new loan, the full term).",
    "Add the extra payments you plan to make: a monthly amount, a yearly lump sum and the month it is paid, and/or a one-time payment and the payment number it lands on.",
    "Compare interest saved and the months cut from the term, check the year-by-year balance table, and copy the result or the link to share the scenario.",
  ],
  methodology: [
    "Both scenarios use standard monthly amortization: each month's interest is the outstanding balance times the annual rate divided by 12, the scheduled payment covers that interest first and the remainder reduces the balance, and the scheduled payment is the standard fixed-rate amount for the balance, rate and term you enter. In the extra-payment scenario every extra dollar is applied to principal in the month it is paid, immediately after the scheduled payment; the scheduled payment itself does not change, so the loan simply ends earlier. Interest saved is the difference between the two totals, and months saved is the difference in payoff months.",
    "Not modelled: prepayment penalties (rare on US conforming mortgages after the first years, but check the note), lenders that hold extra funds until the next due date rather than applying them to principal at once, escrow for tax and insurance, PMI dropping off earlier because of the faster equity build (a real extra benefit), the tax deductibility of mortgage interest, and the alternative use of the money — the investment return you forgo by prepaying a low-rate loan. For loans with daily interest accrual (many auto and student loans) the saving is slightly different but the shape of the result is the same.",
  ],
  sources: [
    { label: "CFPB — What is a prepayment penalty?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-prepayment-penalty-en-1957/" },
    { label: "CFPB — What is a mortgage recast?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-loan-recast-en-2027/" },
    { label: "12 CFR §1026.41 — Periodic statements; application of payments (Regulation Z)", url: "https://www.ecfr.gov/current/title-12/chapter-X/part-1026/subpart-E/section-1026.41" },
  ],
  faq: [
    { q: "Is it better to pay extra every month or one lump sum a year?", a: "Monthly, by a small margin: each extra dollar starts saving interest the moment it hits the balance, so twelve payments of $200 beat one $2,400 payment in December. Paying the lump sum early in the year (January) closes most of the gap. The calculator lets you compare both for your numbers." },
    { q: "Should I pay off my mortgage early or invest the money?", a: "Prepaying a loan is a guaranteed, tax-free return equal to the loan's interest rate. If the rate is 6.5% and you would otherwise hold cash or bonds earning less, prepaying wins; if you have high-rate credit-card debt, pay that first; if you have no emergency fund or are missing an employer 401(k) match, do those first. Many people split the difference. See the compound interest calculator to compare the investment side." },
    { q: "How do I make sure the extra goes to principal?", a: "Tell the servicer. Most online payment forms have a separate 'additional principal' field; if you simply overpay, some servicers hold the surplus as a prepayment of next month's bill, which saves nothing. Check the next statement: the principal balance should drop by the extra amount." },
    { q: "Does paying extra lower my monthly payment?", a: "Not by default — the payment stays the same and the loan ends sooner. If you want a lower payment, ask about a recast: after a large principal payment the lender re-amortizes the remaining balance over the remaining term, usually for a fee of a few hundred dollars, without a new loan or credit check." },
    { q: "Can I use this for a car loan or student loan?", a: "Yes for the shape of the answer — interest saved and months cut — because they amortize the same way. Many auto and student loans accrue interest daily rather than monthly and some lenders apply extra payments to future installments unless you specify 'principal only', so confirm with the servicer." },
  ],
};

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <CalcShell locale={locale} slug={SLUG} content={content}>
      <ExtraPaymentCalculator />
    </CalcShell>
  );
}
