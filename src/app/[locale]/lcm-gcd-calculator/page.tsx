import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { LcmGcdCalculator } from "@/components/calculators/lcm-gcd";

const SLUG = "lcm-gcd-calculator";

const POPULAR_PAIRS = [
  "12-and-18", "24-and-36", "4-and-6", "8-and-12", "15-and-20",
  "6-and-9", "16-and-24", "18-and-24", "20-and-30", "36-and-48",
  "9-and-12", "25-and-50",
];

const POPULAR_MULTIPLES = [3, 4, 6, 7, 8, 9, 12, 15, 20, 25];

function PopularPairs({ locale }: { locale: string }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold">GCF &amp; LCM of popular pairs</h2>
        <p className="text-[var(--ink-soft)] leading-relaxed mt-2">
          Jump straight to the worked answer, prime factorizations and method for
          commonly asked pairs:
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {POPULAR_PAIRS.map((slug) => (
            <Link
              key={slug}
              href={`/${locale}/gcf-lcm/${slug}`}
              className="rounded-lg border border-[var(--rule)] px-3 py-1.5 text-sm text-[var(--accent)] hover:border-[var(--accent)]"
            >
              {slug.replace("-and-", " and ")}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Multiples of popular numbers</h2>
        <p className="text-[var(--ink-soft)] leading-relaxed mt-2">
          See the list and table of multiples for commonly searched numbers:
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {POPULAR_MULTIPLES.map((n) => (
            <Link
              key={n}
              href={`/${locale}/multiples/${n}`}
              className="rounded-lg border border-[var(--rule)] px-3 py-1.5 text-sm text-[var(--accent)] hover:border-[var(--accent)]"
            >
              Multiples of {n}
            </Link>
          ))}
        </div>
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
    "This calculator finds the greatest common divisor (GCD) and least common multiple (LCM) of a whole list of positive integers at once. The GCD is the largest number that divides every value evenly, while the LCM is the smallest number that all of them divide into evenly.",
    "It uses the Euclidean algorithm to compute the GCD of each pair, then reduces across the whole list; the LCM is derived from the identity LCM(a, b) = a ÷ GCD(a, b) × b applied the same way. Enter at least two positive whole numbers and the results update as you type — non-integer or negative entries are simply ignored.",
  ],
  steps: [
    "Type two or more positive whole numbers into the box.",
    "Separate them with commas, spaces, or new lines.",
    "Read the GCD and LCM, along with how many numbers were used.",
    "Edit the list at any time to recalculate instantly.",
  ],
  faq: [
    {
      q: "What is the difference between GCD and LCM?",
      a: "The GCD (greatest common divisor) is the largest number that divides all your values without a remainder. The LCM (least common multiple) is the smallest number that every value divides into evenly.",
    },
    {
      q: "How is the GCD calculated?",
      a: "The calculator uses the Euclidean algorithm, which repeatedly replaces the larger number with the remainder of dividing it by the smaller one until the remainder is zero. It then applies this across the whole list.",
    },
    {
      q: "Can I enter more than two numbers?",
      a: "Yes. Enter as many positive whole numbers as you like — the GCD and LCM are computed across the entire list. You need at least two valid integers for a result.",
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
    extra: <PopularPairs locale={locale} />,
  };
  return (
    <CalcShell locale={locale} slug={SLUG} content={pageContent}>
      <LcmGcdCalculator />
    </CalcShell>
  );
}
