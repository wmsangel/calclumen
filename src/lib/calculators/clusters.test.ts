import { describe, expect, it } from "vitest";
import type { CategoryId } from "@/lib/calculators/registry";
import { clusterOfSlug, clustersForCategory } from "@/lib/calculators/clusters";

describe("clustersForCategory", () => {
  it("returns the finance sections in display order", () => {
    const finance = clustersForCategory("finance");
    expect(finance?.map((cluster) => cluster.id)).toEqual([
      "mortgage-home",
      "loans-debt",
      "retirement-investing",
      "savings-budgeting",
      "income-tax",
    ]);
    expect(finance?.every((cluster) => cluster.slugs.length > 0)).toBe(true);
  });

  it("returns null for categories that have no clusters", () => {
    const bare: CategoryId[] = [
      "auto",
      "business",
      "health",
      "datetime",
      "math",
      "conversions",
      "homediy",
    ];
    for (const id of bare) {
      expect(clustersForCategory(id)).toBeNull();
    }
    expect(clustersForCategory("nope" as CategoryId)).toBeNull();
  });
});

describe("clusterOfSlug", () => {
  it("finds the finance cluster a known calculator belongs to", () => {
    expect(clusterOfSlug("mortgage-calculator")?.id).toBe("mortgage-home");
    expect(clusterOfSlug("loan-calculator")?.id).toBe("loans-debt");
    expect(clusterOfSlug("401k-calculator")?.id).toBe("retirement-investing");
    expect(clusterOfSlug("budget-calculator")?.id).toBe("savings-budgeting");
    expect(clusterOfSlug("tip-calculator")?.id).toBe("income-tax");
  });

  it("matches every slug listed in the finance clusters", () => {
    const finance = clustersForCategory("finance");
    expect(finance).not.toBeNull();
    for (const cluster of finance ?? []) {
      for (const slug of cluster.slugs) {
        expect(clusterOfSlug(slug)?.id).toBe(cluster.id);
      }
    }
  });

  it("returns null for calculators outside finance and for junk", () => {
    expect(clusterOfSlug("bmi-calculator")).toBeNull();
    expect(clusterOfSlug("percentage-calculator")).toBeNull();
    expect(clusterOfSlug("")).toBeNull();
    expect(clusterOfSlug("not-a-calculator")).toBeNull();
    expect(clusterOfSlug("Mortgage-Calculator")).toBeNull();
    expect(() => clusterOfSlug("@@@")).not.toThrow();
  });
});
