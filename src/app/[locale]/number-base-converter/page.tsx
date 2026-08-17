import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { NumberBaseConverter } from "@/components/calculators/number-base-converter";

const SLUG = "number-base-converter";

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
    "This number base converter changes a whole number between binary (base 2), octal (base 8), decimal (base 10) and hexadecimal (base 16). Type a value, pick the base it is written in and the base you want, and the converted result appears instantly together with a table showing the number in all four bases.",
    "The conversion works by reading your input in its source base to get its plain decimal value, then re-expressing that value in the target base. Only digits that are valid for the source base are accepted — 0 and 1 for binary, 0 to 7 for octal, 0 to 9 for decimal and 0 to 9 plus A to F for hexadecimal — so an invalid entry shows a dash instead of a result.",
  ],
  steps: [
    "Enter the number you want to convert.",
    "Choose the base your number is currently written in.",
    "Choose the base you want to convert to.",
    "Read the converted value, and use the table to compare the number across binary, octal, decimal and hexadecimal.",
  ],
  faq: [
    {
      q: "What is 1010 in binary as a decimal number?",
      a: "Binary 1010 equals decimal 10. Reading right to left, the set bits are worth 2 and 8, and 2 + 8 = 10.",
    },
    {
      q: "Why is my entry showing a dash?",
      a: "The value contains a digit that is not valid for the selected from-base. For example, the digit 2 is not allowed in binary and the letter G is not allowed in hexadecimal. Remove the invalid character to see a result.",
    },
    {
      q: "What are the valid digits for each base?",
      a: "Binary uses 0 and 1, octal uses 0 through 7, decimal uses 0 through 9, and hexadecimal uses 0 through 9 plus the letters A to F.",
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
      <NumberBaseConverter />
    </CalcShell>
  );
}
