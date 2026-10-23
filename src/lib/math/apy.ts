// APY (annual percentage yield): the effective yearly rate once compounding is
// included, from a nominal annual rate and how often it compounds. Pure + testable.

export interface Apy {
  /** Effective annual yield, in percent. */
  apyPct: number;
  /** Ending balance after `years` (0 when no principal/time given). */
  balance: number;
  /** Interest earned (balance − principal). */
  interest: number;
}

/**
 * @param nominalPct  nominal annual interest rate, in percent (the "APR")
 * @param perYear     compounding periods per year (12 = monthly, 365 = daily…)
 * @param principal   starting balance (optional)
 * @param years       time in years (optional; fractional allowed)
 */
export function apy(
  nominalPct: number,
  perYear: number,
  principal = 0,
  years = 0,
): Apy {
  const r = nominalPct / 100;
  const n = Math.max(1, Math.round(perYear));
  const apyPct = (Math.pow(1 + r / n, n) - 1) * 100;
  const balance =
    principal > 0 && years > 0
      ? principal * Math.pow(1 + r / n, n * years)
      : principal;
  return { apyPct, balance, interest: balance - principal };
}
