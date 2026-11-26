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
 * W-2 employee vs 1099 contractor, tax year 2026: what each arrangement
 * leaves in your pocket after federal income tax, payroll/self-employment
 * tax, a flat state rate and the benefits an employer would otherwise pay.
 *
 * W-2: employee FICA 7.65% (6.2% SS up to the wage base + 1.45% Medicare),
 * Additional Medicare 0.9% above the threshold, income tax on wages minus the
 * standard deduction (and minus a pre-tax 401(k) contribution if entered);
 * employer-paid benefits (health premium share, 401(k) match, paid time off)
 * are added as value received.
 * 1099: net profit = gross − business expenses; SE tax on 92.35% of profit
 * (12.4% SS up to the base + 2.9% Medicare), half deductible; QBI deduction
 * 20% of (profit − SE deduction) capped at 20% of taxable income; self-paid
 * health insurance is an above-the-line deduction; retirement contribution
 * deductible; no PTO. The break-even 1099 rate is the gross 1099 income that
 * leaves the same take-home as the W-2 package (bisection).
 */
export interface W2Vs1099Input {
  filing: Filing;
  /** W-2 annual salary. */
  w2Salary: number;
  /** Employer-paid share of health premiums per year (W-2 side). */
  employerHealth: number;
  /** Employer 401(k) match per year (W-2 side). */
  employerMatch: number;
  /** Paid days off per year (vacation + holidays + sick) valued at salary/260. */
  paidDaysOff: number;
  /** Employee pre-tax 401(k) deferral per year (W-2 side). */
  w2Retirement: number;
  /** 1099 gross income per year. */
  gross1099: number;
  /** Deductible business expenses per year (1099 side). */
  businessExpenses: number;
  /** Self-paid health insurance premiums per year (1099 side). */
  selfHealth: number;
  /** Self-funded retirement contribution per year (SEP/Solo 401k), deductible. */
  selfRetirement: number;
  applyQbi: boolean;
  /** Flat state income tax, percent (applied to federal taxable income). */
  statePct: number;
}

export interface SideResult {
  gross: number;
  payrollTax: number;
  incomeTax: number;
  stateTax: number;
  additionalMedicare: number;
  taxable: number;
  takeHome: number;
  /** take-home + benefits value (W-2) / take-home (1099). */
  totalValue: number;
  benefitsValue: number;
  effectiveRate: number;
}

export interface W2Vs1099Result {
  w2: SideResult;
  c1099: SideResult;
  /** c1099.totalValue − w2.totalValue (positive → 1099 ahead). */
  difference: number;
  /** 1099 gross needed to match the W-2 total value. */
  breakEven1099: number;
  /** breakEven1099 ÷ w2Salary. */
  breakEvenMultiple: number;
}

function w2Side(i: W2Vs1099Input): SideResult {
  const salary = Math.max(0, i.w2Salary);
  const ss = Math.min(salary, SOCIAL_SECURITY_WAGE_BASE) * 0.062;
  const medicare = salary * 0.0145;
  const addl = Math.max(0, salary - ADDITIONAL_MEDICARE_THRESHOLD[i.filing]) * ADDITIONAL_MEDICARE_RATE;
  const retirement = Math.min(Math.max(0, i.w2Retirement), salary);
  const taxable = Math.max(0, salary - retirement - STANDARD_DEDUCTION[i.filing]);
  const { tax } = federalIncomeTax(taxable, i.filing);
  const state = (Math.max(0, i.statePct) / 100) * taxable;
  const payroll = ss + medicare;
  const takeHome = salary - retirement - payroll - addl - tax - state;
  const pto = (salary / 260) * Math.max(0, i.paidDaysOff);
  const benefits = Math.max(0, i.employerHealth) + Math.max(0, i.employerMatch) + pto;
  return {
    gross: salary,
    payrollTax: payroll,
    incomeTax: tax,
    stateTax: state,
    additionalMedicare: addl,
    taxable,
    takeHome,
    benefitsValue: benefits,
    totalValue: takeHome + retirement + benefits,
    effectiveRate: salary > 0 ? (payroll + addl + tax + state) / salary : 0,
  };
}

function side1099(i: W2Vs1099Input, gross: number): SideResult {
  const g = Math.max(0, gross);
  const profit = Math.max(0, g - Math.max(0, i.businessExpenses));
  const seEarnings = profit * SE_NET_EARNINGS_FACTOR;
  const seTax =
    Math.min(seEarnings, SOCIAL_SECURITY_WAGE_BASE) * SE_SOCIAL_SECURITY_RATE + seEarnings * SE_MEDICARE_RATE;
  const seDeduction = seTax / 2;
  const addl = Math.max(0, seEarnings - ADDITIONAL_MEDICARE_THRESHOLD[i.filing]) * ADDITIONAL_MEDICARE_RATE;
  const health = Math.min(Math.max(0, i.selfHealth), profit);
  const retirement = Math.min(Math.max(0, i.selfRetirement), profit);
  const agi = Math.max(0, profit - seDeduction - health - retirement);
  const taxableBeforeQbi = Math.max(0, agi - STANDARD_DEDUCTION[i.filing]);
  const qbi = i.applyQbi ? Math.min(0.2 * Math.max(0, profit - seDeduction - health - retirement), 0.2 * taxableBeforeQbi) : 0;
  const taxable = Math.max(0, taxableBeforeQbi - qbi);
  const { tax } = federalIncomeTax(taxable, i.filing);
  const state = (Math.max(0, i.statePct) / 100) * taxable;
  // Take-home = profit minus taxes minus what you had to buy yourself (health);
  // the retirement contribution is still your money, so it counts in total value.
  const takeHome = profit - seTax - addl - tax - state - health - retirement;
  return {
    gross: g,
    payrollTax: seTax,
    incomeTax: tax,
    stateTax: state,
    additionalMedicare: addl,
    taxable,
    takeHome,
    benefitsValue: 0,
    totalValue: takeHome + retirement,
    effectiveRate: profit > 0 ? (seTax + addl + tax + state) / profit : 0,
  };
}

export function w2Vs1099(i: W2Vs1099Input): W2Vs1099Result {
  const w2 = w2Side(i);
  const c1099 = side1099(i, i.gross1099);
  // Bisection for the 1099 gross that matches the W-2 total value.
  let lo = 0;
  let hi = Math.max(10_000, w2.totalValue * 3 + Math.max(0, i.businessExpenses) + Math.max(0, i.selfHealth) + 50_000);
  for (let k = 0; k < 60; k++) {
    const mid = (lo + hi) / 2;
    if (side1099(i, mid).totalValue < w2.totalValue) lo = mid;
    else hi = mid;
  }
  const breakEven1099 = (lo + hi) / 2;
  return {
    w2,
    c1099,
    difference: c1099.totalValue - w2.totalValue,
    breakEven1099,
    breakEvenMultiple: i.w2Salary > 0 ? breakEven1099 / i.w2Salary : 0,
  };
}
