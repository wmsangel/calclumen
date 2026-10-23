// FIRE (Financial Independence, Retire Early). Your "FIRE number" is the nest
// egg that can cover your yearly spending at a safe withdrawal rate; the model
// then projects how many years of saving it takes to get there. Pure + testable.

const CAP_YEARS = 100;

export interface Fire {
  /** Nest egg needed: annual expenses ÷ safe withdrawal rate. */
  fireNumber: number;
  /** Years until savings reach the FIRE number (null if not within 100 years). */
  yearsToFi: number | null;
  /** Already financially independent at the start. */
  alreadyFi: boolean;
  /** Balance at the end of each year (index 0 = today), up to FI. */
  balances: number[];
}

/**
 * @param annualExpenses      yearly spending you need to cover
 * @param currentSavings      invested net worth today
 * @param annualContribution  amount added to investments each year
 * @param returnPct           expected real annual return, in percent
 * @param swrPct              safe withdrawal rate, in percent (4 is common)
 */
export function fire(
  annualExpenses: number,
  currentSavings: number,
  annualContribution: number,
  returnPct: number,
  swrPct: number,
): Fire {
  const swr = swrPct / 100;
  const fireNumber = swr > 0 ? annualExpenses / swr : Infinity;

  let balance = Math.max(0, currentSavings);
  const balances = [balance];

  if (balance >= fireNumber) {
    return { fireNumber, yearsToFi: 0, alreadyFi: true, balances };
  }

  const r = returnPct / 100;
  for (let year = 1; year <= CAP_YEARS; year++) {
    balance = balance * (1 + r) + annualContribution;
    balances.push(balance);
    if (balance >= fireNumber) {
      return { fireNumber, yearsToFi: year, alreadyFi: false, balances };
    }
  }
  return { fireNumber, yearsToFi: null, alreadyFi: false, balances };
}
