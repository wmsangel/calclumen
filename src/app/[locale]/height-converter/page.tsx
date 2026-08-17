import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { HeightConverter } from "@/components/calculators/height-converter";

const SLUG = "height-converter";

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
    "This height converter switches a measurement between centimeters and feet and inches in either direction. Pick a mode, type your height, and the result appears instantly alongside the equivalent in meters and total inches — handy for filling in forms, comparing measurements or reading a passport that uses the other system.",
    "Everything is based on the exact definition that one inch equals 2.54 centimeters. Converting centimeters to feet and inches divides by 2.54 to get total inches, then splits that into whole feet plus the leftover inches; converting the other way multiplies the combined inches by 2.54 to return centimeters and meters.",
  ],
  steps: [
    "Choose a mode — cm → ft/in or ft/in → cm.",
    "Enter your height in centimeters, or in feet and inches.",
    "Read the converted value shown as feet and inches, or as centimeters.",
    "Check the meters and total inches figures for the same height in other units.",
  ],
  faq: [
    {
      q: "How tall is 175 cm in feet and inches?",
      a: "175 centimeters is about 5 feet 8.9 inches. Dividing 175 by 2.54 gives roughly 68.9 total inches, which is 5 whole feet (60 inches) plus about 8.9 inches.",
    },
    {
      q: "How do I convert feet and inches to centimeters?",
      a: "Multiply your total height in inches by 2.54. For 5 feet 9 inches, that is (5 × 12 + 9) = 69 inches, and 69 × 2.54 = 175.3 centimeters.",
    },
    {
      q: "How many centimeters are in one inch?",
      a: "Exactly 2.54 centimeters. This is a defined value, so every conversion between inches and centimeters is exact rather than an approximation.",
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
      <HeightConverter />
    </CalcShell>
  );
}
