import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { NumberToWordsCalculator } from "@/components/calculators/number-to-words";

const SLUG = "number-to-words-calculator";

const POPULAR_NUMBERS = [
  100, 200, 500, 1000, 1234, 1500, 2000, 2024, 5000, 10000, 100000, 1000000,
];

function PopularNumbers({ locale }: { locale: string }) {
  return (
    <div>
      <h2 className="text-xl font-semibold">Popular numbers in words</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-2">
        See how to write and spell commonly searched numbers:
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {POPULAR_NUMBERS.map((n) => (
          <Link
            key={n}
            href={`/${locale}/number-in-words/${n}`}
            className="rounded-lg border border-[var(--rule)] px-3 py-1.5 text-sm text-[var(--accent)] hover:border-[var(--accent)]"
          >
            {n.toLocaleString("en-US")} in words
          </Link>
        ))}
      </div>
    </div>
  );
}

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
    "This number to words converter spells any number out in English. Type a figure — for example 1,234.56 — and it returns the words (one thousand two hundred thirty-four point five six), a capitalized version, and a cheque-style amount you can copy onto a check or invoice.",
    "Writing numbers in words is useful for cheques, contracts, invoices and homework, where the amount has to appear both as digits and as text. The converter handles whole numbers, decimals and negatives, and works for very large numbers up to the decillions.",
  ],
  steps: [
    "Type a number, with or without commas (e.g. 1,234.56).",
    "Read the “In words” result — the full spelled-out form.",
    "Use the capitalized version for the start of a sentence.",
    "Use the cheque style (USD) line for a check or invoice amount.",
  ],
  faq: [
    {
      q: "How do you write 1234 in words?",
      a: "1234 is written “one thousand two hundred thirty-four”. Group the digits in threes from the right — 1 | 234 — and read each group with its scale word (thousand), which the converter does automatically.",
    },
    {
      q: "How are decimals read as words?",
      a: "The whole part is read normally and the decimal part is read digit by digit after the word “point”. So 12.5 becomes “twelve point five” and 1,234.56 becomes “one thousand two hundred thirty-four point five six”.",
    },
    {
      q: "What is the cheque (check) format?",
      a: "On a check the amount is written as words for the dollars followed by the cents over 100 — for example “One thousand two hundred thirty-four and 56/100”. The converter builds this line for you from any amount.",
    },
    {
      q: "How big a number can it convert?",
      a: "Up to 36 digits before the decimal point — into the decillions. Larger inputs are not supported because the standard English scale names run out.",
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
  const pageContent: CalcContent = {
    ...content,
    extra: <PopularNumbers locale={locale} />,
  };
  return (
    <CalcShell locale={locale} slug={SLUG} content={pageContent}>
      <NumberToWordsCalculator />
    </CalcShell>
  );
}
