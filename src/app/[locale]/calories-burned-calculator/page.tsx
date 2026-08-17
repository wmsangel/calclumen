import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { CaloriesBurnedCalculator } from "@/components/calculators/calories-burned-calculator";

const SLUG = "calories-burned-calculator";

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
    "The calories you burn during exercise depend mainly on the intensity of the activity, how heavy you are and how long you keep going. This calculator estimates that energy cost using MET values — the metabolic equivalent of task, a standard measure of how hard an activity is compared with sitting quietly. Higher-MET activities like running or skipping burn far more per minute than gentle ones like yoga.",
    "Enter your activity, weight and duration to get an estimate of calories burned, along with an hourly rate and the MET value used. The figures are useful for planning workouts and balancing energy intake, but they are estimates: real burn varies with fitness, terrain, effort and individual metabolism, so treat the result as a well-informed ballpark rather than an exact measurement.",
  ],
  steps: [
    "Pick the activity that best matches your workout.",
    "Enter your body weight and choose kilograms or pounds.",
    "Enter how many minutes you exercised.",
    "Read the estimated calories burned, the hourly rate and the MET value.",
  ],
  faq: [
    {
      q: "How are calories burned calculated?",
      a: "This tool uses the MET formula: calories = MET × 3.5 × weight in kg ÷ 200 × minutes. The MET value represents the activity's intensity relative to rest, so a heavier person exercising longer at a higher MET burns more calories. Weight in pounds is converted to kilograms first.",
    },
    {
      q: "What is a MET value?",
      a: "A MET (metabolic equivalent of task) expresses how much energy an activity uses compared with sitting still, which is 1 MET. An activity at 7 METs burns about seven times as much energy per minute as resting. MET values come from published research and let you compare the intensity of different exercises.",
    },
    {
      q: "How accurate is this estimate?",
      a: "MET-based estimates are good general approximations but not exact. Actual calorie burn depends on your fitness level, exercise intensity, terrain, temperature and individual metabolism. Use the number to compare activities and plan training, and rely on a heart-rate monitor or lab testing if you need higher precision.",
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
      <CaloriesBurnedCalculator />
    </CalcShell>
  );
}
