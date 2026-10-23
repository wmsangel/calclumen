// Dividend income projection. Models annual dividend income from a yield, an
// optional annual dividend-growth rate, and optional DRIP reinvestment. Pure +
// testable. Deliberately simple: no share-price appreciation is assumed, so the
// balance only grows from reinvested dividends (a conservative floor).

export interface Dividend {
  /** Dividend income in year 1. */
  firstYearIncome: number;
  /** Year-1 income spread per month. */
  firstYearMonthly: number;
  /** Dividend income in the final year. */
  finalAnnualIncome: number;
  /** Cumulative dividends paid over the whole period. */
  totalDividends: number;
  /** Balance at the end (grows with DRIP; equals principal without it). */
  endingBalance: number;
  /** Balance at the end of each year, for charting. */
  balances: number[];
}

/**
 * @param principal   amount invested
 * @param yieldPct    starting annual dividend yield, in percent
 * @param growthPct   annual dividend growth, in percent (0 = flat)
 * @param years       holding period in years (>= 1)
 * @param reinvest    reinvest dividends (DRIP) or take them as cash
 */
export function dividend(
  principal: number,
  yieldPct: number,
  growthPct: number,
  years: number,
  reinvest: boolean,
): Dividend {
  const n = Math.max(1, Math.round(years));
  let balance = Math.max(0, principal);
  let totalDividends = 0;
  let lastIncome = 0;
  const balances: number[] = [];

  for (let y = 1; y <= n; y++) {
    const rate = (yieldPct / 100) * Math.pow(1 + growthPct / 100, y - 1);
    const income = balance * rate;
    totalDividends += income;
    lastIncome = income;
    if (reinvest) balance += income;
    balances.push(balance);
  }

  const firstYearIncome = Math.max(0, principal) * (yieldPct / 100);
  return {
    firstYearIncome,
    firstYearMonthly: firstYearIncome / 12,
    finalAnnualIncome: lastIncome,
    totalDividends,
    endingBalance: balance,
    balances,
  };
}
