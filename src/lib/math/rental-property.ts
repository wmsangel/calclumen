/** Monthly principal & interest for a fully amortizing loan. */
export function monthlyPI(loan: number, annualRatePct: number, years: number): number {
  if (loan <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (n <= 0) return 0;
  if (r === 0) return loan / n;
  const f = Math.pow(1 + r, n);
  return (loan * r * f) / (f - 1);
}
