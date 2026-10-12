import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { BacCalculator } from "@/components/calculators/bac";

const SLUG = "bac-calculator";

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
    "This calculator estimates your blood alcohol concentration (BAC) from your sex, body weight, how many standard drinks you've had and how long ago you started — using the Widmark formula, the method behind most online BAC estimates.",
    "It's useful for understanding roughly how alcohol affects you and how long it takes to clear, but it is only an estimate. Your real BAC depends on many things this can't see, so treat the number as a ballpark, never as permission to drive.",
  ],
  steps: [
    "Choose your sex and enter your body weight (the formula uses them to estimate how alcohol distributes through your body).",
    "Enter the number of standard drinks you've had — one standard drink is about 12 oz of beer, 5 oz of wine or 1.5 oz of spirits.",
    "Enter how many hours ago you had your first drink.",
    "Read your estimated BAC, whether it's over the 0.08% limit, and roughly how long until it clears.",
  ],
  faq: [
    {
      q: "How is BAC calculated?",
      a: "This uses the Widmark formula: BAC = (grams of alcohol ÷ (body weight in grams × r)) × 100, minus about 0.015% per hour for elimination. 'r' is the distribution ratio — roughly 0.68 for men and 0.55 for women — reflecting that alcohol spreads through body water, which differs by sex.",
    },
    {
      q: "What is one standard drink?",
      a: "In the US a standard drink contains about 14 grams of pure alcohol: roughly 12 oz of regular beer (5%), 5 oz of wine (12%), or 1.5 oz of 80-proof spirits (40%). Cocktails and craft beers often contain more than one standard drink, which is easy to underestimate.",
    },
    {
      q: "How long does it take for BAC to reach zero?",
      a: "Your body eliminates alcohol at roughly 0.015% BAC per hour, and that rate can't be sped up by coffee, water or a cold shower. So a BAC of 0.08% takes about 5–6 hours to clear. The calculator shows an estimate for both reaching the legal limit and reaching zero.",
    },
    {
      q: "Is a BAC under 0.08% safe to drive?",
      a: "No. 0.08% is the US legal limit for driving, not a safety threshold — meaningful impairment of reaction time and judgment begins well below it, and many countries set the limit at 0.05% or lower. The safest BAC for driving is 0.00%.",
    },
    {
      q: "How accurate is this estimate?",
      a: "It's a rough approximation. Food in your stomach, medications, drinking speed, hydration, body composition and individual metabolism all change your actual BAC, and the elimination rate varies from person to person. Only a breathalyzer or blood test gives a real reading — never rely on this to decide whether to drive.",
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
      <BacCalculator />
    </CalcShell>
  );
}
