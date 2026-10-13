import { describe, expect, it } from "vitest";
import { CROSS_LINKS, crossLinkFor } from "@/lib/cross-links";

const HOSTS: Record<string, string> = {
  "home-affordability-calculator": "https://costtrek.com/en",
  "capital-gains-tax-calculator": "https://thecryptotools.com",
  "budget-calculator": "https://ocrsnip.com",
  "margin-markup-calculator": "https://iznkit.com/en",
};

describe("crossLinkFor", () => {
  it("maps the four money pages to their network hosts", () => {
    expect(Object.keys(CROSS_LINKS).sort()).toEqual(Object.keys(HOSTS).sort());
    for (const [slug, href] of Object.entries(HOSTS)) {
      const link = crossLinkFor(slug);
      expect(link).not.toBeNull();
      expect(link?.href).toBe(href);
      expect(link?.anchor.length).toBeGreaterThan(0);
      expect(link?.before.length).toBeGreaterThan(0);
      expect(link?.after.length).toBeGreaterThan(0);
    }
  });

  it("returns null for other calculators, empty input, and junk", () => {
    expect(crossLinkFor("loan-calculator")).toBeNull();
    expect(crossLinkFor("mortgage-calculator")).toBeNull();
    expect(crossLinkFor("")).toBeNull();
    expect(crossLinkFor("HOME-AFFORDABILITY-CALCULATOR")).toBeNull();
    expect(crossLinkFor("https://costtrek.com/en")).toBeNull();
    expect(() => crossLinkFor("@@@")).not.toThrow();
  });
});
