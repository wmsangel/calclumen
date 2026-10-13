import { describe, expect, it } from "vitest";
import {
  isPrime,
  parseIsPrimeSlug,
  smallestFactor,
} from "@/lib/programmatic/isprime";

describe("isPrime and smallestFactor", () => {
  it("classifies small primes and composites", () => {
    expect(isPrime(2)).toBe(true);
    expect(isPrime(97)).toBe(true);
    expect(isPrime(91)).toBe(false);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(0)).toBe(false);
    expect(isPrime(-5)).toBe(false);
    expect(smallestFactor(91)).toBe(7);
    expect(smallestFactor(15)).toBe(3);
    expect(smallestFactor(49)).toBe(7);
    expect(smallestFactor(2)).toBe(2);
    expect(smallestFactor(97)).toBe(97);
    expect(smallestFactor(1)).toBe(1);
  });

  it("does not throw on NaN", () => {
    expect(() => isPrime(Number.NaN)).not.toThrow();
    expect(() => smallestFactor(Number.NaN)).not.toThrow();
  });
});

describe("parseIsPrimeSlug", () => {
  it("accepts known numbers and rejects junk", () => {
    expect(parseIsPrimeSlug("91")).toEqual({ n: 91, slug: "91" });
    expect(parseIsPrimeSlug("2")).toEqual({ n: 2, slug: "2" });
    expect(parseIsPrimeSlug("1")).toEqual({ n: 1, slug: "1" });
    expect(parseIsPrimeSlug("0")).toBeNull();
    expect(parseIsPrimeSlug("")).toBeNull();
    expect(parseIsPrimeSlug("91.0")).toBeNull();
    expect(parseIsPrimeSlug("abc")).toBeNull();
  });
});
