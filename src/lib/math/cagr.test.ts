import { describe, expect, it } from "vitest";
import { cagr } from "@/lib/math/cagr";

describe("cagr", () => {
  it("computes a doubling over 10 years (~7.18%)", () => {
    const r = cagr(10_000, 20_000, 10);
    expect(r.cagrPct.toFixed(2)).toBe("7.18");
    expect(r.totalReturnPct).toBe(100);
    expect(r.gain).toBe(10_000);
    expect(r.path).toHaveLength(11);
    expect(r.path.at(-1)).toBeCloseTo(20_000, 6);
  });

  it("handles the default 1000 -> 2600 over 5 years", () => {
    const r = cagr(1_000, 2_600, 5);
    expect(r.cagrPct.toFixed(2)).toBe("21.06");
    expect(r.totalReturnPct).toBe(160);
    expect(r.gain).toBe(1_600);
  });

  it("returns a negative CAGR for a loss", () => {
    const r = cagr(1_000, 500, 4);
    expect(r.cagrPct).toBeLessThan(0);
    expect(r.cagrPct.toFixed(2)).toBe("-15.91");
  });

  it("appends the exact endpoint for fractional years", () => {
    const r = cagr(1_000, 1_500, 2.5);
    // whole years 0,1,2 + exact endpoint = 4 points
    expect(r.path).toHaveLength(4);
    expect(r.path.at(-1)).toBeCloseTo(1_500, 6);
  });

  it("guards invalid inputs", () => {
    expect(Number.isNaN(cagr(0, 100, 5).cagrPct)).toBe(true);
    expect(Number.isNaN(cagr(100, 200, 0).cagrPct)).toBe(true);
  });
});
