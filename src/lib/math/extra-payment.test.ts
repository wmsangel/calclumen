import { describe, expect, it } from "vitest";
import { extraPayment, scheduledPayment } from "./extra-payment";

const base = {
  balance: 300_000,
  annualRatePct: 6.5,
  termMonths: 360,
  extraMonthly: 0,
  extraYearly: 0,
  extraYearlyMonth: 12,
  oneTime: 0,
  oneTimeMonth: 1,
};

describe("extraPayment", () => {
  it("scheduled payment matches the standard amortization formula", () => {
    // $300k, 6.5%, 30y → $1,896.20 (widely published figure)
    expect(scheduledPayment(300_000, 6.5, 360)).toBeCloseTo(1896.2, 1);
  });

  it("with no extra payments both paths are identical and run the full term", () => {
    const r = extraPayment(base);
    expect(r.base.months).toBe(360);
    expect(r.withExtra.months).toBe(360);
    expect(r.interestSaved).toBeCloseTo(0, 6);
    expect(r.base.totalInterest).toBeCloseTo(1896.2040704788958 * 360 - 300_000, 2);
  });

  it("$200 extra per month on $300k at 6.5% saves years and six-figure interest", () => {
    const r = extraPayment({ ...base, extraMonthly: 200 });
    // Standard amortization: $300k / 6.5% / 30y + $200/mo pays off in 277 months
    // (23 years 1 month), saving about $103k of interest.
    expect(r.withExtra.months).toBe(277);
    expect(r.monthsSaved).toBe(360 - r.withExtra.months);
    expect(r.interestSaved).toBeCloseTo(103_448.79, 0);
    // last payment is partial, so total extra is a little under 277 × $200
    expect(r.totalExtraPaid).toBeGreaterThan(200 * (r.withExtra.months - 8));
    expect(r.totalExtraPaid).toBeLessThanOrEqual(200 * r.withExtra.months);
  });

  it("a one-time lump sum early saves more than the same sum late", () => {
    const early = extraPayment({ ...base, oneTime: 20_000, oneTimeMonth: 1 });
    const late = extraPayment({ ...base, oneTime: 20_000, oneTimeMonth: 240 });
    expect(early.interestSaved).toBeGreaterThan(late.interestSaved);
    expect(early.monthsSaved).toBeGreaterThan(late.monthsSaved);
  });

  it("yearly lump sum is applied in the chosen month each year", () => {
    const r = extraPayment({ ...base, extraYearly: 2_400, extraYearlyMonth: 3 });
    const m = extraPayment({ ...base, extraMonthly: 200 });
    // 12 × $200 = $2,400 spread monthly beats the same $2,400 paid once in March
    // only slightly; both must save interest and months.
    expect(r.interestSaved).toBeGreaterThan(50_000);
    expect(m.interestSaved).toBeGreaterThan(r.interestSaved * 0.9);
  });

  it("0% loans amortize linearly without division by zero", () => {
    const r = extraPayment({ ...base, balance: 12_000, annualRatePct: 0, termMonths: 12, extraMonthly: 1_000 });
    expect(r.scheduledPayment).toBe(1_000);
    expect(r.withExtra.months).toBe(6);
    expect(r.interestSaved).toBe(0);
  });
});
