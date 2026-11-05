import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { RentVsBuyCalculator } from "@/components/calculators/rent-vs-buy";

const SLUG = "rent-vs-buy-calculator";

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
    "This rent vs. buy calculator compares the true long-run cost of renting a home against buying one, so you can see which leaves you better off and after how many years. It does not just stack a mortgage payment against rent — that comparison is misleading, because buying ties up a down payment and closing costs that could otherwise be invested, while renting never builds equity.",
    "Instead it uses the opportunity-cost method: both a renter and a buyer are assumed to spend the same housing budget each month, the cheaper side invests the difference at your expected investment return, and the buyer also builds equity as the mortgage is paid down and the home appreciates. After your chosen time horizon it compares each side's net worth — the buyer's investments plus home equity (sale price minus selling costs and the remaining loan) against the renter's invested savings. This is the same approach used by well-known calculators such as The New York Times' “Is It Better to Rent or Buy?”.",
  ],
  steps: [
    "Enter the home price and the monthly rent for a comparable place.",
    "Set your down payment, mortgage rate and term, and how many years you expect to stay (the time horizon).",
    "Adjust the assumptions — home appreciation, rent growth, investment return, property tax, maintenance and insurance, HOA, and buying and selling costs.",
    "Read the verdict, the break-even year, and the net-worth table showing buying vs renting year by year.",
  ],
  faq: [
    {
      q: "Why compare net worth instead of monthly payment vs rent?",
      a: "A monthly payment ignores two big things: the down payment and closing costs you could have invested if you rented, and the equity you build as a buyer. Comparing net worth at the end of your time horizon captures both the money tied up in the home and the equity it creates, which is why a cheap monthly payment does not always mean buying wins.",
    },
    {
      q: "What is the break-even year?",
      a: "It is the first year at which the buyer's net worth catches up to the renter's. Buying usually loses in the early years because of the upfront closing costs and the selling costs you pay if you move soon. The longer you stay, the more buying tends to pull ahead — so if the break-even year is beyond how long you plan to stay, renting is likely the better call.",
    },
    {
      q: "What investment return should I use?",
      a: "Use what you could realistically earn on the money you would otherwise tie up in the home — for a long horizon in a diversified index fund, many people assume roughly 5–7% before inflation. A higher return favours renting (because the renter's invested down payment grows faster); a lower return favours buying.",
    },
    {
      q: "Is this a guaranteed answer?",
      a: "No. The result is only as good as your assumptions — future home appreciation, rent growth and investment returns are unknown, and the model leaves out taxes on investment gains and any mortgage-interest deductions. Treat it as a structured comparison to test different scenarios, not a prediction.",
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
      <RentVsBuyCalculator />
    </CalcShell>
  );
}
