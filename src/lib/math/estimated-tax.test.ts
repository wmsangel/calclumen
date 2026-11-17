import { describe, expect, it } from "vitest";
import { estimatedTax } from "./estimated-tax";
import { federalIncomeTax } from "./federal-tax-2026";

const base = {
  filing: "single" as const,
  netSelfEmployment: 80_000,
  w2Wages: 0,
  otherIncome: 0,
  federalWithholding: 0,
  priorYearTax: 0,
  priorYearAgiOver150k: false,
  statePct: 0,
  applyQbi: false,
  paymentsMade: 0,
};

describe("federalIncomeTax 2026", () => {
  it("applies the 2026 single brackets progressively", () => {
    // 10% × 12,400 + 12% × 38,000 + 22% × 7,848.18
    const { tax, marginal } = federalIncomeTax(58_248.18, "single");
    expect(tax).toBeCloseTo(1_240 + 4_560 + 1_726.5996, 2);
    expect(marginal).toBe(0.22);
  });
});

describe("estimatedTax (1040-ES, 2026)", () => {
  it("hand-worked example: $80k net profit, single, no withholding", () => {
    const r = estimatedTax(base);
    expect(r.seEarnings).toBeCloseTo(73_880, 2);
    expect(r.seTax).toBeCloseTo(11_303.64, 2); // 73,880 × 15.3%
    expect(r.seDeduction).toBeCloseTo(5_651.82, 2);
    expect(r.agi).toBeCloseTo(74_348.18, 2);
    expect(r.taxable).toBeCloseTo(58_248.18, 2); // AGI − 16,100
    expect(r.incomeTax).toBeCloseTo(7_526.6, 2);
    expect(r.federalTotal).toBeCloseTo(18_830.24, 2);
    expect(r.requiredAnnual).toBeCloseTo(0.9 * 18_830.24, 2);
    expect(r.quarterlyFederal).toBeCloseTo((0.9 * 18_830.24) / 4, 2);
    expect(r.underThreshold).toBe(false);
  });

  it("uses the smaller of 90% current and 100% prior-year tax", () => {
    const r = estimatedTax({ ...base, priorYearTax: 12_000 });
    expect(r.priorYearSafeHarbor).toBe(12_000);
    expect(r.requiredAnnual).toBe(12_000);
    expect(r.quarterlyFederal).toBe(3_000);
  });

  it("switches to 110% when prior-year AGI exceeded $150k", () => {
    const r = estimatedTax({ ...base, priorYearTax: 12_000, priorYearAgiOver150k: true });
    expect(r.priorYearSafeHarbor).toBeCloseTo(13_200, 6);
    expect(r.requiredAnnual).toBeCloseTo(13_200, 6);
  });

  it("requires no payments when the balance after withholding is under $1,000", () => {
    const r = estimatedTax({ ...base, federalWithholding: 18_000 });
    expect(r.balanceDue).toBeCloseTo(830.24, 2);
    expect(r.underThreshold).toBe(true);
    expect(r.quarterlyFederal).toBe(0);
  });

  it("W-2 wages use up the Social Security wage base before SE earnings", () => {
    const r = estimatedTax({ ...base, netSelfEmployment: 50_000, w2Wages: 170_000 });
    // room left in the base: 184,500 − 170,000 = 14,500
    expect(r.socialSecurityTax).toBeCloseTo(14_500 * 0.124, 2);
    expect(r.medicareTax).toBeCloseTo(50_000 * 0.9235 * 0.029, 2);
    // additional Medicare on wages + SE earnings above $200k
    expect(r.additionalMedicare).toBeCloseTo((170_000 + 46_175 - 200_000) * 0.009, 2);
  });

  it("QBI deduction is 20% of (profit − SE deduction), capped at 20% of taxable income", () => {
    const r = estimatedTax({ ...base, applyQbi: true });
    expect(r.qbiDeduction).toBeCloseTo(Math.min(0.2 * (80_000 - 5_651.82), 0.2 * 58_248.18), 2);
    expect(r.taxable).toBeCloseTo(58_248.18 - r.qbiDeduction, 2);
  });

  it("subtracts payments already made and splits state tax evenly", () => {
    const r = estimatedTax({ ...base, statePct: 5, paymentsMade: 4_000 });
    expect(r.stateTax).toBeCloseTo(0.05 * 58_248.18, 2);
    expect(r.requiredRemaining).toBeCloseTo(0.9 * 18_830.24 - 4_000, 2);
    expect(r.quarterlyTotal).toBeCloseTo(r.quarterlyFederal + r.stateTax / 4, 6);
  });
});
