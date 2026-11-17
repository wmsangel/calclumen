import {
  ADDITIONAL_MEDICARE_RATE,
  ADDITIONAL_MEDICARE_THRESHOLD,
  SE_MEDICARE_RATE,
  SE_NET_EARNINGS_FACTOR,
  SE_SOCIAL_SECURITY_RATE,
  SOCIAL_SECURITY_WAGE_BASE,
  STANDARD_DEDUCTION,
  federalIncomeTax,
  type Filing,
} from "./federal-tax-2026";

/**
 * Quarterly estimated tax (Form 1040-ES) for a US self-employed / 1099 filer,
 * tax year 2026. Models IRS Publication 505 chapter 2: the required annual
 * payment is the SMALLER of 90% of this year's tax and 100% of last year's tax
 * (110% if last year's AGI was over $150,000; $75,000 if married filing
 * separately), and no estimated payments are required when the balance due
 * after withholding is under $1,000.
 *
 * Simplifications (stated on the page): standard deduction only; optional QBI
 * deduction at 20% of qualified business income (net profit minus the SE-tax
 * deduction), capped at 20% of taxable income before QBI, with no W-2/UBIA or
 * SSTB phase-out (fine below the 2026 thresholds); flat state rate on taxable
 * income; no credits, no AMT, no capital-gains rates.
 */
export interface EstimatedTaxInput {
  filing: Filing;
  /** Net profit from self-employment (Schedule C line 31), yearly. */
  netSelfEmployment: number;
  /** W-2 wages this year (shares the Social Security wage base). */
  w2Wages: number;
  /** Other taxable income: interest, dividends, rental, etc. */
  otherIncome: number;
  /** Federal income tax already withheld / expected to be withheld this year. */
  federalWithholding: number;
  /** Total tax shown on last year's return (Form 1040 line 24), 0 if none. */
  priorYearTax: number;
  /** Last year's AGI exceeded $150,000 ($75,000 MFS) → 110% safe harbor. */
  priorYearAgiOver150k: boolean;
  /** Flat state income-tax rate, percent (0 for no-tax states). */
  statePct: number;
  /** Apply the 20% qualified business income deduction. */
  applyQbi: boolean;
  /** Estimated payments already made this year (subtracted from what's left). */
  paymentsMade: number;
}

export interface EstimatedTaxResult {
  seEarnings: number;
  socialSecurityTax: number;
  medicareTax: number;
  seTax: number;
  seDeduction: number;
  agi: number;
  qbiDeduction: number;
  taxable: number;
  incomeTax: number;
  marginalRate: number;
  additionalMedicare: number;
  stateTax: number;
  /** Federal income tax + SE tax + additional Medicare (what 1040-ES covers). */
  federalTotal: number;
  /** federalTotal + state. */
  totalTax: number;
  ninetyPercent: number;
  priorYearSafeHarbor: number | null;
  priorYearFactor: number;
  /** Required annual payment under the safe-harbor rules (federal). */
  requiredAnnual: number;
  /** Required annual payment minus withholding and payments made. */
  requiredRemaining: number;
  /** Balance due after withholding if you simply paid 100% of this year's tax. */
  balanceDue: number;
  /** True when balanceDue < $1,000 → no estimated payments required. */
  underThreshold: boolean;
  quarterlyFederal: number;
  quarterlyState: number;
  quarterlyTotal: number;
  effectiveRate: number;
}

/** 1040-ES due dates for tax year 2026 (IRS Publication 505 / Form 1040-ES). */
export const DUE_DATES_2026 = [
  { quarter: "Q1", period: "Jan 1 – Mar 31", due: "2026-04-15" },
  { quarter: "Q2", period: "Apr 1 – May 31", due: "2026-06-15" },
  { quarter: "Q3", period: "Jun 1 – Aug 31", due: "2026-09-15" },
  { quarter: "Q4", period: "Sep 1 – Dec 31", due: "2027-01-15" },
] as const;

export const NO_PAYMENT_THRESHOLD = 1_000;

export function estimatedTax(i: EstimatedTaxInput): EstimatedTaxResult {
  const net = Math.max(0, i.netSelfEmployment);
  const w2 = Math.max(0, i.w2Wages);
  const other = Math.max(0, i.otherIncome);

  // Self-employment tax (Schedule SE). W-2 wages use up the SS wage base first.
  const seEarnings = net * SE_NET_EARNINGS_FACTOR;
  const ssRoom = Math.max(0, SOCIAL_SECURITY_WAGE_BASE - w2);
  const socialSecurityTax = Math.min(seEarnings, ssRoom) * SE_SOCIAL_SECURITY_RATE;
  const medicareTax = seEarnings * SE_MEDICARE_RATE;
  const seTax = socialSecurityTax + medicareTax;
  const seDeduction = seTax / 2;

  const agi = w2 + other + net - seDeduction;
  const std = STANDARD_DEDUCTION[i.filing];
  const taxableBeforeQbi = Math.max(0, agi - std);
  const qbiDeduction = i.applyQbi
    ? Math.min(0.2 * Math.max(0, net - seDeduction), 0.2 * taxableBeforeQbi)
    : 0;
  const taxable = Math.max(0, taxableBeforeQbi - qbiDeduction);

  const { tax: incomeTax, marginal } = federalIncomeTax(taxable, i.filing);
  const medicareWages = w2 + seEarnings;
  const additionalMedicare =
    Math.max(0, medicareWages - ADDITIONAL_MEDICARE_THRESHOLD[i.filing]) * ADDITIONAL_MEDICARE_RATE;

  const federalTotal = incomeTax + seTax + additionalMedicare;
  const stateTax = Math.max(0, i.statePct) / 100 * taxable;
  const totalTax = federalTotal + stateTax;

  const withholding = Math.max(0, i.federalWithholding);
  const paid = Math.max(0, i.paymentsMade);
  const balanceDue = federalTotal - withholding;
  const underThreshold = balanceDue < NO_PAYMENT_THRESHOLD;

  const ninetyPercent = 0.9 * federalTotal;
  const priorYearFactor = i.priorYearAgiOver150k ? 1.1 : 1.0;
  const priorYearSafeHarbor = i.priorYearTax > 0 ? priorYearFactor * i.priorYearTax : null;
  const requiredAnnual =
    priorYearSafeHarbor === null ? ninetyPercent : Math.min(ninetyPercent, priorYearSafeHarbor);
  const requiredRemaining = underThreshold ? 0 : Math.max(0, requiredAnnual - withholding - paid);

  const quarterlyFederal = requiredRemaining / 4;
  const quarterlyState = stateTax / 4;
  const quarterlyTotal = quarterlyFederal + quarterlyState;
  const gross = w2 + other + net;
  const effectiveRate = gross > 0 ? totalTax / gross : 0;

  return {
    seEarnings,
    socialSecurityTax,
    medicareTax,
    seTax,
    seDeduction,
    agi,
    qbiDeduction,
    taxable,
    incomeTax,
    marginalRate: marginal,
    additionalMedicare,
    stateTax,
    federalTotal,
    totalTax,
    ninetyPercent,
    priorYearSafeHarbor,
    priorYearFactor,
    requiredAnnual,
    requiredRemaining,
    balanceDue,
    underThreshold,
    quarterlyFederal,
    quarterlyState,
    quarterlyTotal,
    effectiveRate,
  };
}
