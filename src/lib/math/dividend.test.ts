import { describe, expect, it } from "vitest";
import { dividend } from "@/lib/math/dividend";

describe("dividend", () => {
  it("computes year-1 income from yield", () => {
    const r = dividend(10_000, 4, 0, 1, false);
    expect(r.firstYearIncome.toFixed(2)).toBe("400.00");
    expect(r.firstYearMonthly.toFixed(2)).toBe("33.33");
    expect(r.totalDividends.toFixed(2)).toBe("400.00");
    expect(r.endingBalance).toBe(10_000); // no reinvest -> balance unchanged
  });

  it("DRIP reinvests dividends into the balance", () => {
    const r = dividend(10_000, 10, 0, 1, true);
    expect(r.endingBalance.toFixed(2)).toBe("11000.00");
    const flat = dividend(10_000, 10, 0, 5, false);
    const drip = dividend(10_000, 10, 0, 5, true);
    expect(drip.endingBalance).toBeGreaterThan(flat.endingBalance);
    expect(drip.totalDividends).toBeGreaterThan(flat.totalDividends);
  });

  it("grows the dividend each year when growth > 0", () => {
    const r = dividend(10_000, 4, 5, 3, false);
    // year 1: 400, year 2: 420, year 3: 441 -> final 441
    expect(r.finalAnnualIncome.toFixed(2)).toBe("441.00");
    expect(r.totalDividends.toFixed(2)).toBe("1261.00");
  });

  it("produces one balance point per year", () => {
    expect(dividend(5_000, 3, 0, 10, true).balances).toHaveLength(10);
  });
});
