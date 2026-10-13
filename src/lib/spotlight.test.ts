import { describe, expect, it } from "vitest";
import { SPOTLIGHT, spotlightForPage, spotlightOfWeek } from "@/lib/spotlight";

/** UTC midnight, so the ISO week does not depend on the machine timezone. */
function utc(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

describe("spotlightOfWeek", () => {
  it("is deterministic for a given instant", () => {
    const date = utc(2024, 3, 4);
    expect(spotlightOfWeek(date)).toBe(spotlightOfWeek(date));
    expect(spotlightOfWeek(date)).toBe(SPOTLIGHT[0]);
  });

  it("stays on the same entry for every day of an ISO week", () => {
    // 2024-03-04 is Monday of ISO week 10; 2024-03-10 is the Sunday.
    const monday = spotlightOfWeek(utc(2024, 3, 4));
    const sunday = spotlightOfWeek(utc(2024, 3, 10));
    expect(monday).toBe(sunday);
    expect(monday.path).toBe("/mortgage-calculator");
  });

  it("advances when the ISO week number changes", () => {
    // Week 10 → index 0; week 11 (2024-03-11) → index 1.
    expect(spotlightOfWeek(utc(2024, 3, 4)).path).toBe("/mortgage-calculator");
    expect(spotlightOfWeek(utc(2024, 3, 11)).path).toBe(
      "/compound-interest-calculator",
    );
    // ISO week 1 of 2024 (Mon 1 Jan) → index 1.
    expect(spotlightOfWeek(utc(2024, 1, 1)).path).toBe(
      "/compound-interest-calculator",
    );
    expect(spotlightOfWeek(utc(2024, 1, 7)).path).toBe(
      "/compound-interest-calculator",
    );
  });

  it("treats the year boundary by ISO week, not by calendar year", () => {
    // 2020-12-31 and 2021-01-01 are both ISO week 53; 2021-01-04 is week 1.
    const endOf2020 = spotlightOfWeek(utc(2020, 12, 31));
    const newYearsDay = spotlightOfWeek(utc(2021, 1, 1));
    const weekOne = spotlightOfWeek(utc(2021, 1, 4));
    expect(endOf2020).toBe(newYearsDay);
    expect(weekOne).not.toBe(endOf2020);
    expect(SPOTLIGHT).toContain(endOf2020);
    expect(SPOTLIGHT).toContain(weekOne);
  });

  it("does not throw on an invalid date", () => {
    expect(() => spotlightOfWeek(new Date(Number.NaN))).not.toThrow();
  });
});

describe("spotlightForPage", () => {
  it("never links a page to itself", () => {
    const dates = [utc(2024, 1, 1), utc(2024, 3, 4), utc(2024, 3, 25), utc(2021, 1, 4)];
    for (const item of SPOTLIGHT) {
      const slug = item.path.replace(/^\//, "");
      for (const date of dates) {
        const picked = spotlightForPage(slug, date);
        expect(picked.path).not.toBe(item.path);
        expect(SPOTLIGHT).toContain(picked);
      }
    }
  });

  it("skips the current page and uses the next roster entry", () => {
    // ISO week 10 lands on the mortgage page, so that page gets the next one.
    const picked = spotlightForPage("mortgage-calculator", utc(2024, 3, 4));
    expect(picked.path).toBe("/compound-interest-calculator");

    // A page that is not this week's pick still gets this week's entry.
    const other = spotlightForPage("loan-calculator", utc(2024, 3, 4));
    expect(other.path).toBe("/mortgage-calculator");
  });

  it("returns a real roster entry for an unknown or empty slug", () => {
    const date = utc(2024, 6, 15);
    expect(SPOTLIGHT).toContain(spotlightForPage("not-a-page", date));
    expect(SPOTLIGHT).toContain(spotlightForPage("", date));
    expect(SPOTLIGHT).toContain(spotlightForPage("@@@", date));
  });
});
