import { describe, expect, it } from "vitest";
import {
  convertBinary,
  convertDecimal,
  fmtSize,
  parseSizeSlug,
  SIZES,
} from "@/lib/programmatic/datasize";

function size(id: string) {
  const found = SIZES.find((entry) => entry.id === id);
  if (!found) throw new Error(`missing size ${id}`);
  return found;
}

describe("data size conversions", () => {
  it("uses 1000 for decimal and 1024 for binary", () => {
    const tb = size("tb-to-gb");
    expect(convertDecimal(1, tb)).toBe(1000);
    expect(convertBinary(1, tb)).toBe(1024);
    expect(convertDecimal(2, tb)).toBe(2000);
    expect(convertBinary(2, tb)).toBe(2048);
    const gb = size("gb-to-mb");
    expect(convertDecimal(1, gb)).toBe(1000);
    expect(convertBinary(1, gb)).toBe(1024);
    expect(convertDecimal(0, tb)).toBe(0);
    expect(convertBinary(0, tb)).toBe(0);
  });

  it("trims formatted sizes and replaces non-finite values", () => {
    expect(fmtSize(1024)).toBe("1024");
    expect(fmtSize(1.5)).toBe("1.5");
    expect(fmtSize(1.23)).toBe("1.23");
    expect(fmtSize(0)).toBe("0");
    expect(fmtSize(Number.NaN)).toBe("—");
    expect(fmtSize(Number.POSITIVE_INFINITY)).toBe("—");
  });
});

describe("parseSizeSlug", () => {
  it("accepts a published amount and rejects junk", () => {
    expect(parseSizeSlug("1-tb-to-gb")).toMatchObject({
      value: 1,
      slug: "1-tb-to-gb",
    });
    expect(parseSizeSlug("1-tb-to-gb")?.conv.id).toBe("tb-to-gb");
    expect(parseSizeSlug("7-tb-to-gb")).toBeNull();
    expect(parseSizeSlug("")).toBeNull();
    expect(parseSizeSlug("tb-to-gb")).toBeNull();
    expect(parseSizeSlug("nope")).toBeNull();
  });
});
