import { describe, expect, it } from "vitest";
import {
  groupBig,
  nCr,
  nPr,
  parseChooseSlug,
} from "@/lib/programmatic/combinations";

describe("nCr and nPr", () => {
  it("matches well-known combination and permutation values", () => {
    expect(nCr(5, 2)).toBe(10n);
    expect(nCr(5, 0)).toBe(1n);
    expect(nCr(5, 5)).toBe(1n);
    expect(nCr(52, 5)).toBe(2_598_960n);
    expect(nCr(100, 2)).toBe(4_950n);
    expect(nPr(5, 2)).toBe(20n);
    expect(nPr(10, 3)).toBe(720n);
    expect(nPr(5, 0)).toBe(1n);
  });

  it("returns zero when k is outside 0..n", () => {
    expect(nCr(5, -1)).toBe(0n);
    expect(nCr(3, 5)).toBe(0n);
    expect(nPr(4, 5)).toBe(0n);
    expect(nPr(4, -1)).toBe(0n);
  });

  it("does not throw on NaN", () => {
    expect(() => nCr(Number.NaN, 2)).not.toThrow();
    expect(() => nPr(5, Number.NaN)).not.toThrow();
  });
});

describe("groupBig and parseChooseSlug", () => {
  it("inserts thousands separators", () => {
    expect(groupBig(0n)).toBe("0");
    expect(groupBig(10n)).toBe("10");
    expect(groupBig(2_598_960n)).toBe("2,598,960");
  });

  it("parses known n-choose-k slugs and rejects junk", () => {
    expect(parseChooseSlug("5-choose-2")).toEqual({
      n: 5,
      k: 2,
      slug: "5-choose-2",
    });
    expect(parseChooseSlug("100-choose-2")).toEqual({
      n: 100,
      k: 2,
      slug: "100-choose-2",
    });
    expect(parseChooseSlug("5-choose-9")).toBeNull();
    expect(parseChooseSlug("")).toBeNull();
    expect(parseChooseSlug("choose")).toBeNull();
    expect(parseChooseSlug("5-choose-2-extra")).toBeNull();
  });
});
