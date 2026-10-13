import { describe, expect, it } from "vitest";
import {
  fractionToDecimal,
  parseFracDecSlug,
} from "@/lib/programmatic/fracdec";

describe("fractionToDecimal", () => {
  it("writes terminating decimals exactly", () => {
    expect(fractionToDecimal(1, 2)).toEqual({
      decimal: "0.5",
      terminating: true,
      percent: "50",
    });
    expect(fractionToDecimal(3, 8)).toEqual({
      decimal: "0.375",
      terminating: true,
      percent: "37.5",
    });
    expect(fractionToDecimal(1, 4).terminating).toBe(true);
  });

  it("marks repeating decimals and keeps six places", () => {
    expect(fractionToDecimal(1, 3)).toEqual({
      decimal: "0.333333…",
      terminating: false,
      percent: "33.3333",
    });
    expect(fractionToDecimal(1, 6)).toMatchObject({
      decimal: "0.166667…",
      terminating: false,
    });
  });
});

describe("parseFracDecSlug", () => {
  it("accepts a published fraction and rejects junk", () => {
    expect(parseFracDecSlug("1-2")).toEqual({ a: 1, b: 2, slug: "1-2" });
    expect(parseFracDecSlug("3-8")).toEqual({ a: 3, b: 8, slug: "3-8" });
    expect(parseFracDecSlug("9-9")).toBeNull();
    expect(parseFracDecSlug("")).toBeNull();
    expect(parseFracDecSlug("1/2")).toBeNull();
    expect(parseFracDecSlug("abc")).toBeNull();
  });
});
