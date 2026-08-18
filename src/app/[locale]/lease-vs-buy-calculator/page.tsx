import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { LeaseVsBuyCalculator } from "@/components/calculators/lease-vs-buy";

const SLUG = "lease-vs-buy-calculator";

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
    "This lease-vs-buy calculator compares the cost of leasing a car against buying one over the same period. Enter the lease terms — the monthly payment, the term in months and the down payment — then the purchase details, including the car price, down payment, loan APR, loan term and the estimated resale value at the end of the lease term.",
    "The comparison is made over the lease term. The lease total is the lease down payment plus every monthly lease payment. The buy net cost is the buy down payment plus the loan payments made during that same window, minus the car's resale value — because when you buy, you keep the vehicle and its remaining worth. The cheaper option is whichever total is lower.",
  ],
  steps: [
    "Enter the monthly lease payment, lease term in months and lease down payment.",
    "Enter the car price, buy down payment, loan APR and loan term in months.",
    "Enter the estimated resale value of the car at the end of the lease term.",
    "Read which option is cheaper, along with the lease total cost and the buy net cost.",
  ],
  faq: [
    {
      q: "How does the lease-vs-buy comparison work?",
      a: "It compares total spending over the lease term. Leasing adds the down payment and every monthly lease payment. Buying adds the down payment and the loan payments made in that window, then subtracts the car's resale value because you still own the vehicle.",
    },
    {
      q: "Why does buying subtract the resale value?",
      a: "When you buy, you keep the car and its remaining worth at the end of the period. Subtracting the resale value reflects the equity you hold, which leasing does not give you.",
    },
    {
      q: "Does this include insurance, maintenance or taxes?",
      a: "No. It compares payments and resale value only. Insurance, maintenance, registration and sales tax can differ between leasing and buying and are not included here.",
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
      <LeaseVsBuyCalculator />
    </CalcShell>
  );
}
