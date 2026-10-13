import { describe, expect, it } from "vitest";
import { convert, RATES } from "@/lib/programmatic/rates";

describe("convert", () => {
  it("converts through the USD table for known currencies", () => {
    expect(RATES.USD).toBe(1);
    expect(convert(100, "USD", "EUR")).toBe(92);
    expect(convert(100, "USD", "GBP")).toBe(79);
    expect(convert(100, "USD", "JPY")).toBe(15_600);
    expect(convert(92, "EUR", "USD")).toBe(100);
    expect(convert(0, "EUR", "GBP")).toBe(0);
    expect(convert(50, "USD", "USD")).toBe(50);
  });

  it("does not throw on an unknown code, NaN, or an empty amount", () => {
    expect(Number.isNaN(convert(10, "XXX", "USD"))).toBe(true);
    expect(Number.isNaN(convert(10, "USD", "XXX"))).toBe(true);
    expect(Number.isNaN(convert(Number.NaN, "USD", "EUR"))).toBe(true);
    expect(() => convert(1, "", "USD")).not.toThrow();
    expect(() => convert(Number.NaN, "nope", "nope")).not.toThrow();
  });
});
