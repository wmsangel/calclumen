import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { DepreciationCalculator } from "@/components/calculators/depreciation";

const SLUG = "depreciation-calculator";

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
    "Depreciation spreads the cost of a business asset — a vehicle, machine, computer or piece of furniture — across the years it's used, instead of expensing it all at once. This calculator builds the full year-by-year schedule for the three methods that matter: straight-line, declining balance, and MACRS, the system used on US tax returns.",
    "Switch methods to compare them on the same asset. Straight-line is the simplest and is common for book (accounting) purposes; declining balance front-loads the deduction; MACRS uses the IRS percentage tables and is what you actually claim for US federal tax. Each gives you the first-year deduction and a schedule of depreciation, accumulated depreciation and remaining book value.",
  ],
  steps: [
    "Pick a method: straight-line, declining balance or MACRS.",
    "Enter the asset's cost (its depreciable basis).",
    "For straight-line or declining balance, add the salvage value and useful life; for MACRS, choose the IRS property class.",
    "Read the first-year deduction and the full year-by-year schedule of depreciation and book value.",
  ],
  faq: [
    {
      q: "What's the difference between straight-line and MACRS?",
      a: "Straight-line deducts the same amount each year over the asset's useful life and is common for accounting (book) purposes. MACRS (Modified Accelerated Cost Recovery System) is the method required for US federal tax: it ignores salvage value, uses fixed IRS percentage tables that front-load the deduction, and applies a half-year convention. Many businesses keep straight-line books but file MACRS.",
    },
    {
      q: "Why does a 7-year MACRS asset show 8 years?",
      a: "The half-year convention treats every asset as placed in service at the midpoint of the first year, so you get half a year of depreciation up front. That remaining half-year spills into an extra row at the end — which is why a 5-year asset runs 6 years and a 7-year asset runs 8.",
    },
    {
      q: "How does the declining-balance method work?",
      a: "Double-declining balance applies twice the straight-line rate to the remaining book value each year, so the deduction is largest early and tapers off. This calculator automatically switches to straight-line in the year that produces a larger deduction, and never depreciates below the salvage value — the standard textbook approach.",
    },
    {
      q: "What is salvage value?",
      a: "Salvage (or residual) value is what you expect the asset to be worth at the end of its useful life. Straight-line and declining balance stop depreciating once book value reaches salvage, so only cost minus salvage is depreciated. MACRS ignores salvage entirely and depreciates the full cost to zero.",
    },
    {
      q: "Does this include Section 179 or bonus depreciation?",
      a: "No. Section 179 expensing and bonus depreciation let you deduct a large share of an asset in year one before the regular schedule applies, and the mid-quarter convention can apply if most assets are bought late in the year. Those change the numbers — treat this as a planning estimate and confirm with a tax professional.",
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
      <DepreciationCalculator />
    </CalcShell>
  );
}
