import { describe, expect, it } from "vitest";
import { schedule } from "@/lib/math/mortgage";

describe("mortgage schedule", () => {
  it("prices a $200,000 loan at 6% for 30 years", () => {
    const calc = schedule(200_000, 6, 30);
    expect(calc.payment.toFixed(2)).toBe("1199.10");
    expect(calc.n).toBe(360);
    expect(calc.rows).toHaveLength(30);
    expect(calc.rows.at(-1)?.balance.toFixed(2)).toBe("0.00");
    expect(calc.interest).toBeCloseTo(calc.payment * 360 - 200_000, 8);
  });

  it("prices the default $320,000 loan at 6.5% for 30 years", () => {
    const calc = schedule(320_000, 6.5, 30);
    expect(calc.payment.toFixed(2)).toBe("2022.62");
    expect(calc.interest).toBeGreaterThan(0);
    expect(calc.rows[0].interest).toBeGreaterThan(calc.rows[0].principal);
  });

  it("handles a 0% rate and a 100% down payment", () => {
    const free = schedule(120_000, 0, 10);
    expect(free.payment).toBe(1_000);
    expect(free.interest).toBe(0);
    expect(free.rows.at(-1)?.balance).toBe(0);

    const paidOff = schedule(0, 6.5, 30);
    expect(paidOff.payment).toBe(0);
    expect(paidOff.interest).toBe(0);
    expect(paidOff.total).toBe(0);
  });
});
