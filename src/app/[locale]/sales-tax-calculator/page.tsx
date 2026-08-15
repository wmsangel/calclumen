import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { SalesTaxCalculator } from "@/components/calculators/sales-tax";

const SLUG = "sales-tax-calculator";

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
    "This sales tax calculator adds tax to a price or strips it back out again. Use 'Add tax' when you have a pre-tax amount and want the total a customer pays, or 'Remove tax' when you have a tax-inclusive total and need to find the original price and the tax portion.",
    "Sales tax is applied as a simple percentage of the pre-tax price. The calculator breaks the figure into the tax amount, the pre-tax price and the total so you can use it for receipts, invoices, expense reports or quick checks at the register.",
  ],
  steps: [
    "Choose 'Add tax' to add tax on top, or 'Remove tax' to work it out of a total.",
    "Enter the amount and select your currency.",
    "Type the sales tax rate as a percentage.",
    "Read the tax amount, pre-tax price and total price.",
  ],
  faq: [
    {
      q: "How do I remove sales tax from a total?",
      a: "Divide the tax-inclusive total by (1 + rate ÷ 100) to get the pre-tax price, then subtract that from the total to find the tax. The 'Remove tax' mode does this for you.",
    },
    {
      q: "Is sales tax the same everywhere?",
      a: "No. Rates vary by country, state, county and city, and some items are taxed differently or exempt. Enter the exact combined rate that applies to your purchase.",
    },
    {
      q: "What is the difference between sales tax and VAT?",
      a: "Sales tax is charged once at the final point of sale, while VAT is collected in stages along the supply chain. The math for a single transaction is similar, but the systems differ — use the VAT calculator for VAT-inclusive pricing.",
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
      <SalesTaxCalculator />
    </CalcShell>
  );
}
