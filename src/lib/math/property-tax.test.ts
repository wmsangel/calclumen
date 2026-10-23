import { describe, expect, it } from "vitest";
import { propertyTax } from "@/lib/math/property-tax";

describe("propertyTax", () => {
  it("computes tax at 100% assessment with no exemptions (default)", () => {
    const r = propertyTax(350_000, 100, 1.1, 0);
    expect(r.assessed).toBe(350_000);
    expect(r.taxable).toBe(350_000);
    expect(r.annual.toFixed(2)).toBe("3850.00");
    expect(r.monthly.toFixed(2)).toBe("320.83");
    expect(r.effectiveRatePct.toFixed(2)).toBe("1.10");
  });

  it("applies the assessment ratio and a homestead exemption", () => {
    // $400k home assessed at 80% = $320k; minus $50k exemption = $270k taxable.
    const r = propertyTax(400_000, 80, 1.25, 50_000);
    expect(r.assessed).toBe(320_000);
    expect(r.taxable).toBe(270_000);
    expect(r.annual.toFixed(2)).toBe("3375.00");
    // effective rate is against market value, so below the nominal 1.25%.
    expect(r.effectiveRatePct.toFixed(4)).toBe("0.8438");
  });

  it("never returns negative taxable value when exemptions exceed assessed", () => {
    const r = propertyTax(100_000, 50, 1, 80_000);
    expect(r.assessed).toBe(50_000);
    expect(r.taxable).toBe(0);
    expect(r.annual).toBe(0);
  });

  it("guards a zero market value", () => {
    const r = propertyTax(0, 100, 1.1, 0);
    expect(r.annual).toBe(0);
    expect(r.effectiveRatePct).toBe(0);
  });
});
