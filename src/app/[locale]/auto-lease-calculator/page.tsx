import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { AutoLeaseCalculator } from "@/components/calculators/auto-lease";

const SLUG = "auto-lease-calculator";

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
    "This auto lease calculator estimates the monthly payment on a car lease from the vehicle's price, the negotiated capitalized cost, the residual value at lease end and the money factor. A lease payment is made up of two parts — a depreciation fee that covers the value the car loses while you drive it, and a finance fee that is the interest on the deal.",
    "The residual value is a percentage of the MSRP that the car is expected to be worth when the lease ends, so a higher residual means less depreciation and a lower payment. The money factor is the lease equivalent of an interest rate; multiply it by 2,400 to see the approximate APR. Sales tax is applied to the base monthly payment.",
  ],
  steps: [
    "Enter the vehicle MSRP and choose your currency.",
    "Add the negotiated capitalized cost, your down payment and the residual percentage.",
    "Set the lease term in months, the money factor and the sales tax rate.",
    "Read your monthly payment, depreciation and finance fees and equivalent APR.",
  ],
  faq: [
    {
      q: "What is a money factor?",
      a: "The money factor is how lease interest is quoted. Multiply it by 2,400 to convert it to an approximate annual percentage rate — for example a money factor of 0.00125 equals about 3% APR.",
    },
    {
      q: "What is the residual value?",
      a: "The residual value is the amount the leasing company expects the car to be worth at the end of the lease, set as a percentage of MSRP. A higher residual lowers depreciation and therefore your monthly payment.",
    },
    {
      q: "Why is a lease cheaper than a loan?",
      a: "With a lease you only pay for the depreciation during the term plus finance charges, not the whole car. That usually makes the monthly payment lower than financing the full purchase price.",
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
      <AutoLeaseCalculator />
    </CalcShell>
  );
}
