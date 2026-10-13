import { describe, expect, it } from "vitest";
import {
  decimalToFraction,
  parseDecFracSlug,
} from "@/lib/programmatic/decfrac";

describe("decimalToFraction", () => {
  it("reduces terminating decimals to simplest fractions", () => {
    expect(decimalToFraction("0.5")).toMatchObject({
      num: 1,
      den: 2,
      whole: 0,
      rem: 1,
      percent: "50",
    });
    expect(decimalToFraction("0.75")).toMatchObject({
      num: 3,
      den: 4,
      percent: "75",
    });
    expect(decimalToFraction("0.125")).toMatchObject({ num: 1, den: 8 });
    expect(decimalToFraction("1.25")).toMatchObject({
      num: 5,
      den: 4,
      whole: 1,
      rem: 1,
      percent: "125",
    });
  });

  it("does not throw on an empty string", () => {
    expect(() => decimalToFraction("")).not.toThrow();
    const empty = decimalToFraction("");
    expect(empty.den).toBeGreaterThan(0);
  });
});

describe("parseDecFracSlug", () => {
  it("accepts a hyphenated decimal and rejects a dotted one", () => {
    expect(parseDecFracSlug("0-75")?.decimal).toBe("0.75");
    expect(parseDecFracSlug("1-25")?.decimal).toBe("1.25");
    expect(parseDecFracSlug("0.75")).toBeNull();
    expect(parseDecFracSlug("")).toBeNull();
    expect(parseDecFracSlug("nope")).toBeNull();
  });
});
