import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { DownPaymentCalculator } from "@/components/calculators/down-payment";

const SLUG = "down-payment-calculator";

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
    "This down payment calculator shows how much cash you put down on a home and how large a mortgage you need to borrow. Enter the home price and the percentage you plan to put down, and it splits the price into your upfront payment and the remaining loan amount.",
    "The down payment is simply the home price multiplied by your chosen percentage, and the loan amount is whatever is left over. A larger down payment lowers the amount you borrow, reduces your monthly payment, and can help you avoid the extra cost of mortgage insurance.",
  ],
  steps: [
    "Enter the home price and pick your currency.",
    "Set the down payment percentage you plan to make.",
    "Read off your down payment amount and the loan you would need.",
    "Try different percentages to see how they change the loan size.",
  ],
  faq: [
    {
      q: "How much should I put down on a house?",
      a: "A 20% down payment is a common benchmark because it lets you avoid private mortgage insurance and keeps your loan smaller. Many buyers put down less, and some loan programs allow down payments as low as 3% to 5%.",
    },
    {
      q: "What is PMI and when do I pay it?",
      a: "Private mortgage insurance protects the lender if you stop making payments, and it is usually required when your down payment is below 20%. It adds to your monthly cost and can often be cancelled once you build enough equity in the home.",
    },
    {
      q: "Does a bigger down payment lower my monthly payment?",
      a: "Yes. Putting more money down reduces the amount you borrow, which lowers both the principal and the interest you pay each month. It can also help you qualify for a better interest rate.",
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
      <DownPaymentCalculator />
    </CalcShell>
  );
}
