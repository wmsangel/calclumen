import { describe, expect, it } from "vitest";
import { monthlyPI } from "@/lib/math/rental-property";

describe("monthlyPI", () => {
  it("matches the fully amortizing payment for $240,000 at 7% over 30 years", () => {
    expect(monthlyPI(240_000, 7, 30).toFixed(2)).toBe("1596.73");
  });

  it("spreads a 0% loan evenly and returns 0 when there is no loan", () => {
    expect(monthlyPI(120_000, 0, 10)).toBe(1_000);
    expect(monthlyPI(0, 7, 30)).toBe(0);
    expect(monthlyPI(-50_000, 7, 30)).toBe(0);
    expect(monthlyPI(100_000, 7, 0)).toBe(0);
  });
});
