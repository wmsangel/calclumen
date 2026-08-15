// Indicative, static exchange rates for the currency converter.
// This is a static (SSG) site with no live API, so these figures are
// baked-in units-per-USD for rough estimation only — not real-time quotes.

export const RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.52,
  JPY: 156,
  CNY: 7.24,
  INR: 83.4,
  CHF: 0.88,
  MXN: 18.6,
  BRL: 5.45,
  ZAR: 18.7,
};

export const RATES_UPDATED = "2026-08";

/** Convert an amount between currencies via USD using the indicative table. */
export function convert(amount: number, from: string, to: string): number {
  return (amount / RATES[from]) * RATES[to];
}
