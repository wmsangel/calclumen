import { describe, expect, it } from "vitest";
import type { CategoryId } from "@/lib/calculators/registry";
import {
  calcsInCategory,
  calculators,
  categories,
  getCalc,
  getCategory,
  relatedCalcs,
} from "@/lib/calculators/registry";
import { clusterOfSlug } from "@/lib/calculators/clusters";

describe("getCalc", () => {
  it("returns the catalog entry for a real slug", () => {
    expect(getCalc("loan-calculator")).toMatchObject({
      slug: "loan-calculator",
      category: "finance",
      title: "Loan",
    });
    expect(getCalc("percentage-calculator")?.category).toBe("math");
    expect(getCalc("bmi-calculator")?.category).toBe("health");
  });

  it("returns undefined for a missing, empty, or differently cased slug", () => {
    expect(getCalc("does-not-exist")).toBeUndefined();
    expect(getCalc("")).toBeUndefined();
    expect(getCalc("Loan-Calculator")).toBeUndefined();
    expect(getCalc("loan-calculator ")).toBeUndefined();
    expect(() => getCalc("@@@")).not.toThrow();
  });
});

describe("getCategory", () => {
  it("returns the category definition for every known id", () => {
    for (const category of categories) {
      expect(getCategory(category.id)).toBe(category);
      expect(getCategory(category.id).slug.length).toBeGreaterThan(0);
    }
    expect(getCategory("finance").title).toBe("Finance");
    expect(getCategory("health").id).toBe("health");
  });

  it("returns undefined for an unknown category id", () => {
    expect(getCategory("missing" as CategoryId)).toBeUndefined();
    expect(getCategory("" as CategoryId)).toBeUndefined();
  });
});

describe("calcsInCategory", () => {
  it("returns only calculators in that category", () => {
    const health = calcsInCategory("health");
    expect(health.length).toBeGreaterThan(0);
    expect(health.every((calc) => calc.category === "health")).toBe(true);
    expect(health.some((calc) => calc.slug === "bmi-calculator")).toBe(true);
    expect(health.some((calc) => calc.slug === "loan-calculator")).toBe(false);
  });
});

describe("relatedCalcs", () => {
  it("does not include the calculator itself", () => {
    for (const calc of calculators) {
      const related = relatedCalcs(calc.slug, 6);
      expect(related.some((row) => row.slug === calc.slug)).toBe(false);
      expect(related.length).toBeLessThanOrEqual(6);
      expect(related.length).toBeGreaterThan(0);
    }
  });

  it("prefers siblings from the same finance cluster", () => {
    const related = relatedCalcs("mortgage-calculator", 4);
    const cluster = clusterOfSlug("mortgage-calculator");
    expect(related).toHaveLength(4);
    expect(cluster).not.toBeNull();
    for (const row of related) {
      expect(cluster?.slugs).toContain(row.slug);
      expect(row.slug).not.toBe("mortgage-calculator");
    }
  });

  it("stays inside the category when the calculator has no cluster", () => {
    const related = relatedCalcs("bmi-calculator");
    expect(related).toHaveLength(4);
    expect(related.every((row) => row.slug !== "bmi-calculator")).toBe(true);
    expect(related.every((row) => row.category === "health")).toBe(true);
  });

  it("falls back to the front of the catalog for an unknown slug", () => {
    expect(relatedCalcs("no-such-slug", 3).map((calc) => calc.slug)).toEqual(
      calculators.slice(0, 3).map((calc) => calc.slug),
    );
    expect(relatedCalcs("", 2).map((calc) => calc.slug)).toEqual(
      calculators.slice(0, 2).map((calc) => calc.slug),
    );
    expect(relatedCalcs("mortgage-calculator", 0)).toEqual([]);
    expect(() => relatedCalcs("@@@")).not.toThrow();
  });
});
