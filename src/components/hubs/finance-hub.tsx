import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

// Editorial hub content for /finance. Hand-written to be genuinely useful on
// its own — it maps real money decisions to the right tool and explains the
// concepts behind them, with crawlable do-follow links down to the money
// calculators (topical-authority + internal-linking play, not filler).

function T({
  locale,
  slug,
  children,
}: {
  locale: Locale;
  slug: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={`/${locale}/${slug}`} className="prose-link">
      {children}
    </Link>
  );
}

export function FinanceHubIntro({ locale }: { locale: Locale }) {
  return (
    <div>
      <p className="text-[var(--ink-soft)] leading-relaxed">
        Almost every money decision comes down to one question:{" "}
        <em>what does this actually cost — or earn — over time?</em> A monthly
        loan payment hides the total interest. A savings rate hides what it
        compounds into in twenty years. The calculators below turn those vague
        numbers into concrete ones, so you can compare options side by side
        before you commit — whether you are taking on a mortgage, paying down a
        card, or deciding how much to set aside each month.
      </p>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-4">
        Each tool runs entirely in your browser — nothing you type is sent
        anywhere — and shows the formula and a breakdown, not just a single
        figure. Below the tools you will find a short guide to picking the right
        one for your situation, plain-English explanations of the ideas they use
        (APR, APY, amortization, compounding), and answers to the questions
        people ask most.
      </p>
    </div>
  );
}

export function FinanceHubBody({ locale }: { locale: Locale }) {
  const faq: { q: string; a: string }[] = [
    {
      q: "What is the difference between APR and APY?",
      a: "APR (annual percentage rate) is the yearly cost of borrowing, including fees, without counting compounding — it is what you compare on loans and credit cards. APY (annual percentage yield) does count compounding, so it reflects what savings or investments actually grow by in a year. For the same stated rate, APY is always a little higher than APR.",
    },
    {
      q: "How much house or rent can I afford?",
      a: "A common guideline is to keep housing costs near 28% of your gross monthly income and total debt payments under about 36%. The home-affordability and rent-affordability calculators apply those ratios to your income, debts and down payment to give a realistic price or rent ceiling, rather than the maximum a lender will approve.",
    },
    {
      q: "Should I pay off debt or invest first?",
      a: "Compare the numbers. If a debt charges more interest than you could reasonably expect to earn investing — most credit cards do — paying it off is a guaranteed return at that rate. Lower-rate debt (like many mortgages) can run alongside investing. The debt-payoff and compound-interest calculators let you see both sides in real figures.",
    },
    {
      q: "What does compound interest actually do to savings?",
      a: "Compounding means you earn returns on your past returns, so growth accelerates over time — the last decade of a long savings plan usually adds far more than the first. Small differences in rate or in how early you start compound into large gaps at the end. The compound-interest and retirement-savings calculators show the full curve, not just the total.",
    },
    {
      q: "Are these finance calculators free and accurate?",
      a: "Yes — every calculator here is free, needs no sign-up, and computes locally in your browser using standard financial formulas (amortization, compound growth, standard tax brackets where applicable). They are built for planning and comparison; for a binding quote or filing, confirm the final figures with your lender, bank or a licensed professional.",
    },
  ];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <h2 className="text-xl font-semibold">
        Which finance calculator should you use?
      </h2>
      <div className="mt-4 space-y-4 text-[var(--ink-soft)] leading-relaxed">
        <p>
          <strong className="text-[var(--ink)]">Buying a home.</strong> Start
          with <T locale={locale} slug="home-affordability-calculator">home
          affordability</T> to find a sensible price, then{" "}
          <T locale={locale} slug="mortgage-calculator">mortgage payment</T> for
          the monthly cost including taxes and insurance.{" "}
          <T locale={locale} slug="down-payment-calculator">Down payment</T> and{" "}
          <T locale={locale} slug="pmi-calculator">PMI</T> show how your upfront
          cash changes the deal, and{" "}
          <T locale={locale} slug="mortgage-refinance-calculator">refinance</T>{" "}
          or{" "}
          <T locale={locale} slug="biweekly-mortgage-calculator">biweekly
          payments</T>{" "}
          show how to pay less interest later.
        </p>
        <p>
          <strong className="text-[var(--ink)]">Paying off debt.</strong> Use{" "}
          <T locale={locale} slug="debt-payoff-calculator">debt payoff</T> to
          build a timeline,{" "}
          <T locale={locale} slug="credit-card-payoff-calculator">credit-card
          payoff</T>{" "}
          to see the cost of minimum payments, and{" "}
          <T locale={locale} slug="debt-consolidation-calculator">debt
          consolidation</T>{" "}
          to check whether one combined loan would really save money. Your{" "}
          <T locale={locale} slug="dti-calculator">debt-to-income ratio</T>{" "}
          tells you where you stand with lenders.
        </p>
        <p>
          <strong className="text-[var(--ink)]">Saving and investing.</strong>{" "}
          <T locale={locale} slug="compound-interest-calculator">Compound
          interest</T>{" "}
          is the core tool; pair it with a{" "}
          <T locale={locale} slug="savings-goal-calculator">savings goal</T>,{" "}
          an{" "}
          <T locale={locale} slug="emergency-fund-calculator">emergency fund</T>{" "}
          target, and longer-term{" "}
          <T locale={locale} slug="retirement-savings-calculator">retirement</T>{" "}
          or{" "}
          <T locale={locale} slug="fire-calculator">financial-independence</T>{" "}
          planning. <T locale={locale} slug="inflation-calculator">Inflation</T>{" "}
          shows what those future dollars are really worth.
        </p>
        <p>
          <strong className="text-[var(--ink)]">Pay and taxes.</strong> Convert
          between{" "}
          <T locale={locale} slug="salary-to-hourly-calculator">salary and
          hourly</T>{" "}
          pay, estimate take-home with the{" "}
          <T locale={locale} slug="paycheck-calculator">paycheck</T> and{" "}
          <T locale={locale} slug="income-tax-calculator">income-tax</T>{" "}
          calculators, and handle{" "}
          <T locale={locale} slug="self-employment-tax-calculator">
            self-employment
          </T>{" "}
          or{" "}
          <T locale={locale} slug="capital-gains-tax-calculator">capital-gains</T>{" "}
          tax when it applies.
        </p>
      </div>

      <h2 className="mt-12 text-xl font-semibold">Money concepts worth knowing</h2>
      <div className="mt-4 space-y-4 text-[var(--ink-soft)] leading-relaxed">
        <p>
          <strong className="text-[var(--ink)]">Amortization.</strong> On a
          fixed loan your payment stays the same, but early on most of it is
          interest and only a little goes to principal; the balance tips over
          time. That is why extra payments early save the most — see it on the{" "}
          <T locale={locale} slug="loan-calculator">loan</T> and{" "}
          <T locale={locale} slug="mortgage-calculator">mortgage</T>{" "}
          calculators.
        </p>
        <p>
          <strong className="text-[var(--ink)]">Compounding frequency.</strong>{" "}
          Interest that compounds monthly grows a little faster than the same
          rate compounded yearly. It is the gap between a stated rate and the{" "}
          <T locale={locale} slug="apy-calculator">APY</T> you actually earn —
          small on a savings account, large over decades of investing.
        </p>
        <p>
          <strong className="text-[var(--ink)]">Good payoff order.</strong>{" "}
          Mathematically, paying the highest-interest balance first (the
          avalanche) costs the least; paying the smallest balance first (the
          snowball) keeps you motivated. Both beat paying minimums — the{" "}
          <T locale={locale} slug="credit-card-payoff-calculator">credit-card
          payoff</T>{" "}
          calculator shows how much minimums really cost.
        </p>
        <p>
          <strong className="text-[var(--ink)]">The 28/36 rule.</strong> Lenders
          look at how much of your income goes to housing (around 28%) and to
          all debt (around 36%). Staying under those lines keeps borrowing
          affordable and approval likely — your{" "}
          <T locale={locale} slug="dti-calculator">debt-to-income ratio</T> is
          how it is measured.
        </p>
      </div>

      <h2 className="mt-12 text-xl font-semibold">
        Frequently asked questions
      </h2>
      <div className="mt-4 space-y-2">
        {faq.map((f) => (
          <details key={f.q} className="group card p-4">
            <summary className="cursor-pointer font-medium list-none flex justify-between items-center gap-4">
              {f.q}
              <span className="text-[var(--accent)] text-xl group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <p className="mt-2 text-sm text-[var(--ink-soft)] leading-relaxed">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
