import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { AprCalculator } from "@/components/calculators/apr";

const SLUG = "apr-calculator";

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
    "This APR calculator shows the true annual percentage rate on a loan once upfront fees are taken into account. The advertised, or nominal, rate only reflects the interest charged, but fees reduce the money you actually receive — so the effective cost of borrowing is higher. Enter the loan amount, the nominal rate, the term and any upfront fees to see the real APR.",
    "The calculation first works out your fixed monthly payment from the nominal rate using the standard amortization formula. It then finds the interest rate that equates the amount you actually receive after fees to that stream of payments, and expresses it as an annual rate. When there are no fees, the true APR equals the nominal rate.",
  ],
  steps: [
    "Enter the loan amount and choose your currency.",
    "Type the nominal interest rate (the advertised APR) as a percentage.",
    "Set the term in years.",
    "Add any upfront fees, then read the true APR, monthly payment and total paid.",
  ],
  faq: [
    {
      q: "What is the difference between nominal rate and APR?",
      a: "The nominal rate is the stated interest rate on the loan. The APR (annual percentage rate) folds in upfront fees, so it reflects the true yearly cost of borrowing. When a loan has fees, its APR is higher than its nominal rate.",
    },
    {
      q: "How is the true APR calculated?",
      a: "The calculator finds the monthly payment from the nominal rate, then solves for the interest rate that makes the net amount you receive (loan amount minus fees) equal to the present value of those payments. That monthly rate is multiplied by 12 to give the annual APR.",
    },
    {
      q: "Why does adding fees raise the APR?",
      a: "Fees mean you receive less money than the loan's face value but still repay the full amount plus interest. Spreading that extra cost over the loan term raises the effective interest rate, which is what the APR captures.",
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
      <AprCalculator />
    </CalcShell>
  );
}
