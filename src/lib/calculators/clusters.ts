import type { CategoryId } from "./registry";

/**
 * Sub-intent groupings within a category. Used to (a) render a category hub
 * as topical sections and (b) drive intent-aware "Related calculators" links
 * on each calculator page. Tight intra-cluster linking helps Google discover
 * and topically group the money pages — the finance pages were "unknown to
 * Google" partly for lack of internal links from strong pages.
 */
export interface CalcCluster {
  id: string;
  title: string;
  blurb: string;
  /** Calculator slugs in this cluster, in display order. */
  slugs: string[];
}

export const CLUSTERS: Partial<Record<CategoryId, CalcCluster[]>> = {
  finance: [
    {
      id: "mortgage-home",
      title: "Mortgage & home",
      blurb:
        "Buy, refinance and tap the equity in a home — monthly payments, affordability, down payment and loan-to-value.",
      slugs: [
        "mortgage-calculator",
        "mortgage-refinance-calculator",
        "biweekly-mortgage-calculator",
        "home-affordability-calculator",
        "home-equity-calculator",
        "down-payment-calculator",
        "rent-affordability-calculator",
        "ltv-calculator",
      ],
    },
    {
      id: "loans-debt",
      title: "Loans & debt",
      blurb:
        "Personal loans, credit cards and debt payoff — monthly payments, interest, APR and how fast you can be debt-free.",
      slugs: [
        "loan-calculator",
        "apr-calculator",
        "credit-card-payoff-calculator",
        "debt-payoff-calculator",
        "debt-consolidation-calculator",
        "dti-calculator",
      ],
    },
    {
      id: "retirement-investing",
      title: "Retirement & investing",
      blurb:
        "Grow and project your money — retirement accounts, compound growth, investment returns and capital-gains tax.",
      slugs: [
        "retirement-savings-calculator",
        "401k-calculator",
        "roth-ira-calculator",
        "capital-gains-tax-calculator",
        "compound-interest-calculator",
        "roi-calculator",
        "rule-of-72-calculator",
        "cd-calculator",
        "inflation-calculator",
      ],
    },
    {
      id: "savings-budgeting",
      title: "Savings & budgeting",
      blurb:
        "Plan and track your money — savings goals, an emergency fund, net worth and a monthly budget.",
      slugs: [
        "savings-goal-calculator",
        "emergency-fund-calculator",
        "budget-calculator",
        "net-worth-calculator",
        "simple-interest-calculator",
      ],
    },
    {
      id: "income-tax",
      title: "Income & tax",
      blurb:
        "Pay, hours and taxes — take-home pay, salary vs hourly, income tax, sales tax and VAT.",
      slugs: [
        "income-tax-calculator",
        "paycheck-calculator",
        "salary-to-hourly-calculator",
        "hourly-to-salary-calculator",
        "overtime-pay-calculator",
        "timesheet-calculator",
        "sales-tax-calculator",
        "vat-calculator",
        "tip-calculator",
      ],
    },
  ],
};

/** Clusters defined for a category, or null if the category has none. */
export function clustersForCategory(cat: CategoryId): CalcCluster[] | null {
  return CLUSTERS[cat] ?? null;
}

/** The cluster a calculator belongs to, or null. */
export function clusterOfSlug(slug: string): CalcCluster | null {
  for (const list of Object.values(CLUSTERS)) {
    for (const c of list) if (c.slugs.includes(slug)) return c;
  }
  return null;
}
