import { describe, expect, it } from "vitest";
import { subIdValue, withSubId } from "./subid";

describe("withSubId", () => {
  it("adds p1 for Indoleads and subid for Admitad, keeping the path", () => {
    expect(withSubId("https://gettracker.net/6aa298fc76f5f", "indoleads", "loan-calculator")).toBe(
      "https://gettracker.net/6aa298fc76f5f?p1=loan-calculator",
    );
    expect(withSubId("https://zejcl.com/g/abc/", "admitad", "due-date-calculator")).toBe(
      "https://zejcl.com/g/abc/?subid=due-date-calculator",
    );
  });
  it("uses sid for CJ and leaves amazon/house untouched", () => {
    expect(withSubId("https://www.anrdoezrs.net/click-1-2", "cj", "x")).toContain("sid=x");
    expect(withSubId("https://example.com/", "house", "x")).toBe("https://example.com/");
  });
  it("sanitises the label and falls back to home", () => {
    expect(subIdValue("Bonus Tax!")).toBe("bonustax");
    expect(subIdValue(undefined)).toBe("home");
    expect(subIdValue("a".repeat(80))).toHaveLength(64);
  });
  it("keeps /go/ cloaks relative and labels them with src", () => {
    expect(withSubId("/go/keeper", "hasoffers", "self-employment-tax-calculator")).toBe(
      "/go/keeper?src=self-employment-tax-calculator",
    );
  });
  it("does not overwrite an existing label", () => {
    expect(withSubId("https://x.io/c/1?p1=keep", "indoleads", "new")).toBe("https://x.io/c/1?p1=keep");
  });
});
