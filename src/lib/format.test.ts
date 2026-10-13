import { describe, expect, it } from "vitest";
import {
  CURRENCIES,
  currencySymbol,
  formatMoney,
  formatNumber,
  formatPercent,
  round2,
} from "@/lib/format";

describe("CURRENCIES", () => {
  it("lists the supported currency codes in a stable order", () => {
    expect([...CURRENCIES]).toEqual([
      "USD",
      "EUR",
      "GBP",
      "CAD",
      "AUD",
      "JPY",
      "CNY",
      "INR",
      "CHF",
      "MXN",
      "BRL",
      "ZAR",
    ]);
  });

  it("has a display symbol for every listed currency and none for junk", () => {
    for (const code of CURRENCIES) {
      expect(currencySymbol(code).length).toBeGreaterThan(0);
    }
    expect(currencySymbol("XXX")).toBe("");
    expect(currencySymbol("")).toBe("");
  });
});

describe("formatNumber", () => {
  it("groups thousands and pads the requested fraction digits", () => {
    expect(formatNumber(1234.5)).toBe("1,234.50");
    expect(formatNumber(10)).toBe("10.00");
    expect(formatNumber(0)).toBe("0.00");
    expect(formatNumber(1000, 0)).toBe("1,000");
    expect(formatNumber(1234.567, 1)).toBe("1,234.6");
  });

  it("keeps a minus sign on negative amounts", () => {
    expect(formatNumber(-1500.5)).toBe("-1,500.50");
    expect(formatNumber(-0.5, 0)).toBe("-1");
  });

  it("treats NaN and infinities as zero", () => {
    expect(formatNumber(Number.NaN)).toBe("0.00");
    expect(formatNumber(Number.POSITIVE_INFINITY)).toBe("0.00");
    expect(formatNumber(Number.NEGATIVE_INFINITY)).toBe("0.00");
  });
});

describe("formatMoney", () => {
  it("prefixes the symbol and uses two decimals, except whole yen", () => {
    expect(formatMoney(1234.5)).toBe("$1,234.50");
    expect(formatMoney(1234.5, "USD")).toBe("$1,234.50");
    expect(formatMoney(10, "EUR")).toBe("€10.00");
    expect(formatMoney(10, "GBP")).toBe("£10.00");
    expect(formatMoney(10, "CHF")).toBe("CHF 10.00");
    expect(formatMoney(10, "ZAR")).toBe("R10.00");
    expect(formatMoney(1234, "JPY")).toBe("¥1,234");
    expect(formatMoney(1234.4, "JPY")).toBe("¥1,234");
    expect(formatMoney(1234.6, "JPY")).toBe("¥1,235");
  });

  it("rounds to the currency's fraction digits", () => {
    expect(formatMoney(1.236, "USD")).toBe("$1.24");
    expect(formatMoney(1.234, "EUR")).toBe("€1.23");
  });

  it("places the minus after the symbol", () => {
    expect(formatMoney(-12.5, "USD")).toBe("$-12.50");
    expect(formatMoney(-99.6, "JPY")).toBe("¥-100");
  });

  it("appends an unknown code instead of a symbol", () => {
    expect(formatMoney(1234.5, "XYZ")).toBe("1,234.50 XYZ");
  });

  it("does not throw on zero, NaN, or non-numeric input", () => {
    expect(formatMoney(0)).toBe("$0.00");
    expect(formatMoney(Number.NaN)).toBe("$0.00");
    expect(formatMoney(Number.POSITIVE_INFINITY)).toBe("$0.00");
    expect(formatMoney(Number(""))).toBe("$0.00");
    expect(formatMoney("nope" as unknown as number)).toBe("$0.00");
    expect(() => formatMoney(Number.NaN, "nope")).not.toThrow();
  });
});

describe("formatPercent and round2", () => {
  it("formats a percent with a trailing sign and a finite fallback", () => {
    expect(formatPercent(12.34)).toBe("12.3%");
    expect(formatPercent(12.36, 2)).toBe("12.36%");
    expect(formatPercent(0)).toBe("0.0%");
    expect(formatPercent(-3.25, 2)).toBe("-3.25%");
    expect(formatPercent(Number.NaN)).toBe("0.0%");
    expect(formatPercent(Number.POSITIVE_INFINITY)).toBe("0.0%");
  });

  it("rounds to two decimal places", () => {
    expect(round2(0)).toBe(0);
    expect(round2(10)).toBe(10);
    expect(round2(1.234)).toBe(1.23);
    expect(round2(1.239)).toBe(1.24);
    expect(round2(-1.234)).toBe(-1.23);
  });
});
