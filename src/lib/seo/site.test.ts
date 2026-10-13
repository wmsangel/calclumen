import { describe, expect, it } from "vitest";
import { absUrl, SITE_NAME, SITE_URL } from "@/lib/seo/site";

describe("absUrl", () => {
  it("builds a locale URL and strips extra slashes from the path", () => {
    expect(SITE_NAME).toBe("CalcLumen");
    expect(absUrl()).toBe(`${SITE_URL}/en`);
    expect(absUrl("en", "")).toBe(`${SITE_URL}/en`);
    expect(absUrl("en", "loan-calculator")).toBe(
      `${SITE_URL}/en/loan-calculator`,
    );
    expect(absUrl("en", "/loan-calculator")).toBe(
      `${SITE_URL}/en/loan-calculator`,
    );
    expect(absUrl("en", "///loan-calculator")).toBe(
      `${SITE_URL}/en/loan-calculator`,
    );
  });
});
