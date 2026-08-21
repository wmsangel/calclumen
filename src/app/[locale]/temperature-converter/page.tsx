import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { TemperatureConverter } from "@/components/calculators/temperature-converter";
import { ConversionLinks } from "@/components/conversion-links";

const SLUG = "temperature-converter";

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
    "This temperature converter switches any value between Celsius, Fahrenheit and Kelvin. Enter a number, pick the scale it is in and the scale you want, and the answer appears instantly — along with a table showing the same temperature on all three scales.",
    "Celsius and Fahrenheit are the two everyday scales, while Kelvin is the absolute scale used in science, where 0 K is absolute zero. Converting always routes through Celsius: to Fahrenheit multiply by 9/5 and add 32, and to Kelvin simply add 273.15. Water freezes at 0 °C, 32 °F or 273.15 K.",
  ],
  steps: [
    "Type the temperature you want to convert into the Value field.",
    "Choose the scale it is currently in under “From” and the target scale under “To”.",
    "Read the converted value, plus the reference table showing all three scales at once.",
  ],
  faq: [
    {
      q: "How do I convert Celsius to Fahrenheit?",
      a: "Multiply the Celsius value by 9/5 (or 1.8) and add 32. For example 100 °C × 1.8 + 32 = 212 °F, the boiling point of water.",
    },
    {
      q: "How do I convert Celsius to Kelvin?",
      a: "Add 273.15 to the Celsius value. So 25 °C is 298.15 K. To go back, subtract 273.15 from the Kelvin value.",
    },
    {
      q: "What is absolute zero in each scale?",
      a: "Absolute zero is the lowest possible temperature: 0 K, which equals −273.15 °C and −459.67 °F. Nothing can be colder than this.",
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
      <TemperatureConverter />
    </CalcShell>
  );
}
