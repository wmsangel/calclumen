import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { ConcreteCalculator } from "@/components/calculators/concrete";

const SLUG = "concrete-calculator";

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
    "This concrete calculator estimates how much concrete a slab, footing, or pad needs. Enter the length and width in feet, the thickness in inches, and how many identical pours you plan, and it returns the volume in cubic yards and cubic feet along with the number of pre-mixed bags required.",
    "Concrete is measured by volume, so the calculator multiplies length by width by thickness, converting the thickness from inches to feet first, then divides by 27 to get cubic yards. For smaller jobs it also counts bags, where a 60 lb bag yields about 0.45 ft³ and an 80 lb bag yields about 0.6 ft³ of mixed concrete.",
  ],
  steps: [
    "Enter the length and width of the pour in feet.",
    "Set the thickness in inches and the number of identical pours.",
    "Read off the cubic yards, cubic feet, and bags needed.",
    "Optionally add a price per cubic yard to estimate the cost.",
  ],
  faq: [
    {
      q: "How many bags of concrete are in a cubic yard?",
      a: "A cubic yard is 27 cubic feet. Since a 60 lb bag makes about 0.45 ft³ and an 80 lb bag about 0.6 ft³, you need roughly 60 of the 60 lb bags or 45 of the 80 lb bags to fill one cubic yard.",
    },
    {
      q: "Should I order extra concrete?",
      a: "Yes, most contractors add about 5% to 10% to allow for spillage, uneven subgrade, and waste. Running short mid-pour can leave a cold joint, so it is safer to have a little extra than too little.",
    },
    {
      q: "When should I order ready-mix instead of bags?",
      a: "Bags are convenient for small jobs like posts or a small pad, but they become slow and expensive above roughly a cubic yard. For larger slabs, ordering ready-mix delivered by truck is usually cheaper and far quicker.",
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
      <ConcreteCalculator />
    </CalcShell>
  );
}
