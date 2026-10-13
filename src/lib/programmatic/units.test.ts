import { describe, expect, it } from "vitest";
import {
  convertUnit,
  parseUnitSlug,
  reverseConv,
  typesForConverter,
  UNITS,
} from "@/lib/programmatic/units";

function unit(id: string) {
  const found = UNITS.find((entry) => entry.id === id);
  if (!found) throw new Error(`missing unit ${id}`);
  return found;
}

describe("convertUnit", () => {
  it("converts exact length and temperature anchors", () => {
    expect(convertUnit(1, unit("inches-to-cm"))).toBe(2.54);
    expect(convertUnit(10, unit("inches-to-cm"))).toBe(25.4);
    expect(convertUnit(0, unit("inches-to-cm"))).toBe(0);
    expect(convertUnit(1, unit("miles-to-km"))).toBe(1.609344);
    expect(convertUnit(0, unit("celsius-to-fahrenheit"))).toBe(32);
    expect(convertUnit(100, unit("celsius-to-fahrenheit"))).toBe(212);
    expect(convertUnit(-40, unit("celsius-to-fahrenheit"))).toBe(-40);
  });

  it("converts kilograms to pounds with the published factor", () => {
    expect(convertUnit(1, unit("kg-to-lbs"))).toBeCloseTo(2.2046226218, 10);
    expect(convertUnit(0, unit("kg-to-lbs"))).toBe(0);
  });
});

describe("parseUnitSlug", () => {
  it("parses a known amount and rejects unknown amounts and junk", () => {
    const page = parseUnitSlug("10-kg-to-lbs");
    expect(page).toMatchObject({ value: 10, slug: "10-kg-to-lbs" });
    expect(page?.conv.id).toBe("kg-to-lbs");
    expect(parseUnitSlug("0-celsius-to-fahrenheit")?.value).toBe(0);
    expect(parseUnitSlug("999-kg-to-lbs")).toBeNull();
    expect(parseUnitSlug("")).toBeNull();
    expect(parseUnitSlug("kg-to-lbs")).toBeNull();
    expect(parseUnitSlug("not a slug")).toBeNull();
    expect(() => parseUnitSlug("@@@")).not.toThrow();
  });
});

describe("reverseConv and typesForConverter", () => {
  it("finds the inverse conversion and the converter's family", () => {
    expect(reverseConv(unit("kg-to-lbs"))?.id).toBe("lbs-to-kg");
    expect(reverseConv(unit("celsius-to-fahrenheit"))?.id).toBe(
      "fahrenheit-to-celsius",
    );
    const weight = typesForConverter("weight-converter");
    expect(weight.some((entry) => entry.id === "kg-to-lbs")).toBe(true);
    expect(typesForConverter("not-a-converter")).toEqual([]);
  });
});
