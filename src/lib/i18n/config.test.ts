import { describe, expect, it } from "vitest";
import { defaultLocale, isLocale, locales } from "@/lib/i18n/config";

describe("isLocale", () => {
  it("accepts only the configured locales", () => {
    expect(locales).toEqual(["en"]);
    expect(defaultLocale).toBe("en");
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("")).toBe(false);
    expect(isLocale("EN")).toBe(false);
    expect(isLocale("en-US")).toBe(false);
  });
});
