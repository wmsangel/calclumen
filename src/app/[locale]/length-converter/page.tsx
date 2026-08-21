import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { LengthConverter } from "@/components/calculators/length-converter";
import { ConversionLinks } from "@/components/conversion-links";

const SLUG = "length-converter";

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
    "This length converter turns a distance from one unit into another across the metric and imperial systems. Type a value, choose the unit you are converting from and the unit you want, and the answer updates instantly — no lookup tables or mental arithmetic required.",
    "Every conversion runs through a common base unit, the metre, so the maths is exact to the defined factor. One inch is precisely 0.0254 metres and one mile is precisely 1609.344 metres, which means results match the international standards used in engineering, sport and everyday measurement.",
  ],
  steps: [
    "Enter the length you want to convert.",
    "Pick the unit to convert from.",
    "Pick the unit to convert to.",
    "Read the converted value, plus the full table of every supported unit.",
  ],
  faq: [
    {
      q: "How many feet are in a metre?",
      a: "One metre is about 3.2808 feet, because a foot is defined as exactly 0.3048 metres. To convert metres to feet you divide by 0.3048; to go the other way you multiply by it.",
    },
    {
      q: "Is a mile exactly 1.609 kilometres?",
      a: "A mile is exactly 1.609344 kilometres by international definition. The 1.609 figure is just that value rounded to three decimal places, which is fine for most everyday conversions.",
    },
    {
      q: "What is the difference between a yard and a metre?",
      a: "A yard is defined as exactly 0.9144 metres, so a metre is a little longer — about 1.094 yards. They are close but not interchangeable for precise work.",
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
      <LengthConverter />
    </CalcShell>
  );
}
