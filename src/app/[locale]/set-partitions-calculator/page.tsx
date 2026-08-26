import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { SetPartitionsCalculator } from "@/components/calculators/set-partitions";

const SLUG = "set-partitions-calculator";

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
    "This calculator counts the ways to split a set of distinct objects into groups. Enter the number of objects (n) and the number of groups (k), and it returns the Stirling number of the second kind S(n, k) — the number of ways to partition the objects into k non-empty, unlabeled groups — plus the count for labeled groups and the Bell number for any number of groups.",
    "For example, the number of ways to sort 11 different books into 4 identical packets is S(11, 4) = 145,750. If the 4 packets are distinguishable (packet A, B, C, D), each way is counted k! times, giving 4! × 145,750 = 3,498,000. Allowing any number of packets from 1 to 11 gives the Bell number B(11) = 678,570.",
  ],
  steps: [
    "Enter n — the number of distinct objects to divide up.",
    "Enter k — how many groups you want to split them into.",
    "Read S(n, k) for identical (unlabeled) groups.",
    "Use the labeled result if the groups are distinguishable, or the Bell number for any number of groups.",
  ],
  faq: [
    {
      q: "What is a Stirling number of the second kind?",
      a: "S(n, k) is the number of ways to partition a set of n distinct objects into exactly k non-empty subsets, where the subsets themselves are not labeled or ordered. It satisfies the recurrence S(n, k) = k · S(n−1, k) + S(n−1, k−1), with S(n, n) = 1 and S(n, 0) = 0 for n ≥ 1.",
    },
    {
      q: "What's the difference between identical and labeled groups?",
      a: "If the groups are interchangeable (e.g. identical boxes), use S(n, k). If the groups are distinguishable (e.g. numbered boxes, or people receiving them), multiply by k!, because each partition can be assigned to the labeled groups in k! ways. That labeled count, k!·S(n, k), also equals the number of ways to map n objects onto k groups so that none is empty (surjections).",
    },
    {
      q: "What is the Bell number?",
      a: "The Bell number B(n) is the total number of ways to partition n objects into any number of non-empty groups, from 1 up to n. It is the sum of S(n, k) over all k, so B(n) = S(n, 1) + S(n, 2) + … + S(n, n).",
    },
    {
      q: "How is this different from combinations (nCr)?",
      a: "Combinations count how many ways to choose r items from n, ignoring order — a single subset. Set partitions count how many ways to split the whole set into several non-empty groups at once. For choosing items, use the permutations and combinations calculator instead.",
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
      <SetPartitionsCalculator />
    </CalcShell>
  );
}
