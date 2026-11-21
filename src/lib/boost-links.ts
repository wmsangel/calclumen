// Internal-link boost (treatment step 2б, 2026-11-21): the 16 calculators that
// Google HAS indexed link, in-body and crawlable, to the 20 that are
// "crawled, currently not indexed". HTML comparison on 19.11 showed the
// unindexed pages are not thinner — they lack discovery paths from pages
// Google already trusts. Each target gets ≥2 inbound links.
export const BOOST_LINKS: Record<string, string[]> = {
  "apr-calculator": ["auto-loan-calculator", "credit-card-payoff-calculator", "compound-interest-calculator"],
  "btu-calculator": ["square-footage-calculator", "roofing-calculator", "home-equity-calculator"],
  "budget-calculator": ["retirement-savings-calculator", "credit-card-payoff-calculator", "529-calculator"],
  "emergency-fund-calculator": ["retirement-savings-calculator", "hsa-calculator", "annuity-calculator"],
  "flooring-calculator": ["square-footage-calculator", "roofing-calculator", "discount-calculator"],
  "lcm-gcd-calculator": ["average-calculator", "standard-deviation-calculator", "cagr-calculator"],
  "lease-vs-buy-calculator": ["auto-loan-calculator", "discount-calculator", "capital-gains-tax-calculator"],
  "mileage-reimbursement-calculator": ["auto-loan-calculator", "capital-gains-tax-calculator", "hsa-calculator"],
  "overtime-pay-calculator": ["add-days-calculator", "age-calculator", "retirement-savings-calculator"],
  "paint-calculator": ["square-footage-calculator", "roofing-calculator", "discount-calculator"],
  "pythagorean-theorem-calculator": ["standard-deviation-calculator", "average-calculator", "square-footage-calculator"],
  "set-partitions-calculator": ["average-calculator", "standard-deviation-calculator", "cagr-calculator"],
  "sleep-calculator": ["age-calculator", "ovulation-calculator", "bmr-calculator"],
  "target-heart-rate-calculator": ["bmr-calculator", "ovulation-calculator", "age-calculator"],
  "temperature-converter": ["bmr-calculator", "add-days-calculator", "discount-calculator"],
  "volume-converter": ["square-footage-calculator", "roofing-calculator", "average-calculator"],
};

export function boostLinksFor(slug: string): string[] {
  return BOOST_LINKS[slug] ?? [];
}
