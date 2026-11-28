import { describe, expect, it } from "vitest";
import { subIdValue, withSubId } from "./subid";

describe("withSubId", () => {
  it("adds p1 / subid / aff_sub / sid as calclumen-<page>", () => {
    expect(withSubId("https://gettracker.net/6aa298fc76f5f", "indoleads", "loan-calculator")).toBe("https://gettracker.net/6aa298fc76f5f?p1=calclumen-loan-calculator");
    expect(withSubId("https://zejcl.com/g/abc/", "admitad", "due-date-calculator")).toBe("https://zejcl.com/g/abc/?subid=calclumen-due-date-calculator");
    expect(withSubId("https://keepertax.go2cloud.org/aff_c?offer_id=25&aff_id=2191", "hasoffers", "x")).toContain("aff_sub=calclumen-x");
    expect(withSubId("https://www.anrdoezrs.net/click-1-2", "cj", "x")).toContain("sid=calclumen-x");
  });
  it("leaves house links untouched; sanitises and falls back to home", () => {
    expect(withSubId("https://example.com/", "house", "x")).toBe("https://example.com/");
    expect(subIdValue("Bonus Tax!")).toBe("calclumen-bonustax");
    expect(subIdValue(undefined)).toBe("calclumen-home");
    expect(subIdValue("a".repeat(80)).length).toBeLessThanOrEqual(64);
  });
  it("does not overwrite an existing label", () => {
    expect(withSubId("https://x.io/c/1?p1=keep", "indoleads", "new")).toBe("https://x.io/c/1?p1=keep");
  });
});
