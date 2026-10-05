import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { RentalPropertyCalculator } from "@/components/calculators/rental-property";

const SLUG = "rental-property-calculator";

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
    "Before you buy a rental, the numbers decide whether it's an asset or a liability. This calculator runs a property through the metrics investors actually use — monthly cash flow, cash-on-cash return, cap rate and DSCR — from the purchase price, your financing and the rent it brings in.",
    "Enter the deal once and you get the full picture: what the property earns each month after the mortgage, how hard your invested cash is working, how the price compares to the income regardless of financing, and whether a lender's debt-service test would pass. It's the fast first screen for deciding if a listing is worth a closer look.",
  ],
  steps: [
    "Enter the purchase price, your down payment percentage, the interest rate and the loan term.",
    "Add your closing and upfront costs — these are cash out of pocket on top of the down payment.",
    "Enter the monthly rent and your monthly operating expenses (tax, insurance, maintenance, management and a vacancy allowance — not the mortgage).",
    "Read the results: monthly cash flow, cash-on-cash return, cap rate, DSCR and the net operating income behind them.",
  ],
  faq: [
    {
      q: "What's a good cash-on-cash return on a rental?",
      a: "Many buy-and-hold investors look for 8–12% cash-on-cash, though what counts as 'good' depends on the market, the risk and your alternatives. It measures the annual pre-tax cash flow against the actual cash you put in (down payment plus closing and upfront costs), so it reflects the effect of your financing — unlike cap rate.",
    },
    {
      q: "What is the difference between cap rate and cash-on-cash return?",
      a: "Cap rate is net operating income divided by the purchase price and ignores the loan, so it compares properties on their own merits. Cash-on-cash divides the actual cash flow (after the mortgage) by the cash you invested, so it captures leverage. A low-cap-rate deal can still have a high cash-on-cash return if financing is cheap.",
    },
    {
      q: "What is DSCR and why do lenders care?",
      a: "Debt-service coverage ratio is net operating income divided by annual mortgage payments. A DSCR of 1.0 means the property's income exactly covers the loan; lenders on investment property typically want 1.20–1.25 or higher so there's a cushion. DSCR loans qualify the property on its own cash flow rather than your personal income.",
    },
    {
      q: "What counts as operating expenses?",
      a: "Everything it costs to run the property except the mortgage: property tax, insurance, maintenance and repairs, property management, HOA dues, and a realistic allowance for vacancy. A common mistake is counting only tax and insurance; a long-term rental often runs 40–50% of gross rent once vacancy and repairs are included.",
    },
    {
      q: "Does this include appreciation and tax benefits?",
      a: "No — this is a pre-tax cash-flow view. It doesn't count property appreciation, the equity you build as the loan is paid down, or the tax savings from depreciation. Those can add significantly to total return, but cash flow and the ratios here are what keep a property solvent month to month.",
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
      <RentalPropertyCalculator />
    </CalcShell>
  );
}
