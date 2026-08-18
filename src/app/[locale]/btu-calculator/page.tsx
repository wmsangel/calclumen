import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { BtuCalculator } from "@/components/calculators/btu-calculator";

const SLUG = "btu-calculator";

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
    "BTU (British Thermal Units) measure the cooling or heating capacity of an air conditioner. This calculator uses the common rule of thumb of roughly 20 BTU per square foot of room, then adjusts for sun exposure, how many people use the room, and whether it is a kitchen, to suggest the size of unit you need.",
    "A 12 by 12 foot room is 144 square feet, which at 20 BTU per square foot works out to about 2,880 BTU before adjustments. Sunny rooms need a little more and shaded rooms a little less; each person beyond two adds 600 BTU, and a kitchen adds 4,000 BTU for the heat from appliances. AC size is also shown in tons, where 12,000 BTU equals one ton.",
  ],
  steps: [
    "Enter the room length and width in feet to set the floor area.",
    "Pick the sun exposure: shaded reduces the estimate, sunny increases it.",
    "Enter how many people regularly use the room.",
    "Tick the kitchen box if it applies, then read the BTU and ton estimate.",
  ],
  faq: [
    {
      q: "How many BTU do I need per square foot?",
      a: "A widely used rule of thumb is about 20 BTU per square foot for cooling. This calculator starts there and then adjusts for sunlight, occupants, and kitchen heat to refine the number.",
    },
    {
      q: "How many BTU is one ton of cooling?",
      a: "One ton of air-conditioning capacity equals 12,000 BTU per hour. So a 24,000 BTU unit is a 2-ton system. The calculator shows the ton figure alongside the BTU total.",
    },
    {
      q: "Is this an exact sizing?",
      a: "No. It is a quick estimate based on square footage. Ceiling height, insulation, climate, window quality, and local conditions all matter, so confirm the final size with an HVAC professional before buying.",
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
      <BtuCalculator />
    </CalcShell>
  );
}
