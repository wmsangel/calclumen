import { describe, expect, it } from "vitest";
import { balanceAt } from "@/lib/math/compound-interest";

describe("balanceAt", () => {
  it("compounds $10,000 at 7% monthly for 10 years with no contributions", () => {
    expect(balanceAt(10_000, 7, 10, 12, 0).toFixed(2)).toBe("20096.61");
  });

  it("adds monthly contributions on top of that growth", () => {
    expect(balanceAt(10_000, 7, 10, 12, 200).toFixed(2)).toBe("54713.58");
  });

  it("compounds annually for a single year", () => {
    expect(balanceAt(5_000, 5, 1, 1, 0)).toBe(5_250);
  });

  it("keeps principal and sums contributions when the rate is 0%", () => {
    expect(balanceAt(10_000, 0, 10, 12, 0)).toBe(10_000);
    expect(balanceAt(0, 0, 5, 12, 100)).toBe(6_000);
    expect(balanceAt(10_000, 7, 0, 12, 200)).toBe(10_000);
  });
});
