import { describe, expect, it } from "vitest";
import { w2Vs1099 } from "./w2-vs-1099";

const base = {
  filing: "single" as const,
  w2Salary: 90_000,
  employerHealth: 7_000,
  employerMatch: 3_600,
  paidDaysOff: 25,
  w2Retirement: 0,
  gross1099: 110_000,
  businessExpenses: 5_000,
  selfHealth: 8_400,
  selfRetirement: 0,
  applyQbi: true,
  statePct: 0,
};

describe("w2Vs1099 (2026)", () => {
  it("W-2 side: FICA 7.65%, standard deduction, 2026 brackets, benefits valued", () => {
    const r = w2Vs1099(base).w2;
    expect(r.payrollTax).toBeCloseTo(90_000 * 0.0765, 2);
    expect(r.taxable).toBe(90_000 - 16_100);
    // 10%×12,400 + 12%×38,000 + 22%×(73,900−50,400)
    expect(r.incomeTax).toBeCloseTo(1_240 + 4_560 + 0.22 * 23_500, 2);
    expect(r.benefitsValue).toBeCloseTo(7_000 + 3_600 + (90_000 / 260) * 25, 2);
    expect(r.takeHome).toBeCloseTo(90_000 - r.payrollTax - r.incomeTax, 2);
  });

  it("1099 side: SE tax on 92.35% of profit, half deductible, health + QBI deducted", () => {
    const r = w2Vs1099(base).c1099;
    const profit = 105_000;
    const se = profit * 0.9235 * 0.153;
    expect(r.payrollTax).toBeCloseTo(se, 2);
    const agi = profit - se / 2 - 8_400;
    const tbq = agi - 16_100;
    const qbi = Math.min(0.2 * (profit - se / 2 - 8_400), 0.2 * tbq);
    expect(r.taxable).toBeCloseTo(tbq - qbi, 2);
    expect(r.takeHome).toBeCloseTo(profit - se - r.incomeTax - 8_400, 2);
  });

  it("break-even 1099 rate reproduces the W-2 total value", () => {
    const r = w2Vs1099(base);
    const check = w2Vs1099({ ...base, gross1099: r.breakEven1099 });
    expect(check.c1099.totalValue).toBeCloseTo(r.w2.totalValue, 0);
    // With $7k health, $3.6k match and 25 days PTO (≈$19k of benefits) plus the
    // employer half of FICA and self-paid health, 1099 needs ≈1.5× the salary.
    expect(r.breakEvenMultiple).toBeGreaterThan(1.3);
    expect(r.breakEvenMultiple).toBeLessThan(1.7);
  });

  it("difference sign flips around the break-even point", () => {
    const r = w2Vs1099(base);
    expect(w2Vs1099({ ...base, gross1099: r.breakEven1099 - 5_000 }).difference).toBeLessThan(0);
    expect(w2Vs1099({ ...base, gross1099: r.breakEven1099 + 5_000 }).difference).toBeGreaterThan(0);
  });

  it("additional Medicare applies above $200k on both sides", () => {
    const w2 = w2Vs1099({ ...base, w2Salary: 250_000 }).w2;
    expect(w2.additionalMedicare).toBeCloseTo(50_000 * 0.009, 2);
    const c = w2Vs1099({ ...base, gross1099: 300_000, businessExpenses: 0 }).c1099;
    expect(c.additionalMedicare).toBeCloseTo((300_000 * 0.9235 - 200_000) * 0.009, 2);
  });

  it("pre-tax 401(k) on W-2 lowers income tax but stays in total value", () => {
    const a = w2Vs1099(base).w2;
    const b = w2Vs1099({ ...base, w2Retirement: 10_000 }).w2;
    expect(b.incomeTax).toBeLessThan(a.incomeTax);
    expect(b.totalValue).toBeGreaterThan(a.totalValue);
  });
});
