import { describe, expect, it } from "vitest";
import {
  equivalents,
  parseSimplifySlug,
  simplify,
} from "@/lib/programmatic/simplify";

describe("simplify", () => {
  it("reduces fractions by their greatest common factor", () => {
    expect(simplify(4, 8)).toEqual({
      g: 4,
      na: 1,
      nb: 2,
      decimal: "0.5",
      percent: "50",
    });
    expect(simplify(3, 9)).toMatchObject({ g: 3, na: 1, nb: 3 });
    expect(simplify(8, 12)).toMatchObject({
      g: 4,
      na: 2,
      nb: 3,
      decimal: "0.666667",
      percent: "66.6667",
    });
  });

  it("lists equivalent fractions scaled up from the simplest form", () => {
    expect(equivalents(1, 2)).toEqual(["2/4", "3/6", "4/8"]);
    expect(equivalents(1, 2, 2)).toEqual(["2/4", "3/6"]);
    expect(equivalents(1, 2, 0)).toEqual([]);
  });
});

describe("parseSimplifySlug", () => {
  it("accepts a published reducible fraction and rejects junk", () => {
    expect(parseSimplifySlug("4-8")).toEqual({ a: 4, b: 8, slug: "4-8" });
    expect(parseSimplifySlug("1-2")).toBeNull();
    expect(parseSimplifySlug("8-4")).toBeNull();
    expect(parseSimplifySlug("")).toBeNull();
    expect(parseSimplifySlug("4/8")).toBeNull();
    expect(parseSimplifySlug("abc")).toBeNull();
  });
});
