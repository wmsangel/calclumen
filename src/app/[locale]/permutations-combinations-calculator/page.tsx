import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { PermutationsCombinationsCalculator } from "@/components/calculators/permutations-combinations";
import { CombinationsLinks } from "@/components/programmatic-hubs";

const SLUG = "permutations-combinations-calculator";

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
    "Permutations and combinations count how many ways you can pick r items from a set of n. The difference is order: permutations (nPr) treat different arrangements as distinct, while combinations (nCr) do not. Enter n and r and this calculator returns both, along with the factorials that define them.",
    "For example, picking 2 people from 5 gives 20 permutations (nPr) because first and second place are different, but only 10 combinations (nCr) because a pair is the same regardless of order. The formulas are nPr = n! / (n − r)! and nCr = nPr / r!, which is why the factorials are shown too.",
  ],
  steps: [
    "Enter n, the total number of items to choose from.",
    "Enter r, how many you are selecting. It must be a whole number from 0 up to n.",
    "Read nCr for order-independent selections and nPr for ordered arrangements.",
    "Check n! and r! if you want the underlying factorial values.",
  ],
  faq: [
    {
      q: "What is the difference between a permutation and a combination?",
      a: "A permutation counts arrangements where order matters, so AB and BA are two outcomes. A combination counts selections where order does not matter, so AB and BA are the same one outcome. That is why nPr is always greater than or equal to nCr.",
    },
    {
      q: "How is nCr calculated?",
      a: "nCr equals n! divided by r! times (n − r)!. Equivalently, this tool computes the permutation nPr first, then divides by r!. For n = 5 and r = 2 that gives 20 ÷ 2 = 10 combinations.",
    },
    {
      q: "Why does it say “too large”?",
      a: "Factorials grow extremely fast. Beyond 170! the result exceeds the largest number JavaScript can represent, so any output that overflows is shown as “too large” rather than an inaccurate figure.",
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
    <CalcShell
      locale={locale}
      slug={SLUG}
      content={{
        ...content,
        extra: <CombinationsLinks locale={locale} />,
      }}
    >
      <PermutationsCombinationsCalculator />
    </CalcShell>
  );
}
