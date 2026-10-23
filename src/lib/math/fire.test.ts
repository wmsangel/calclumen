import { describe, expect, it } from "vitest";
import { fire } from "@/lib/math/fire";

describe("fire", () => {
  it("computes the FIRE number from expenses and SWR", () => {
    expect(fire(40_000, 0, 0, 7, 4).fireNumber).toBe(1_000_000);
    expect(fire(50_000, 0, 0, 7, 5).fireNumber).toBe(1_000_000);
  });

  it("flags someone already financially independent", () => {
    const r = fire(40_000, 1_200_000, 0, 7, 4);
    expect(r.alreadyFi).toBe(true);
    expect(r.yearsToFi).toBe(0);
  });

  it("counts years to FI deterministically with 0% return", () => {
    // fireNumber = 1000 / 0.04 = 25,000; +10k/yr from 0 -> year 3 hits 30k.
    const r = fire(1_000, 0, 10_000, 0, 4);
    expect(r.fireNumber).toBe(25_000);
    expect(r.yearsToFi).toBe(3);
    expect(r.balances).toEqual([0, 10_000, 20_000, 30_000]);
  });

  it("returns null when FI is unreachable within the cap", () => {
    const r = fire(40_000, 1_000, 0, 0, 4);
    expect(r.yearsToFi).toBeNull();
  });
});
