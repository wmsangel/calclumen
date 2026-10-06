import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getCalc } from "@/lib/calculators/registry";
import { EMBEDDABLE } from "@/lib/embeddable";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

// Interactive tools shown inside the embed. Curated set only (see embeddable.ts).
import { LoanCalculator } from "@/components/calculators/loan";
import { MortgageCalculator } from "@/components/calculators/mortgage";
import { CompoundInterestCalculator } from "@/components/calculators/compound-interest";
import { PercentageCalculator } from "@/components/calculators/percentage";
import { TipCalculator } from "@/components/calculators/tip";
import { BmiCalculator } from "@/components/calculators/bmi";
import { AutoLoanCalculator } from "@/components/calculators/auto-loan";
import { SalaryToHourly } from "@/components/calculators/salary-to-hourly";

const COMPONENTS: Record<string, ReactNode> = {
  "loan-calculator": <LoanCalculator />,
  "mortgage-calculator": <MortgageCalculator />,
  "compound-interest-calculator": <CompoundInterestCalculator />,
  "percentage-calculator": <PercentageCalculator />,
  "tip-calculator": <TipCalculator />,
  "bmi-calculator": <BmiCalculator />,
  "auto-loan-calculator": <AutoLoanCalculator />,
  "salary-to-hourly-calculator": <SalaryToHourly />,
};

// Only the curated embed pages exist; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return EMBEDDABLE.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalc(slug);
  if (!calc) return {};
  return {
    title: `${calc.heading} — embeddable widget`,
    description: calc.description,
    // The embed is a utility surface for other sites, not a page we want in the
    // index (the canonical calculator already is). Keep it out entirely.
    robots: { index: false, follow: false },
  };
}

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calc = getCalc(slug);
  const node = COMPONENTS[slug];
  if (!calc || !node) notFound();

  const canonical = `${SITE_URL}/en/${slug}`;

  return (
    <div className="mx-auto max-w-[680px] px-4 py-4">
      <a
        href={canonical}
        target="_blank"
        rel="noopener"
        className="flex items-baseline justify-between gap-3 no-underline"
      >
        <span className="display text-xl text-[var(--ink)]">{calc.heading}</span>
        <span className="text-xs font-semibold text-[var(--accent)] whitespace-nowrap">
          {SITE_NAME} ↗
        </span>
      </a>

      <div className="mt-3">{node}</div>

      <div className="mt-3 border-t border-[var(--rule)] pt-2 text-center">
        <a
          href={canonical}
          target="_blank"
          rel="noopener"
          className="text-xs text-[var(--ink-soft)] hover:text-[var(--accent)]"
        >
          Powered by {SITE_NAME} — free online calculators →
        </a>
      </div>
    </div>
  );
}
