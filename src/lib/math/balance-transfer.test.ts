import { describe, expect, it } from "vitest";
import { balanceTransfer } from "@/lib/math/balance-transfer";

describe("balanceTransfer", () => {
  const base = {
    balance: 5_000,
    currentAprPct: 24,
    monthlyPayment: 300,
    promoAprPct: 0,
    promoMonths: 18,
    transferFeePct: 3,
    postPromoAprPct: 24,
  };

  it("clears a 0% promo balance within the promo with no interest", () => {
    const r = balanceTransfer(base);
    expect(r.transferFee).toBe(150);
    expect(r.transferredBalance).toBe(5_150);
    expect(r.transfer.interest).toBe(0);
    expect(r.transfer.months).toBe(18); // 5150 / 300 = 17.2 → 18 payments
    expect(r.paidOffWithinPromo).toBe(true);
    expect(r.paymentToClearInPromo).toBeCloseTo(5_150 / 18, 6);
  });

  it("charges interest when staying at 24% and reports the saving", () => {
    const r = balanceTransfer(base);
    expect(r.stay.interest).toBeGreaterThan(0);
    expect(r.stay.months).toBeGreaterThan(r.transfer.months);
    expect(r.savings).toBeCloseTo(r.stay.interest - 150, 6);
    expect(r.savings).toBeGreaterThan(0);
    expect(r.monthsSaved).toBe(r.stay.months - r.transfer.months);
  });

  it("accrues post-promo interest when the payment is too small to clear in time", () => {
    const r = balanceTransfer({ ...base, monthlyPayment: 150 });
    expect(r.paidOffWithinPromo).toBe(false);
    expect(r.transfer.months).toBeGreaterThan(18);
    expect(r.transfer.interest).toBeGreaterThan(0);
  });

  it("flags a payment that never covers the interest", () => {
    const r = balanceTransfer({ ...base, monthlyPayment: 50 });
    expect(r.stay.neverPaidOff).toBe(true);
    expect(r.monthsSaved).toBe(0);
  });

  it("a transfer with a fee but no promo can cost more than staying", () => {
    const r = balanceTransfer({ ...base, promoMonths: 0, postPromoAprPct: 24 });
    expect(r.savings).toBeLessThan(0);
  });
});
