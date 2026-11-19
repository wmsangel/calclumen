/**
 * Extra mortgage / loan payments: how much interest and time you save by paying
 * more than the scheduled payment. Standard monthly amortization (interest =
 * balance × r/12, remainder to principal), with three kinds of extra payment:
 * a fixed extra amount every month, an extra lump sum once a year (in a chosen
 * month), and a one-time lump sum in a given month. Extra payments go straight
 * to principal; the scheduled payment is unchanged (the loan just ends sooner).
 */
export interface ExtraPaymentInput {
  /** Current loan balance (or original amount for a new loan). */
  balance: number;
  /** Annual interest rate, percent. */
  annualRatePct: number;
  /** Remaining term in months at the current scheduled payment. */
  termMonths: number;
  /** Extra amount paid every month. */
  extraMonthly: number;
  /** Extra lump sum paid once a year. */
  extraYearly: number;
  /** Month of the year (1–12) the yearly lump sum is paid, counted from month 1. */
  extraYearlyMonth: number;
  /** One-time lump sum. */
  oneTime: number;
  /** Month number (1 = first payment) the one-time sum is paid. */
  oneTimeMonth: number;
}

export interface PayoffPath {
  months: number;
  totalInterest: number;
  totalPaid: number;
  /** Balance at the end of each year (index 0 = after 12 months). */
  yearEndBalances: number[];
}

export interface ExtraPaymentResult {
  scheduledPayment: number;
  base: PayoffPath;
  withExtra: PayoffPath;
  interestSaved: number;
  monthsSaved: number;
  totalExtraPaid: number;
}

export const MAX_MONTHS = 600;

export function scheduledPayment(balance: number, annualRatePct: number, termMonths: number): number {
  const r = annualRatePct / 100 / 12;
  if (termMonths <= 0) return balance;
  if (r === 0) return balance / termMonths;
  return (balance * r) / (1 - Math.pow(1 + r, -termMonths));
}

function amortize(
  balance: number,
  annualRatePct: number,
  payment: number,
  extra: (month: number) => number,
): PayoffPath {
  const r = annualRatePct / 100 / 12;
  let bal = balance;
  let months = 0;
  let totalInterest = 0;
  let totalPaid = 0;
  const yearEndBalances: number[] = [];
  while (bal > 0.005 && months < MAX_MONTHS) {
    months++;
    const interest = bal * r;
    let principal = payment - interest;
    if (principal <= 0 && r > 0) {
      // Payment doesn't cover interest — treat as never paid off.
      return { months: Infinity, totalInterest: Infinity, totalPaid: Infinity, yearEndBalances };
    }
    principal += Math.max(0, extra(months));
    if (principal > bal) principal = bal;
    totalInterest += interest;
    totalPaid += interest + principal;
    bal -= principal;
    if (months % 12 === 0) yearEndBalances.push(Math.max(0, bal));
  }
  if (bal > 0.005) yearEndBalances.push(bal);
  return { months, totalInterest, totalPaid, yearEndBalances };
}

export function extraPayment(i: ExtraPaymentInput): ExtraPaymentResult {
  const payment = scheduledPayment(i.balance, i.annualRatePct, i.termMonths);
  const base = amortize(i.balance, i.annualRatePct, payment, () => 0);
  const yearlyMonth = Math.min(12, Math.max(1, Math.round(i.extraYearlyMonth || 12)));
  const oneMonth = Math.max(1, Math.round(i.oneTimeMonth || 1));
  const withExtra = amortize(i.balance, i.annualRatePct, payment, (m) => {
    let e = Math.max(0, i.extraMonthly);
    if (i.extraYearly > 0 && m % 12 === yearlyMonth % 12) e += i.extraYearly;
    if (i.oneTime > 0 && m === oneMonth) e += i.oneTime;
    return e;
  });
  const interestSaved = Number.isFinite(base.totalInterest) && Number.isFinite(withExtra.totalInterest)
    ? base.totalInterest - withExtra.totalInterest
    : 0;
  const monthsSaved = Number.isFinite(base.months) && Number.isFinite(withExtra.months) ? base.months - withExtra.months : 0;
  const totalExtraPaid = Number.isFinite(withExtra.totalPaid) ? withExtra.totalPaid - withExtra.months * payment : 0;
  return { scheduledPayment: payment, base, withExtra, interestSaved, monthsSaved, totalExtraPaid: Math.max(0, totalExtraPaid) };
}
