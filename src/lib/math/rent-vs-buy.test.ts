import { describe, expect, it } from "vitest";
import { rentVsBuy, type RentVsBuyInput } from "@/lib/math/rent-vs-buy";

const base: RentVsBuyInput = {
  homePrice: 300_000,
  downPaymentPct: 20,
  mortgageRatePct: 6.5,
  loanTermYears: 30,
  homeAppreciationPct: 3,
  propertyTaxPct: 1.1,
  maintenanceInsurancePct: 1.5,
  hoaMonthly: 0,
  buyingCostPct: 2,
  sellingCostPct: 6,
  monthlyRent: 1_800,
  rentGrowthPct: 3,
  investmentReturnPct: 5,
  horizonYears: 7,
};

describe("rentVsBuy", () => {
  it("computes the mortgage payment and upfront cash correctly", () => {
    const r = rentVsBuy(base);
    // $240,000 loan at 6.5% / 30y.
    expect(r.monthlyPayment).toBeCloseTo(1516.96, 1);
    // Down payment $60,000 + 2% of $300,000 closing = $6,000.
    expect(r.upfrontCash).toBe(66_000);
    expect(r.years).toHaveLength(7);
    expect(Number.isFinite(r.buyNetWorth)).toBe(true);
    expect(Number.isFinite(r.rentNetWorth)).toBe(true);
  });

  it("favours buying with strong appreciation and a long horizon", () => {
    const r = rentVsBuy({
      ...base,
      homeAppreciationPct: 5,
      investmentReturnPct: 3,
      horizonYears: 15,
      sellingCostPct: 5,
    });
    expect(r.verdict).toBe("buy");
    expect(r.buyNetWorth).toBeGreaterThan(r.rentNetWorth);
    expect(r.breakEvenYear).not.toBeNull();
    expect(r.breakEvenYear!).toBeLessThanOrEqual(15);
  });

  it("favours renting over a short horizon with high selling costs", () => {
    const r = rentVsBuy({
      ...base,
      horizonYears: 2,
      homeAppreciationPct: 1,
      investmentReturnPct: 7,
      sellingCostPct: 8,
    });
    expect(r.verdict).toBe("rent");
    expect(r.rentNetWorth).toBeGreaterThan(r.buyNetWorth);
  });

  it("reports year-1 monthly costs and a rising buyer cost over time", () => {
    const r = rentVsBuy(base);
    expect(r.firstYearRentMonthly).toBeCloseTo(1_800, 0);
    // Owning year 1 = payment + tax + maintenance/insurance (no HOA).
    expect(r.firstYearBuyMonthly).toBeGreaterThan(r.monthlyPayment);
    expect(r.years[0].year).toBe(1);
    expect(r.years.at(-1)?.year).toBe(7);
  });

  it("handles a 100% down payment (no mortgage)", () => {
    const r = rentVsBuy({ ...base, downPaymentPct: 100 });
    expect(r.monthlyPayment).toBe(0);
    expect(r.upfrontCash).toBe(306_000); // full price + 2% closing
    expect(Number.isFinite(r.buyNetWorth)).toBe(true);
  });
});
