import { describe, expect, it } from "vitest";
import {
  divisorsOf,
  factorizationString,
  factorize,
  factorPairs,
  groupNum,
  isPrime,
  parseFactorSlug,
} from "@/lib/programmatic/factors";

describe("factorize, divisors, and pairs", () => {
  it("factorises known composites and primes", () => {
    expect(factorize(12)).toEqual([
      [2, 2],
      [3, 1],
    ]);
    expect(factorize(100)).toEqual([
      [2, 2],
      [5, 2],
    ]);
    expect(factorize(97)).toEqual([[97, 1]]);
    expect(factorizationString(12)).toBe("2² × 3");
    expect(factorizationString(8)).toBe("2³");
    expect(factorizationString(97)).toBe("97");
  });

  it("lists divisors and factor pairs in order", () => {
    expect(divisorsOf(12)).toEqual([1, 2, 3, 4, 6, 12]);
    expect(divisorsOf(28)).toEqual([1, 2, 4, 7, 14, 28]);
    expect(divisorsOf(1)).toEqual([1]);
    expect(factorPairs(12)).toEqual([
      [1, 12],
      [2, 6],
      [3, 4],
    ]);
    expect(factorPairs(28)).toEqual([
      [1, 28],
      [2, 14],
      [4, 7],
    ]);
  });

  it("detects primes and groups thousands", () => {
    expect(isPrime(2)).toBe(true);
    expect(isPrime(97)).toBe(true);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(4)).toBe(false);
    expect(isPrime(9)).toBe(false);
    expect(groupNum(1024)).toBe("1,024");
    expect(groupNum(0)).toBe("0");
    expect(groupNum(12)).toBe("12");
  });

  it("does not throw on empty-ish numbers", () => {
    expect(divisorsOf(0)).toEqual([]);
    expect(() => factorize(Number.NaN)).not.toThrow();
    expect(() => isPrime(Number.NaN)).not.toThrow();
  });
});

describe("parseFactorSlug", () => {
  it("accepts known numbers and rejects the rest", () => {
    expect(parseFactorSlug("12")).toEqual({ n: 12, slug: "12" });
    expect(parseFactorSlug("1000")).toEqual({ n: 1000, slug: "1000" });
    expect(parseFactorSlug("1")).toBeNull();
    expect(parseFactorSlug("201")).toBeNull();
    expect(parseFactorSlug("")).toBeNull();
    expect(parseFactorSlug("12.5")).toBeNull();
    expect(parseFactorSlug("-12")).toBeNull();
    expect(parseFactorSlug("abc")).toBeNull();
  });
});
