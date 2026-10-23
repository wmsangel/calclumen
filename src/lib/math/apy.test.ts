import { describe, expect, it } from "vitest";
import { apy } from "@/lib/math/apy";

describe("apy", () => {
  it("5% compounded monthly ≈ 5.12% APY", () => {
    const r = apy(5, 12);
    expect(r.apyPct.toFixed(2)).toBe("5.12");
    expect(r.balance).toBe(0);
  });

  it("5% compounded daily ≈ 5.13% APY", () => {
    expect(apy(5, 365).apyPct.toFixed(2)).toBe("5.13");
  });

  it("annual compounding returns the nominal rate", () => {
    expect(apy(5, 1).apyPct).toBeCloseTo(5, 10);
  });

  it("grows a balance over time", () => {
    const r = apy(5, 12, 10_000, 1);
    expect(r.balance.toFixed(2)).toBe("10511.62");
    expect(r.interest.toFixed(2)).toBe("511.62");
  });

  it("treats periods below 1 as annual", () => {
    expect(apy(5, 0).apyPct).toBeCloseTo(5, 10);
  });
});
