import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { StudentLoanCalculator } from "@/components/calculators/student-loan";

const SLUG = "student-loan-calculator";

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
    "This student loan calculator works out your monthly payment, how long the loan takes to clear and the total interest you'll pay. Enter the balance, interest rate and repayment term, then add an extra monthly payment to see how much interest and time it saves.",
    "It also handles the part a generic loan calculator misses: unsubsidized federal and private student loans accrue interest while you're still in school and through the grace period, and that interest is capitalized — added to the balance — when repayment begins. Enter the number of months before repayment starts and the calculator capitalizes the accrued interest before amortizing, so the payment you see is the one you'll actually owe.",
  ],
  steps: [
    "Enter the loan amount (the balance you borrowed) and its interest rate.",
    "Set the repayment term — the federal standard plan is 10 years.",
    "If repayment hasn't started yet, enter the months of school plus grace left so the accrued interest is capitalized.",
    "Add an extra monthly payment to see the interest saved and how much sooner the loan clears.",
  ],
  faq: [
    {
      q: "How is a student loan payment calculated?",
      a: "It's a standard amortizing payment: P × r / (1 − (1 + r)^−n), where P is the balance at the start of repayment, r is the annual rate divided by 12 and n is the number of months in the term. Each payment covers that month's interest first, and the rest reduces the principal — so the interest share shrinks as the balance falls.",
    },
    {
      q: "What is capitalized interest on a student loan?",
      a: "On unsubsidized loans, interest accrues from the day the money is disbursed — including while you're in school and during the six-month grace period. When repayment starts, that unpaid interest is capitalized: added to the principal, so you then pay interest on the interest. Paying even the interest-only amount while in school avoids it entirely.",
    },
    {
      q: "Does paying extra on student loans help?",
      a: "Yes. Federal and nearly all private student loans have no prepayment penalty, so any amount above the required payment goes straight to principal. Because interest is charged on the remaining balance, extra payments early in the term save the most — the calculator shows the exact interest saved and how many months it cuts off.",
    },
    {
      q: "What is a typical student loan interest rate?",
      a: "US federal Direct loans are set each academic year by Congress and have been in the 5–9% range in recent years, fixed for the life of the loan. Private loans are priced on credit and can be fixed or variable, typically spanning a wider range. Use the rate on your own loan statement rather than an average — the default here is only a starting point.",
    },
    {
      q: "Should I refinance my student loans?",
      a: "Refinancing replaces your loans with a new private loan at a new rate, which can cut interest if your credit and income have improved. The trade-off is real: refinancing a federal loan permanently gives up income-driven repayment, deferment and forgiveness programs. Compare the interest saved here against what those protections are worth to you. This is an estimate, not financial advice.",
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
      <StudentLoanCalculator />
    </CalcShell>
  );
}
