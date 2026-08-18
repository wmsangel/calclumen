import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { GravelCalculator } from "@/components/calculators/gravel-calculator";

const SLUG = "gravel-calculator";

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
    "This gravel calculator estimates how much loose material you need to fill an area to a given depth, and how much it weighs. Enter the length, width and depth, choose the material, and it returns the volume in cubic yards and cubic feet along with an approximate weight in tons.",
    "The estimate multiplies the area by the depth to get a volume, converts it to cubic yards, and then applies a typical density for the chosen material to estimate the weight. Suppliers usually sell by the cubic yard or by the ton, so both figures help you order the right amount.",
  ],
  steps: [
    "Enter the length and width of the area in feet.",
    "Enter the depth of material you want in inches.",
    "Choose the material so the weight uses the right density.",
    "Optionally add a price per cubic yard to see the estimated cost.",
  ],
  faq: [
    {
      q: "How deep should a gravel layer be?",
      a: "For pathways and decorative beds, 2 to 3 inches is common, while driveways often need 4 inches or more over a compacted base. Deeper layers use more material, so measure the depth you actually want before ordering.",
    },
    {
      q: "How do I convert cubic yards to tons?",
      a: "Multiply the cubic yards by the material's density in tons per cubic yard. Gravel is around 1.5, sand about 1.35, topsoil roughly 1.1 and mulch closer to 0.5, though exact figures vary with moisture and composition.",
    },
    {
      q: "Should I order a little extra?",
      a: "Yes, a small buffer of around 5% to 10% is sensible. Ground is rarely perfectly level, material compacts as it settles, and some is lost during spreading, so ordering slightly more helps you finish without running short.",
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
      <GravelCalculator />
    </CalcShell>
  );
}
