// Mortgage discount points — pay an upfront fee to lower the interest rate.
//
// One discount point costs 1% of the loan amount and typically lowers the rate
// by about 0.25 percentage points, but lenders quote both; so the user enters
// the points and the two rates directly. We compare the standard amortizing
// payment (PMT) with and without points and report the break-even month: the
// point at which cumulative monthly savings exceed the upfront cost. Also shows
// what you keep if you sell/refinance after a chosen number of years — the
// usual reason points do NOT pay off. Arithmetic on user inputs only.

export interface MortgagePointsInput {
  loanAmount: number;
  termYears: number;
  /** Rate without buying points, % APR. */
  baseRatePct: number;
  /** Rate after buying points, % APR. */
  pointsRatePct: number;
  /** Number of discount points (each = 1% of the loan). */
  points: number;
  /** How long you expect to keep the loan, years. */
  yearsKept: number;
}

export interface MortgagePointsResult {
  pointsCost: number;
  paymentBase: number;
  paymentWithPoints: number;
  monthlySavings: number;
  /** Months until cumulative savings cover the points cost; null if never. */
  breakEvenMonths: number | null;
  /** Net benefit (savings − cost) if the loan is kept for `yearsKept`. */
  netAfterYearsKept: number;
  /** Total interest saved over the full term, minus the cost of points. */
  netOverFullTerm: number;
  interestBase: number;
  interestWithPoints: number;
}

const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function monthlyPayment(principal: number, ratePct: number, years: number): number {
  const n = Math.max(1, Math.round(years * 12));
  const r = ratePct / 100 / 12;
  if (principal <= 0) return 0;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function mortgagePoints(inp: MortgagePointsInput): MortgagePointsResult {
  const loan = pos(inp.loanAmount);
  const years = pos(inp.termYears) || 30;
  const n = Math.round(years * 12);
  const pointsCost = loan * (pos(inp.points) / 100);

  const paymentBase = monthlyPayment(loan, pos(inp.baseRatePct), years);
  const paymentWithPoints = monthlyPayment(loan, pos(inp.pointsRatePct), years);
  const monthlySavings = paymentBase - paymentWithPoints;

  const breakEvenMonths =
    monthlySavings > 0 ? Math.ceil(pointsCost / monthlySavings) : null;
  const keptMonths = Math.min(n, Math.round(pos(inp.yearsKept) * 12));

  return {
    pointsCost,
    paymentBase,
    paymentWithPoints,
    monthlySavings,
    breakEvenMonths: breakEvenMonths !== null && breakEvenMonths <= n ? breakEvenMonths : null,
    netAfterYearsKept: monthlySavings * keptMonths - pointsCost,
    netOverFullTerm: monthlySavings * n - pointsCost,
    interestBase: paymentBase * n - loan,
    interestWithPoints: paymentWithPoints * n - loan,
  };
}
