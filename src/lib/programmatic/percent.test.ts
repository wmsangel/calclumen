import { describe, expect, it } from "vitest";
import {
  isKnownPercentPage,
  parsePercentSlug,
} from "@/lib/programmatic/percent";

describe("percent pages", () => {
  it("recognises pairs that are in the generated set", () => {
    expect(isKnownPercentPage(25, 80)).toBe(true);
    expect(isKnownPercentPage(15, 200)).toBe(true);
    expect(isKnownPercentPage(1, 10)).toBe(true);
    expect(parsePercentSlug("25-percent-of-80")).toEqual({ a: 25, b: 80 });
    expect(parsePercentSlug("15-percent-of-200")).toEqual({ a: 15, b: 200 });
  });

  it("parses a well-formed slug even when the pair is not published", () => {
    expect(isKnownPercentPage(7, 80)).toBe(false);
    expect(isKnownPercentPage(25, 81)).toBe(false);
    expect(isKnownPercentPage(0, 0)).toBe(false);
    expect(parsePercentSlug("7-percent-of-80")).toEqual({ a: 7, b: 80 });
  });

  it("returns null for empty and malformed slugs", () => {
    expect(parsePercentSlug("")).toBeNull();
    expect(parsePercentSlug("25-percent-of")).toBeNull();
    expect(parsePercentSlug("percent")).toBeNull();
    expect(parsePercentSlug("25-percent-of-80-extra")).toBeNull();
    expect(() => parsePercentSlug("@@@")).not.toThrow();
  });
});
