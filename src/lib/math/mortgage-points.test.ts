import { describe, expect, it } from "vitest";
import { monthlyPayment, mortgagePoints } from "@/lib/math/mortgage-points";

describe("mortgagePoints", () => {
  const base = {
    loanAmount: 400_000,
    termYears: 30,
    baseRatePct: 6.5,
    pointsRatePct: 6.0,
    points: 2,
    yearsKept: 7,
  };

  it("prices both payments and the cost of points", () => {
    const r = mortgagePoints(base);
    expect(r.pointsCost).toBe(8_000);
    expect(r.paymentBase).toBeCloseTo(2_528.27, 1); // $400k @6.5% 30y
    expect(r.paymentWithPoints).toBeCloseTo(2_398.20, 1); // $400k @6.0% 30y
    expect(r.monthlySavings).toBeCloseTo(130.07, 1);
  });

  it("finds the break-even month and the result for the years kept", () => {
    const r = mortgagePoints(base);
    expect(r.breakEvenMonths).toBe(Math.ceil(8_000 / r.monthlySavings)); // 62
    expect(r.breakEvenMonths).toBe(62);
    // Kept 7 years = 84 months > 62 → ahead.
    expect(r.netAfterYearsKept).toBeCloseTo(r.monthlySavings * 84 - 8_000, 6);
    expect(r.netAfterYearsKept).toBeGreaterThan(0);
    // Kept 4 years = 48 months < 62 → behind.
    expect(mortgagePoints({ ...base, yearsKept: 4 }).netAfterYearsKept).toBeLessThan(0);
  });

  it("reports interest and net benefit over the full term", () => {
    const r = mortgagePoints(base);
    expect(r.interestBase).toBeGreaterThan(r.interestWithPoints);
    expect(r.netOverFullTerm).toBeCloseTo(r.interestBase - r.interestWithPoints - 8_000, 6);
  });

  it("has no break-even when points do not lower the rate", () => {
    const r = mortgagePoints({ ...base, pointsRatePct: 6.5 });
    expect(r.monthlySavings).toBe(0);
    expect(r.breakEvenMonths).toBeNull();
    expect(r.netAfterYearsKept).toBe(-8_000);
  });

  it("monthlyPayment handles a 0% rate", () => {
    expect(monthlyPayment(120_000, 0, 10)).toBe(1_000);
  });
});
