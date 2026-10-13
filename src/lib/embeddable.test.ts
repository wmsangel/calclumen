import { describe, expect, it } from "vitest";
import { EMBEDDABLE, embeddableFor, isEmbeddable } from "@/lib/embeddable";

describe("isEmbeddable / embeddableFor", () => {
  it("recognises known calculator slugs and returns their iframe height", () => {
    expect(isEmbeddable("loan-calculator")).toBe(true);
    expect(embeddableFor("loan-calculator")).toEqual({
      slug: "loan-calculator",
      height: 580,
    });
    expect(isEmbeddable("mortgage-calculator")).toBe(true);
    expect(embeddableFor("mortgage-calculator")?.height).toBe(780);
    expect(embeddableFor("percentage-calculator")?.height).toBe(560);
    expect(embeddableFor("calorie-calculator")?.height).toBe(700);
  });

  it("agrees with the roster for every embeddable slug", () => {
    expect(EMBEDDABLE.length).toBeGreaterThan(0);
    for (const item of EMBEDDABLE) {
      expect(isEmbeddable(item.slug)).toBe(true);
      expect(embeddableFor(item.slug)).toBe(item);
      expect(item.height).toBeGreaterThan(0);
    }
  });

  it("rejects unknown, empty, and lookalike slugs", () => {
    expect(isEmbeddable("not-a-calculator")).toBe(false);
    expect(embeddableFor("not-a-calculator")).toBeNull();
    expect(isEmbeddable("")).toBe(false);
    expect(embeddableFor("")).toBeNull();
    expect(isEmbeddable("Loan-Calculator")).toBe(false);
    expect(embeddableFor("loan-calculator ")).toBeNull();
    expect(() => embeddableFor("@@@")).not.toThrow();
  });
});
