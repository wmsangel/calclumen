import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { CurrencyConverter } from "@/components/calculators/currency-converter";

const SLUG = "currency-converter";

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
    "This currency converter turns an amount in one currency into an estimated amount in another using a simple exchange-rate table. Enter the amount, pick the currency you are converting from and the one you are converting to, and the result updates instantly. Use the swap button to reverse the direction.",
    "The rates built into this tool are indicative and static — they are not live, real-time market rates and are refreshed only occasionally. They are handy for quick estimates and rough budgeting, but for an exact figure (for example when sending money or booking a trip) always check a live source or your bank, which will also apply its own fees and spread.",
  ],
  steps: [
    "Enter the amount you want to convert.",
    "Choose the currency to convert from.",
    "Choose the currency to convert to — or press ⇄ to swap the two.",
    "Read the converted amount and the effective exchange rate below it.",
  ],
  faq: [
    {
      q: "Are the exchange rates live or real-time?",
      a: "No. The rates are indicative and static — baked into the page and updated only occasionally. They are meant for quick estimates, not for actual transactions. For a precise, up-to-the-minute figure, use a live source or your bank.",
    },
    {
      q: "How is the conversion calculated?",
      a: "Every rate is stored as units per US dollar, so each conversion goes through USD: the amount is divided by the source currency's rate to get a USD value, then multiplied by the target currency's rate. This keeps every currency pair consistent from a single table.",
    },
    {
      q: "Which currencies are supported?",
      a: "The converter covers USD, EUR, GBP, CAD, AUD, JPY, CNY, INR, CHF, MXN, BRL and ZAR — twelve major world currencies you can convert between in any direction.",
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
      <CurrencyConverter />
    </CalcShell>
  );
}
