import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { AreaConverter } from "@/components/calculators/area-converter";
import { ConversionLinks } from "@/components/conversion-links";

const SLUG = "area-converter";

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
    "This area converter turns a measurement from one unit into another, spanning metric units like square metres, square kilometres, hectares and square centimetres and imperial units like square feet, square yards, square miles and acres. Enter a value, choose your units, and the result updates instantly.",
    "Each conversion goes through a common base unit, the square metre, so the answer is exact to the defined factor. One acre is 4046.8564224 square metres and one hectare is 10,000 square metres, which keeps land, property and flooring calculations accurate and repeatable.",
  ],
  steps: [
    "Enter the area you want to convert.",
    "Pick the unit to convert from.",
    "Pick the unit to convert to.",
    "Read the converted value, plus the full table of every supported unit.",
  ],
  faq: [
    {
      q: "How many square feet are in a square metre?",
      a: "One square metre is about 10.7639 square feet, because a square foot is defined as exactly 0.09290304 square metres. Divide by that factor to convert square metres to square feet.",
    },
    {
      q: "How big is an acre compared with a hectare?",
      a: "A hectare is 10,000 square metres and an acre is about 4046.86 square metres, so one hectare is roughly 2.471 acres. Hectares are metric while acres are imperial.",
    },
    {
      q: "How many square metres are in an acre?",
      a: "One acre is exactly 4046.8564224 square metres. That is the international definition used here, so acre conversions line up with survey and property figures.",
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
        extra: <ConversionLinks locale={locale} converterSlug={SLUG} />,
      }}
    >
      <AreaConverter />
    </CalcShell>
  );
}
