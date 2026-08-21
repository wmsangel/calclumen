import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { SalaryToHourly } from "@/components/calculators/salary-to-hourly";

const SLUG = "hourly-to-salary-calculator";

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
    "This hourly to salary calculator turns an hourly wage into an annual, monthly and weekly salary. Enter your hourly rate along with how many hours you work per week and how many weeks you work per year, and it shows what that adds up to over a full year — handy for comparing a job offer, a contract rate or a raise against a salaried role.",
    "The core maths is simple: annual salary = hourly rate × hours per week × weeks per year. The default 40 hours × 52 weeks assumes full-time work with paid time off; if you take unpaid weeks off, lower the weeks-per-year figure and the annual total drops accordingly. You can also flip the tool to go the other way and convert a salary back to an hourly rate.",
  ],
  steps: [
    "Enter your hourly rate and choose your currency.",
    "Set how many hours you work per week (40 is standard full-time).",
    "Set how many weeks you work per year (52 assumes paid time off).",
    "Read your equivalent weekly, monthly and annual salary.",
    "Use the toggle to switch to Salary → hourly if you need the reverse.",
  ],
  faq: [
    {
      q: "How do I convert hourly pay to an annual salary?",
      a: "Multiply your hourly rate by the hours you work each week, then by the number of weeks you work per year. For example, $30/hour × 40 hours × 52 weeks = $62,400 a year. This calculator does it instantly and also breaks the figure down to weekly and monthly.",
    },
    {
      q: "Should I use 52 weeks or fewer?",
      a: "Use 52 weeks if you're paid for your time off (typical for salaried and many full-time hourly roles). If you take unpaid weeks — common for contractors or seasonal work — subtract them. Two unpaid weeks means 50 weeks, which lowers your annual total.",
    },
    {
      q: "Is this before or after tax?",
      a: "It's gross pay — before income tax, deductions and benefits. Your take-home pay will be lower. To estimate what actually lands in your account, use a paycheck or take-home pay calculator that factors in taxes and deductions.",
    },
    {
      q: "How do I compare an hourly job to a salaried one?",
      a: "Convert the hourly rate to an annual figure here, then compare like-for-like — but also weigh benefits, paid time off, overtime eligibility and job security, which don't show up in the raw number. This is an estimate for comparison, not financial advice.",
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
      <SalaryToHourly defaultMode="toSalary" />
    </CalcShell>
  );
}
