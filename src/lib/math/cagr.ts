// CAGR (compound annual growth rate): the single yearly rate that grows the
// beginning value into the ending value over the period. Pure + testable.

export interface Cagr {
  /** Compound annual growth rate, in percent. */
  cagrPct: number;
  /** Total return over the whole period, in percent. */
  totalReturnPct: number;
  /** Absolute gain (end − begin). */
  gain: number;
  /** Smooth value at the end of each year, begin..end (for charting). */
  path: number[];
}

/**
 * @param begin  starting value (> 0)
 * @param end    ending value (>= 0)
 * @param years  number of years (> 0; fractional allowed)
 */
export function cagr(begin: number, end: number, years: number): Cagr {
  if (!(begin > 0) || !(years > 0) || end < 0) {
    return { cagrPct: NaN, totalReturnPct: NaN, gain: NaN, path: [] };
  }
  const ratio = end / begin;
  const rate = Math.pow(ratio, 1 / years) - 1;
  const cagrPct = rate * 100;
  const totalReturnPct = (ratio - 1) * 100;
  const gain = end - begin;

  // One point per whole year, plus the exact endpoint, so the chart lands on `end`.
  const path: number[] = [];
  const whole = Math.floor(years);
  for (let y = 0; y <= whole; y++) path.push(begin * Math.pow(1 + rate, y));
  if (years > whole) path.push(end);

  return { cagrPct, totalReturnPct, gain, path };
}
