import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { RomanNumeralConverter } from "@/components/calculators/roman-numeral";

const SLUG = "roman-numeral-converter";

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
    "This Roman numeral converter works in both directions. Type an ordinary number and it returns the Roman numeral; type a Roman numeral and it returns the ordinary number. It detects which you entered automatically, so there is no mode to switch, and it shows a short breakdown of how the value adds up.",
    "Roman numerals combine seven letters — I, V, X, L, C, D, and M — using addition and subtraction. Letters are normally written from largest to smallest and added together, but a smaller letter placed before a larger one is subtracted, which is why IV is four and IX is nine. Standard Roman numerals cover the whole numbers from 1 to 3999.",
  ],
  steps: [
    "Type a whole number between 1 and 3999, or a Roman numeral using the letters I, V, X, L, C, D, and M.",
    "The converter detects the input type and converts it automatically.",
    "Read the result and the breakdown line showing how the value is built up.",
    "Clear the field and enter a new value to convert again.",
  ],
  faq: [
    {
      q: "What is the largest number Roman numerals can represent?",
      a: "Using the standard letters, the largest value is 3999, written MMMCMXCIX. Numbers above that historically used bars over letters to multiply by a thousand, which this converter does not use.",
    },
    {
      q: "How does subtractive notation work?",
      a: "When a smaller numeral appears before a larger one, it is subtracted rather than added. So IV is 5 − 1 = 4 and XC is 100 − 10 = 90. When the smaller numeral comes after, the values are added, as in VI = 6.",
    },
    {
      q: "Why won't my input convert?",
      a: "The value must be either digits only (1 to 3999) or Roman letters only. Mixing letters and digits, using unsupported characters, or entering a number outside 1–3999 will show a dash instead of a result.",
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
      <RomanNumeralConverter />
    </CalcShell>
  );
}
