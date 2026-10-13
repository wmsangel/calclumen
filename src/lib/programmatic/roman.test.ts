import { describe, expect, it } from "vitest";
import {
  parseRomanSlug,
  romanBreakdown,
  toRoman,
} from "@/lib/programmatic/roman";

describe("toRoman", () => {
  it("uses subtractive notation for known values", () => {
    expect(toRoman(1)).toBe("I");
    expect(toRoman(4)).toBe("IV");
    expect(toRoman(9)).toBe("IX");
    expect(toRoman(49)).toBe("XLIX");
    expect(toRoman(1994)).toBe("MCMXCIV");
    expect(toRoman(2024)).toBe("MMXXIV");
    expect(toRoman(3999)).toBe("MMMCMXCIX");
  });

  it("returns an empty string outside 1..3999 and for non-integers", () => {
    expect(toRoman(0)).toBe("");
    expect(toRoman(-3)).toBe("");
    expect(toRoman(4000)).toBe("");
    expect(toRoman(1.5)).toBe("");
    expect(toRoman(Number.NaN)).toBe("");
  });
});

describe("romanBreakdown and parseRomanSlug", () => {
  it("splits 49 into its additive pieces", () => {
    expect(romanBreakdown(49)).toEqual([
      { value: 40, sym: "XL" },
      { value: 9, sym: "IX" },
    ]);
    expect(romanBreakdown(2024).map((part) => part.sym).join("")).toBe("MMXXIV");
  });

  it("parses a known roman page and rejects junk", () => {
    expect(parseRomanSlug("49-in-roman-numerals")).toEqual({
      value: 49,
      roman: "XLIX",
      slug: "49-in-roman-numerals",
    });
    expect(parseRomanSlug("2024-in-roman-numerals")?.roman).toBe("MMXXIV");
    expect(parseRomanSlug("4000-in-roman-numerals")).toBeNull();
    expect(parseRomanSlug("")).toBeNull();
    expect(parseRomanSlug("XLIX")).toBeNull();
    expect(parseRomanSlug("49")).toBeNull();
  });
});
