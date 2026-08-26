import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { PercentageCalculator } from "@/components/calculators/percentage";

const SLUG = "percentage-calculator";

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
    "This percentage calculator handles the three questions that come up most: what is X% of a number, what is the percentage change between two numbers, and what percentage one number is of another. Switch between the three modes and the answer updates instantly.",
    "Percentages are just fractions of 100. “20% of 80” means 20/100 × 80 = 16. A percentage change compares a new value to an original one, so going from 200 to 250 is a +25% change. Knowing which of the three you need is usually the only hard part.",
    "Every percentage question reduces to one of three formulas: X% of a number is number × X ÷ 100; “A is what percent of B” is A ÷ B × 100; and a percentage change from an old value to a new one is (new − old) ÷ old × 100. Pick the matching mode below and the calculator does the arithmetic for any numbers, large or small.",
  ],
  extra: (
    <div>
      <h2 className="text-xl font-semibold">Worked examples</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        These are the percentage questions people search most, worked out step
        by step so you can see which formula each one uses:
      </p>
      <ul className="mt-4 list-disc pl-5 space-y-2 text-[var(--ink-soft)] leading-relaxed">
        <li>
          <strong>25% of 1,965,333</strong> = 1,965,333 × 25 ÷ 100 ={" "}
          <strong>491,333.25</strong>. To take a percentage of a number,
          multiply by the percent and divide by 100.
        </li>
        <li>
          <strong>73% of 20</strong> = 20 × 73 ÷ 100 = <strong>14.6</strong>.
        </li>
        <li>
          <strong>49 out of 205 is what percent?</strong> = 49 ÷ 205 × 100 ≈{" "}
          <strong>23.9%</strong>. Divide the part by the whole, then multiply by
          100.
        </li>
        <li>
          <strong>From 288,610 down to 178,000</strong> = (178,000 − 288,610) ÷
          288,610 × 100 ≈ <strong>−38.3%</strong> — a 38.3% decrease. Percentage
          change always divides by the original value.
        </li>
      </ul>
    </div>
  ),
  steps: [
    "Pick the mode: “% of a number”, “% change”, or “X is what %”.",
    "Type the two numbers into the fields.",
    "Read the result — it recalculates as you type, no button needed.",
  ],
  faq: [
    {
      q: "How do I find a percentage of a number, like 25% of 1,965,333?",
      a: "Multiply the number by the percentage and divide by 100. 25% of 1,965,333 is 1,965,333 × 25 ÷ 100 = 491,333.25. The “% of a number” mode does this for any values.",
    },
    {
      q: "How do I calculate what percent one number is of another?",
      a: "Divide the part by the whole and multiply by 100. For example, 49 out of 205 is 49 ÷ 205 × 100 ≈ 23.9%, and 30 out of 120 is exactly 25%. Use the “X is what %” mode to do it automatically.",
    },
    {
      q: "How is percentage change calculated?",
      a: "Subtract the original value from the new value, divide by the original, and multiply by 100. From 200 to 250 that is (250 − 200) ÷ 200 × 100 = +25%. A negative result means a decrease — for example, from 288,610 to 178,000 is about −38.3%.",
    },
    {
      q: "How do I work out a discount or percentage off?",
      a: "A discount is a percentage decrease. Multiply the price by the discount percent and divide by 100 to get the amount saved, then subtract it. 20% off 80 is 80 × 20 ÷ 100 = 16 saved, leaving 64. Our discount calculator does this directly.",
    },
    {
      q: "What is 15% of 200?",
      a: "15% of 200 is 30. In general, to find X% of a number you multiply the number by X and divide by 100.",
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
      <PercentageCalculator />
    </CalcShell>
  );
}
