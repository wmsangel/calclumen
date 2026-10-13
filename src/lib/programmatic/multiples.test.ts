import { describe, expect, it } from "vitest";
import { multiplesOf, parseMultiplesSlug } from "@/lib/programmatic/multiples";

describe("multiplesOf", () => {
  it("returns the first count multiples", () => {
    expect(multiplesOf(7, 3)).toEqual([7, 14, 21]);
    expect(multiplesOf(6, 4)).toEqual([6, 12, 18, 24]);
    expect(multiplesOf(12, 5)).toEqual([12, 24, 36, 48, 60]);
  });

  it("handles a zero count and a zero base without throwing", () => {
    expect(multiplesOf(5, 0)).toEqual([]);
    expect(multiplesOf(0, 3)).toEqual([0, 0, 0]);
    expect(() => multiplesOf(Number.NaN, 2)).not.toThrow();
  });
});

describe("parseMultiplesSlug", () => {
  it("accepts published numbers and rejects junk", () => {
    expect(parseMultiplesSlug("12")).toEqual({ n: 12, slug: "12" });
    expect(parseMultiplesSlug("7")).toEqual({ n: 7, slug: "7" });
    expect(parseMultiplesSlug("1")).toBeNull();
    expect(parseMultiplesSlug("17")).toBeNull();
    expect(parseMultiplesSlug("0")).toBeNull();
    expect(parseMultiplesSlug("")).toBeNull();
    expect(parseMultiplesSlug("12.0")).toBeNull();
    expect(parseMultiplesSlug("abc")).toBeNull();
  });
});
