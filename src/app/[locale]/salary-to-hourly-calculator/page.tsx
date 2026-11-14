import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { SalaryToHourly } from "@/components/calculators/salary-to-hourly";

const SLUG = "salary-to-hourly-calculator";

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
    "This salary to hourly calculator converts an annual salary into an equivalent hourly, weekly and monthly rate — or works the other way, turning an hourly wage into a full-year salary. Pick a mode, enter your figure and set how many hours you work each week and how many weeks you work each year.",
    "The math is straightforward. Your annual pay is simply your hourly rate multiplied by the hours you work each week and the weeks you work each year. Change the assumptions — a 37.5-hour week, or 48 paid weeks instead of 52 to allow for unpaid time off — and every result updates so you can compare offers on a like-for-like basis.",
  ],
  steps: [
    "Choose a mode: Salary → hourly to start from an annual figure, or Hourly → salary to start from a wage.",
    "Enter your annual salary or hourly rate and pick your currency.",
    "Adjust hours per week (40 by default) and weeks per year (52 by default) to match your schedule.",
    "Read the hourly, weekly, monthly and annual equivalents in the result cards.",
  ],
  methodology: [
    "Hourly rate = annual salary ÷ (hours per week × weeks per year). With the defaults of 40 hours and 52 weeks that is 2,080 hours a year, the figure most US employers use; the federal government uses a 2,087-hour divisor and some employers exclude unpaid leave, so adjust the weeks if your situation differs. Weekly, biweekly and monthly figures are the annual amount divided by 52, 26 and 12.",
    "The conversion is gross pay before tax and ignores overtime, bonuses, paid time off and the value of benefits, which can make two offers with the same hourly rate very different in practice.",
  ],
  sources: [
    { label: "U.S. Office of Personnel Management — Computing hourly rates of pay using the 2,087-hour divisor", url: "https://www.opm.gov/policy-data-oversight/pay-leave/pay-administration/fact-sheets/computing-hourly-rates-of-pay-using-the-2087-hour-divisor/" },
    { label: "U.S. Department of Labor — Overtime pay under the FLSA", url: "https://www.dol.gov/agencies/whd/overtime" },
  ],
  faq: [
    {
      q: "How many work hours are in a year?",
      a: "A standard full-time schedule of 40 hours a week over 52 weeks is 2,080 hours a year. If you take unpaid time off, reduce the weeks per year — 50 weeks gives 2,000 hours and 48 weeks gives 1,920 hours.",
    },
    {
      q: "How do I convert an hourly rate to an annual salary?",
      a: "Multiply the hourly rate by the hours you work each week and then by the weeks you work each year. For example, $30 per hour × 40 hours × 52 weeks is a $62,400 annual salary. Switch this tool to Hourly → salary mode to do it automatically.",
    },
    {
      q: "Does this work for part-time hours?",
      a: "Yes. Just set hours per week to your actual schedule — for instance 25 or 30 hours — and the calculator scales the weekly, monthly and annual figures accordingly.",
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
      <SalaryToHourly />
    </CalcShell>
  );
}
