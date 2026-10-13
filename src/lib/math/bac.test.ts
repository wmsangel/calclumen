import { describe, expect, it } from "vitest";
import { estimateBac, LEGAL, weightKgFromInput } from "@/lib/math/bac";

describe("estimateBac", () => {
  it("estimates about 0.053% for a 165 lb man, 3 drinks, 2 hours", () => {
    const weightKg = weightKgFromInput("lb", 165);
    const { bac, peak } = estimateBac("male", weightKg, 3, 2);
    expect(bac.toFixed(3)).toBe("0.053");
    expect(peak).toBeGreaterThan(bac);
    expect(bac).toBeLessThan(LEGAL);
  });

  it("is higher for the same person read as female, and floors at zero", () => {
    const weightKg = weightKgFromInput("lb", 165);
    const male = estimateBac("male", weightKg, 3, 2).bac;
    const female = estimateBac("female", weightKg, 3, 2).bac;
    expect(female).toBeGreaterThan(male);

    const sober = estimateBac("male", weightKg, 0, 2);
    expect(sober.bac).toBe(0);
    expect(sober.toLegal).toBe(0);

    const cleared = estimateBac("male", weightKg, 1, 100);
    expect(cleared.bac).toBe(0);
  });

  it("accepts a kilogram weight without converting it", () => {
    const kg = weightKgFromInput("kg", 75);
    expect(kg).toBe(75);
    expect(() => estimateBac("male", kg, 3, 2)).not.toThrow();
    expect(Number.isFinite(estimateBac("male", kg, 3, 2).bac)).toBe(true);
  });
});
