import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { GpaCalculator } from "@/components/calculators/gpa";

const SLUG = "gpa-calculator";

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
    "This GPA calculator turns a list of letter grades and credit hours into a grade point average on the standard 4.0 scale. Add a row for each course, pick the grade, enter the credits, and the weighted average updates as you type. Courses worth more credits pull the average harder, which is exactly how schools compute it.",
    "Your GPA is a credit-weighted average of grade points. Each letter maps to a point value — an A is 4.0, a B is 3.0, and so on — and each course contributes its points multiplied by its credits. Divide the total quality points by the total credits and you have the GPA. This tool shows all three numbers so you can check the math.",
  ],
  steps: [
    "Add a row for every course by clicking “Add course”.",
    "Choose the letter grade from the dropdown and type the credit hours for each course.",
    "Read your GPA, total credits, and quality points below — they recalculate instantly.",
    "Remove any course with the × button if you added it by mistake.",
  ],
  faq: [
    {
      q: "How is GPA calculated on a 4.0 scale?",
      a: "Multiply each course's grade points by its credit hours to get quality points, add those up, then divide by the total credit hours. For example, an A (4.0) in a 3-credit class and a B (3.0) in a 4-credit class give (12 + 12) ÷ 7 ≈ 3.43.",
    },
    {
      q: "What grade points do the letters map to?",
      a: "A+ and A are 4.0, A- is 3.7, B+ is 3.3, B is 3.0, B- is 2.7, C+ is 2.3, C is 2.0, C- is 1.7, D+ is 1.3, D is 1.0, D- is 0.7, and F is 0.0. This is the most common unweighted 4.0 scale.",
    },
    {
      q: "Why do credit hours matter?",
      a: "GPA is a weighted average, so a grade in a 4-credit course counts more than the same grade in a 1-credit course. Entering accurate credit hours is what makes the result match your transcript.",
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
      <GpaCalculator />
    </CalcShell>
  );
}
