import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { PrimeFactorizationCalculator } from "@/components/calculators/prime-factorization";

const SLUG = "prime-factorization-calculator";

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
    "This prime factorization calculator breaks a whole number down into the prime numbers that multiply together to make it. Enter a number and it shows the factorization in exponent form, every prime factor, all of the number's divisors, and whether the number itself is prime.",
    "Prime factorization is the unique way to write a number as a product of primes. For example, 360 = 2³ × 3² × 5. Every integer greater than 1 has exactly one such factorization (the fundamental theorem of arithmetic), which is why it underpins finding greatest common divisors, least common multiples, and simplifying fractions.",
  ],
  steps: [
    "Enter a whole number (1 or greater).",
    "Read the prime factorization written with exponents.",
    "See the list of distinct prime factors and every divisor.",
    "Check the “Prime number?” result to know if it has no factors other than 1 and itself.",
  ],
  faq: [
    {
      q: "What is prime factorization?",
      a: "It is writing a number as a product of prime numbers. For 84, that is 2 × 2 × 3 × 7, or 2² × 3 × 7 in exponent form. Every whole number greater than 1 has exactly one prime factorization.",
    },
    {
      q: "How do I find the prime factorization of a number?",
      a: "Divide by the smallest prime that fits (2, then 3, 5, 7, …), keep dividing the result until it no longer divides evenly, then move to the next prime. Continue until you reach 1. This calculator does that automatically and groups repeated primes into exponents.",
    },
    {
      q: "How many divisors does a number have?",
      a: "Add one to each exponent in the prime factorization and multiply those together. For 360 = 2³ × 3² × 5¹, that is (3+1)(2+1)(1+1) = 24 divisors. The calculator lists them all.",
    },
    {
      q: "What makes a number prime?",
      a: "A prime number is a whole number greater than 1 whose only divisors are 1 and itself, so its prime factorization is just the number on its own. 1 is not prime, and numbers with more than two divisors are called composite.",
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
      <PrimeFactorizationCalculator />
    </CalcShell>
  );
}
