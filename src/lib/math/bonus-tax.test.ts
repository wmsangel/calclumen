import { describe, expect, it } from "vitest";
import { BONUS_TAX_2026, bonusTax } from "@/lib/math/bonus-tax";

describe("bonusTax (2026 percentage method)", () => {
  it("withholds 22% federal + FICA on a typical $5,000 bonus", () => {
    const r = bonusTax({ bonus: 5_000, ytdWages: 60_000, ytdSupplemental: 0, statePct: 0 });
    expect(r.federal).toBeCloseTo(1_100, 6); // 22%
    expect(r.socialSecurity).toBeCloseTo(310, 6); // 6.2%
    expect(r.medicare).toBeCloseTo(72.5, 6); // 1.45%
    expect(r.additionalMedicare).toBe(0);
    expect(r.state).toBe(0);
    expect(r.totalWithheld).toBeCloseTo(1_482.5, 6);
    expect(r.netBonus).toBeCloseTo(3_517.5, 6);
    expect(r.effectivePct).toBeCloseTo(29.65, 2);
  });

  it("adds a flat state rate", () => {
    const r = bonusTax({ bonus: 10_000, ytdWages: 50_000, ytdSupplemental: 0, statePct: 5 });
    expect(r.state).toBeCloseTo(500, 6);
    expect(r.totalWithheld).toBeCloseTo(2_200 + 620 + 145 + 500, 6);
  });

  it("stops Social Security once YTD wages pass the $184,500 wage base", () => {
    const base = BONUS_TAX_2026.socialSecurityWageBase;
    const over = bonusTax({ bonus: 20_000, ytdWages: base + 1, ytdSupplemental: 0, statePct: 0 });
    expect(over.socialSecurity).toBe(0);
    // Only the part of the bonus below the base is taxed.
    const straddle = bonusTax({ bonus: 20_000, ytdWages: base - 5_000, ytdSupplemental: 0, statePct: 0 });
    expect(straddle.socialSecurity).toBeCloseTo(5_000 * 0.062, 6);
  });

  it("applies the 0.9% Additional Medicare Tax above $200,000 YTD", () => {
    const r = bonusTax({ bonus: 50_000, ytdWages: 190_000, ytdSupplemental: 0, statePct: 0 });
    // $10k of the bonus is under the threshold, $40k over.
    expect(r.additionalMedicare).toBeCloseTo(40_000 * 0.009, 6);
    expect(r.medicare).toBeCloseTo(50_000 * 0.0145, 6);
    expect(r.socialSecurity).toBe(0); // already over the wage base
  });

  it("withholds 37% on supplemental wages above $1,000,000 in the year", () => {
    const r = bonusTax({ bonus: 300_000, ytdWages: 500_000, ytdSupplemental: 900_000, statePct: 0 });
    expect(r.bonusAbove1M).toBe(200_000);
    expect(r.federal).toBeCloseTo(100_000 * 0.22 + 200_000 * 0.37, 6);
  });

  it("handles an empty bonus", () => {
    const r = bonusTax({ bonus: 0, ytdWages: 0, ytdSupplemental: 0, statePct: 0 });
    expect(r.totalWithheld).toBe(0);
    expect(r.effectivePct).toBe(0);
  });
});
