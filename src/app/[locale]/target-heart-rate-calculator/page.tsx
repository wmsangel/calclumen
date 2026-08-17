import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { TargetHeartRateCalculator } from "@/components/calculators/target-heart-rate";

const SLUG = "target-heart-rate-calculator";

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
    "Your target heart rate is the beats-per-minute range you should aim for during exercise to train effectively and safely. It starts from your maximum heart rate — the fastest your heart can beat — which is commonly estimated as 220 minus your age. Different fractions of that maximum correspond to different training zones, from gentle fat-burning effort up to a hard, near-maximal push.",
    "This calculator offers two methods. The basic method takes a percentage of your maximum heart rate directly. The Karvonen method uses your heart rate reserve — the gap between your maximum and resting heart rates — which personalises the zones to your fitness level and usually gives higher, more accurate targets for people who train regularly. Both are estimates; anyone with a heart condition or on medication that affects heart rate should check with a doctor.",
  ],
  steps: [
    "Enter your age so the calculator can estimate your maximum heart rate.",
    "Choose the basic method or the Karvonen method.",
    "If you pick Karvonen, enter your resting heart rate, ideally measured just after waking.",
    "Read your maximum heart rate and the beats-per-minute range for each training zone.",
  ],
  faq: [
    {
      q: "How is maximum heart rate calculated?",
      a: "This calculator uses the common formula of 220 minus your age. So a 30-year-old has an estimated maximum of 190 beats per minute. It is a population average, so your true maximum may be somewhat higher or lower.",
    },
    {
      q: "What is the Karvonen method?",
      a: "The Karvonen method bases zones on your heart rate reserve — your maximum heart rate minus your resting heart rate. A target is your resting rate plus a percentage of that reserve, which tailors the zones to your fitness and usually gives higher targets than the basic percentage method.",
    },
    {
      q: "What do the fat burn, cardio and peak zones mean?",
      a: "Fat burn (about 50–70% intensity) is light effort you can sustain for a long time. Cardio (70–85%) is moderate-to-hard work that builds aerobic fitness. Peak (85–100%) is very hard, near-maximal effort used in short bursts such as interval training.",
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
      <TargetHeartRateCalculator />
    </CalcShell>
  );
}
