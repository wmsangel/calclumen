import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { InsulationCalculator } from "@/components/calculators/insulation";

const SLUG = "insulation-calculator";

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
    "Insulation is sold by the package, but the number you actually need depends on the area, how much R-value you're adding and the product you choose. This calculator turns those into a shopping list — how many rolls, batts or bags to buy, the thickness of the new layer, and the material cost.",
    "It handles the detail people get wrong: R-value adds up, so topping up existing insulation only needs the difference, not the full target. Enter your area, the R-value you're aiming for and what's already there, and you get the added R, the depth to install, the packages to buy with a waste allowance, and the total cost.",
  ],
  steps: [
    "Enter the area you're insulating in square feet (for an attic, that's the floor area).",
    "Set your target R-value and the R-value already in place (0 if it's bare).",
    "Enter the R-value per inch of your chosen material and the coverage printed on each package.",
    "Add the price per package and a waste allowance, then read the packages, thickness and cost.",
  ],
  faq: [
    {
      q: "What R-value do I need?",
      a: "The US Department of Energy recommends roughly R-30 to R-60 for attics depending on your climate zone — R-49 to R-60 across most of the US, less in the warm south. Walls are typically R-13 to R-21 and floors R-25 to R-30. Check your zone's recommendation and set that as the target.",
    },
    {
      q: "Do I add R-value or replace it?",
      a: "You add it. R-values of layers stack, so if you already have R-15 and want R-49, you only need to add R-34 of new insulation on top. This calculator does that subtraction for you and sizes the new layer accordingly — you don't tear out good existing insulation.",
    },
    {
      q: "How thick does the insulation need to be?",
      a: "Divide the R-value you're adding by the material's R-value per inch. Fiberglass batt is about R-3.1 per inch, blown fiberglass about R-2.5, cellulose about R-3.5, rigid foam board around R-5, and closed-cell spray foam about R-6.5. So R-34 of cellulose is roughly 10 inches deep.",
    },
    {
      q: "Why does coverage per bag change for blown-in insulation?",
      a: "A bag of loose-fill contains a fixed amount of material, so the deeper you blow it, the less floor area one bag covers. The bag's label has a coverage chart listing square feet per bag at each R-value — use the figure for your target R, not a single fixed number, or you'll come up short.",
    },
    {
      q: "Does this include labor?",
      a: "No — it estimates material (packages and cost) only. It doesn't include labor, a vapor barrier, baffles, or the air sealing that should come before insulating. Sealing gaps and leaks first is what lets the insulation reach its rated performance.",
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
      <InsulationCalculator />
    </CalcShell>
  );
}
