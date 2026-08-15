import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { CdCalculator } from "@/components/calculators/cd";

const SLUG = "cd-calculator";

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
    "This CD calculator shows what a certificate of deposit will be worth at maturity. Enter the amount you are depositing, the annual interest rate, the term in years and how often the interest compounds, and it returns the maturity value, the total interest earned and the effective annual yield (APY).",
    "A certificate of deposit locks your money away for a fixed term in exchange for a guaranteed rate. The more frequently the interest compounds — daily rather than annually, for example — the more you earn, because each period's interest starts earning interest of its own. The APY captures that compounding effect in a single comparable number.",
  ],
  steps: [
    "Enter the principal you are depositing and choose your currency.",
    "Type the annual interest rate offered on the CD.",
    "Set the term in years and how often the interest compounds.",
    "Read the maturity value, total interest earned and the APY.",
  ],
  faq: [
    {
      q: "How is the CD maturity value calculated?",
      a: "It uses the compound interest formula A = P·(1 + r ÷ n)^(n·t), where P is the principal, r is the annual rate, n is the number of compounding periods per year and t is the term in years.",
    },
    {
      q: "What is APY and how does it differ from the rate?",
      a: "APY (annual percentage yield) is the real rate of return once compounding is included, calculated as (1 + r ÷ n)^n − 1. It is always equal to or higher than the stated annual rate, and it lets you compare CDs that compound at different frequencies.",
    },
    {
      q: "What happens if I withdraw before maturity?",
      a: "Most CDs charge an early-withdrawal penalty, often several months of interest, which this calculator does not include. It assumes you hold the CD for the full term shown.",
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
      <CdCalculator />
    </CalcShell>
  );
}
