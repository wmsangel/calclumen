import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { ScientificNotationCalculator } from "@/components/calculators/scientific-notation";

const SLUG = "scientific-notation-calculator";

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
    "Scientific notation writes a number as a mantissa between 1 and 10 multiplied by a power of ten, which keeps very large and very small numbers readable. This converter goes both ways: type an ordinary decimal to see its scientific form, or enter a mantissa and exponent to expand it back into a plain number.",
    "For example, 12,345 becomes 1.2345 × 10⁴ because the decimal point moves four places to the left. Going the other way, 1.2345 × 10⁴ multiplies the mantissa by 10,000 to give 12,345 again. The tool also shows E-notation (1.2345e4), the compact form used by calculators and programming languages.",
  ],
  steps: [
    "Choose “To scientific” to convert a normal number, or “From scientific” to expand one.",
    "In “To scientific”, type any decimal number and read the mantissa and exponent.",
    "In “From scientific”, enter the mantissa and the exponent (the power of ten).",
    "Copy whichever form you need — scientific, E-notation, or the expanded value.",
  ],
  faq: [
    {
      q: "What is scientific notation?",
      a: "Scientific notation expresses a number as a value between 1 and 10 times a power of ten. For instance, 4,500 is written 4.5 × 10³ and 0.0021 is 2.1 × 10⁻³. It makes very large or very small numbers easier to write and compare.",
    },
    {
      q: "What is E-notation?",
      a: "E-notation is a text-friendly version of scientific notation where “× 10” is replaced by the letter e. So 1.2345 × 10⁴ is written 1.2345e4. Calculators and programming languages use it because it avoids superscripts.",
    },
    {
      q: "How do I find the exponent?",
      a: "The exponent is how many places the decimal point moves to leave a single non-zero digit in front of it. Moving left gives a positive exponent, moving right gives a negative one. Here it is computed as the floor of the base-10 logarithm of the number.",
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
      <ScientificNotationCalculator />
    </CalcShell>
  );
}
