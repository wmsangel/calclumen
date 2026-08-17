import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { SleepCalculator } from "@/components/calculators/sleep";

const SLUG = "sleep-calculator";

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
    "Sleep happens in cycles of roughly 90 minutes, each moving from light sleep into deep sleep and then into REM before starting over. Waking in the middle of a cycle — during deep sleep — is what leaves you groggy, while waking at the end of one, as your body naturally surfaces toward light sleep, feels far easier. This calculator counts backward or forward in 90-minute blocks so you can aim your bedtime or alarm at the end of a cycle.",
    "It also adds about 15 minutes to account for the time it takes the average person to actually fall asleep. Most adults feel best on five or six complete cycles, which works out to about 7.5 to 9 hours in bed. The suggested times are estimates: cycle length varies from person to person and night to night, so use them as a helpful target rather than a strict rule.",
  ],
  steps: [
    "Choose whether you want to wake up at a set time or go to bed at a set time.",
    "Enter that time using the time picker.",
    "Read the list of suggested times, each labelled with how many 90-minute cycles it gives you.",
    "Aim for one of the highlighted five or six cycle options, which suit most adults.",
  ],
  faq: [
    {
      q: "How long is one sleep cycle?",
      a: "A full sleep cycle averages about 90 minutes, moving through light sleep, deep sleep and REM before repeating. This calculator uses 90 minutes per cycle and assumes about 15 minutes to fall asleep, though both vary from person to person.",
    },
    {
      q: "How many sleep cycles do I need?",
      a: "Most adults do best on five to six complete cycles a night, which is roughly 7.5 to 9 hours of sleep. Fewer than four cycles usually leaves you short on rest, so the five and six cycle options are highlighted as the recommended targets.",
    },
    {
      q: "Why does waking between cycles feel worse?",
      a: "If your alarm goes off during deep sleep, in the middle of a cycle, your body is jolted out of its deepest stage and you feel groggy — an effect known as sleep inertia. Waking at the end of a cycle, when sleep is lightest, tends to feel much more natural.",
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
      <SleepCalculator />
    </CalcShell>
  );
}
