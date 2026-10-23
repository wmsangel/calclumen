import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { PropertyTaxCalculator } from "@/components/calculators/property-tax";

const SLUG = "property-tax-calculator";

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
    "This property tax calculator estimates what you'll owe each year on a home. Enter the home's market value and your local property tax rate, and it returns the annual tax, the monthly amount (useful for a mortgage escrow), and your effective tax rate. Add an assessment ratio or exemptions if your area uses them for a more exact figure.",
    "Property tax is charged on the assessed value of a home, which many jurisdictions set below market value using an assessment ratio. Exemptions — such as a homestead, senior or veteran exemption — are subtracted before the rate is applied, so your taxable value can be well under the sale price.",
  ],
  steps: [
    "Enter the home's market value and your local property tax rate (as a percentage).",
    "If your area assesses below market value, set the assessment ratio (otherwise leave it at 100%).",
    "Add any exemptions you qualify for, such as a homestead exemption.",
    "Read the annual tax, the monthly escrow amount and your effective tax rate.",
  ],
  faq: [
    {
      q: "How is property tax calculated?",
      a: "Property tax is the taxable value of your home times the local tax rate. The taxable value is the assessed value (market value times the assessment ratio) minus any exemptions. For example, a $350,000 home taxed at 1.1% with no exemptions owes about $3,850 a year.",
    },
    {
      q: "What is a mill or millage rate?",
      a: "A mill is $1 of tax per $1,000 of assessed value, which is 0.1%. So a 10-mill rate equals 1%, and 15 mills equals 1.5%. If your rate is quoted in mills, divide by 10 to get the percentage to enter here.",
    },
    {
      q: "Why is my effective tax rate lower than the rate I entered?",
      a: "The effective rate is the annual tax divided by the home's market value. When your area assesses below market value or you have exemptions, the taxable amount is smaller than the market value, so the tax you actually pay is a smaller share of what the home is worth.",
    },
    {
      q: "What is a homestead exemption?",
      a: "A homestead exemption reduces the taxable value of a primary residence by a set amount, lowering the tax bill. Many US states offer one, along with exemptions for seniors, veterans or people with disabilities. Enter the exemption amount to see its effect.",
    },
    {
      q: "Is property tax included in my mortgage payment?",
      a: "Often yes. Lenders usually collect one-twelfth of the annual property tax each month into an escrow account and pay the bill for you. The monthly figure here is that escrow amount, though your lender may add a small cushion.",
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
      <PropertyTaxCalculator />
    </CalcShell>
  );
}
