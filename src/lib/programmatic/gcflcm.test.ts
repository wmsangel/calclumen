import { describe, expect, it } from "vitest";
import {
  factorString,
  gcd,
  lcm,
  parseGcfLcmSlug,
  relatedPairs,
} from "@/lib/programmatic/gcflcm";

describe("gcd and lcm", () => {
  it("matches textbook pairs", () => {
    expect(gcd(12, 18)).toBe(6);
    expect(gcd(48, 18)).toBe(6);
    expect(gcd(17, 19)).toBe(1);
    expect(gcd(0, 5)).toBe(5);
    expect(gcd(5, 0)).toBe(5);
    expect(gcd(-12, 18)).toBe(6);
    expect(lcm(12, 18)).toBe(36);
    expect(lcm(7, 5)).toBe(35);
    expect(lcm(4, 6)).toBe(12);
  });

  it("returns zero when either argument is zero", () => {
    expect(lcm(0, 5)).toBe(0);
    expect(lcm(5, 0)).toBe(0);
    expect(lcm(0, 0)).toBe(0);
    expect(gcd(0, 0)).toBe(0);
  });

  it("does not throw on NaN", () => {
    expect(() => gcd(Number.NaN, 4)).not.toThrow();
    expect(() => lcm(Number.NaN, 4)).not.toThrow();
  });
});

describe("factorString and parseGcfLcmSlug", () => {
  it("writes prime powers with superscripts", () => {
    expect(factorString(12)).toBe("2² × 3");
    expect(factorString(8)).toBe("2³");
    expect(factorString(13)).toBe("13");
    expect(factorString(1)).toBe("1");
    expect(factorString(0)).toBe("0");
  });

  it("parses a known ordered pair and rejects junk", () => {
    expect(parseGcfLcmSlug("12-and-18")).toEqual({
      a: 12,
      b: 18,
      slug: "12-and-18",
    });
    const page = parseGcfLcmSlug("12-and-18");
    expect(page).not.toBeNull();
    if (page) {
      expect(relatedPairs(page).some((row) => row.slug === page.slug)).toBe(
        false,
      );
    }
    expect(parseGcfLcmSlug("18-and-12")).toBeNull();
    expect(parseGcfLcmSlug("")).toBeNull();
    expect(parseGcfLcmSlug("12-18")).toBeNull();
    expect(parseGcfLcmSlug("nope")).toBeNull();
  });
});
