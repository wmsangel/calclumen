import { describe, expect, it } from "vitest";
import {
  parsePercentSlug,
  percentToParts,
} from "@/lib/programmatic/percentconv";

describe("percentToParts", () => {
  it("reduces a percent to a fraction and a decimal", () => {
    expect(percentToParts("25")).toMatchObject({
      num: 1,
      den: 4,
      decimal: "0.25",
    });
    expect(percentToParts("50")).toMatchObject({
      num: 1,
      den: 2,
      decimal: "0.5",
    });
    expect(percentToParts("12.5")).toMatchObject({
      num: 1,
      den: 8,
      decimal: "0.125",
    });
    expect(percentToParts("0")).toMatchObject({ num: 0, den: 1, decimal: "0" });
  });

  it("does not throw on an empty string", () => {
    expect(() => percentToParts("")).not.toThrow();
  });
});

describe("parsePercentSlug", () => {
  it("accepts published percent slugs and rejects junk", () => {
    expect(parsePercentSlug("25")?.percent).toBe("25");
    expect(parsePercentSlug("12-5")?.percent).toBe("12.5");
    expect(parsePercentSlug("0-5")?.percent).toBe("0.5");
    expect(parsePercentSlug("")).toBeNull();
    expect(parsePercentSlug("12.5")).toBeNull();
    expect(parsePercentSlug("nope")).toBeNull();
  });
});
