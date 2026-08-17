import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { SpeedConverter } from "@/components/calculators/speed-converter";

const SLUG = "speed-converter";

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
    "This speed converter turns a speed from one unit into another across the five units people use most: miles per hour, kilometres per hour, metres per second, knots and feet per second. Type a value, choose the unit you are converting from and the unit you want, and the result updates instantly alongside a table showing the same speed in every unit.",
    "Every unit is converted through a common base — metres per second — so each result is exact to the defined factor. That means you can move freely between road speeds in mph or km/h, scientific figures in m/s, marine and aviation speeds in knots, and engineering values in feet per second without looking anything up.",
  ],
  steps: [
    "Enter the speed value you want to convert.",
    "Pick the unit to convert from.",
    "Pick the unit to convert to.",
    "Read the converted value, plus the full table of all five units below.",
  ],
  faq: [
    {
      q: "How many km/h are in one mph?",
      a: "One mile per hour is about 1.60934 kilometres per hour. To convert mph to km/h you multiply by roughly 1.60934, and to go the other way you divide by the same figure.",
    },
    {
      q: "What is a knot?",
      a: "A knot is one nautical mile per hour, used in marine and aviation contexts. One knot is about 1.852 km/h or roughly 1.15078 mph, because a nautical mile is longer than a statute mile.",
    },
    {
      q: "How do I convert m/s to km/h?",
      a: "Multiply metres per second by 3.6 to get kilometres per hour. For example, 10 m/s equals 10 × 3.6 = 36 km/h.",
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
      <SpeedConverter />
    </CalcShell>
  );
}
