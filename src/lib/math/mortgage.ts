export interface YearRow {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

/** Amortization schedule for the principal-and-interest part of the loan. */
export function schedule(principal: number, annualRatePct: number, years: number) {
  const n = Math.round(years * 12);
  const r = annualRatePct / 100 / 12;
  const payment =
    principal <= 0
      ? 0
      : r === 0
        ? principal / n
        : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  let bal = principal;
  const balances = [principal];
  const rows: YearRow[] = [];
  let yPrin = 0;
  let yInt = 0;

  for (let m = 1; m <= n; m++) {
    const int = bal * r;
    let prin = payment - int;
    if (prin > bal) prin = bal;
    bal -= prin;
    yInt += int;
    yPrin += prin;
    if (m % 12 === 0 || m === n) {
      rows.push({
        year: Math.ceil(m / 12),
        principal: yPrin,
        interest: yInt,
        balance: Math.max(0, bal),
      });
      balances.push(Math.max(0, bal));
      yPrin = 0;
      yInt = 0;
    }
  }

  const total = payment * n;
  return { payment, total, interest: total - principal, n, balances, rows };
}
