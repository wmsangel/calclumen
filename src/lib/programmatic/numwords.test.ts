import { describe, expect, it } from "vitest";
import {
  integerToWords,
  parseNumWordsSlug,
  titleCaseWords,
} from "@/lib/programmatic/numwords";

describe("integerToWords", () => {
  it("spells small and scaled integers", () => {
    expect(integerToWords(0)).toBe("zero");
    expect(integerToWords(13)).toBe("thirteen");
    expect(integerToWords(21)).toBe("twenty-one");
    expect(integerToWords(101)).toBe("one hundred one");
    expect(integerToWords(1234)).toBe("one thousand two hundred thirty-four");
    expect(integerToWords(1_000_000)).toBe("one million");
    expect(integerToWords(1_000_000_000)).toBe("one billion");
  });

  it("title-cases each word", () => {
    expect(titleCaseWords("one thousand")).toBe("One Thousand");
    expect(titleCaseWords(integerToWords(101))).toBe("One Hundred One");
    expect(titleCaseWords("")).toBe("");
  });

  it("does not throw on negative or NaN input", () => {
    expect(() => integerToWords(-5)).not.toThrow();
    expect(() => integerToWords(Number.NaN)).not.toThrow();
    expect(integerToWords(-5)).toBe("");
  });
});

describe("parseNumWordsSlug", () => {
  it("accepts published numbers and rejects the rest", () => {
    expect(parseNumWordsSlug("1234")).toEqual({ n: 1234, slug: "1234" });
    expect(parseNumWordsSlug("1000")).toEqual({ n: 1000, slug: "1000" });
    expect(parseNumWordsSlug("1")).toBeNull();
    expect(parseNumWordsSlug("0")).toBeNull();
    expect(parseNumWordsSlug("")).toBeNull();
    expect(parseNumWordsSlug("abc")).toBeNull();
  });
});
