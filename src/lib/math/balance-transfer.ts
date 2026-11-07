// Balance transfer — keep a credit-card balance where it is, or move it to a
// card with a promotional (usually 0%) APR for a fixed number of months in
// exchange for a one-time transfer fee.
//
// Both scenarios assume the same fixed monthly payment, no new purchases, and
// on-time payments (a missed payment usually voids the promo rate). Interest
// accrues monthly at APR/12 on the outstanding balance — the standard
// simplified card-interest model used by payoff calculators. After the promo
// period ends, the transferred balance accrues at the card's regular APR.
// The transfer fee is added to the transferred balance (how issuers bill it).
// Pure arithmetic on the user's own inputs.

export interface BalanceTransferInput {
  balance: number;
  currentAprPct: number;
  monthlyPayment: number;
  promoAprPct: number;
  promoMonths: number;
  transferFeePct: number;
  /** APR after the promo ends on the new card. */
  postPromoAprPct: number;
}

export interface PayoffPath {
  months: number;
  interest: number;
  /** True if the payment never clears the balance within 50 years. */
  neverPaidOff: boolean;
}

export interface BalanceTransferResult {
  stay: PayoffPath;
  transfer: PayoffPath;
  transferFee: number;
  transferredBalance: number;
  /** Interest (stay) − (interest + fee) (transfer). Positive = transfer saves money. */
  savings: number;
  paidOffWithinPromo: boolean;
  /** Payment needed to clear the transferred balance by the end of the promo. */
  paymentToClearInPromo: number;
  monthsSaved: number;
}

const MAX_MONTHS = 600;
const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

function payoff(
  balance: number,
  payment: number,
  aprFor: (month: number) => number,
): PayoffPath {
  let bal = balance;
  let interest = 0;
  let m = 0;
  while (bal > 0.005 && m < MAX_MONTHS) {
    m++;
    const i = bal * (aprFor(m) / 100 / 12);
    interest += i;
    bal = bal + i - payment;
  }
  return { months: m, interest, neverPaidOff: bal > 0.005 };
}

export function balanceTransfer(inp: BalanceTransferInput): BalanceTransferResult {
  const balance = pos(inp.balance);
  const payment = pos(inp.monthlyPayment);
  const promoMonths = Math.round(pos(inp.promoMonths));
  const transferFee = balance * (pos(inp.transferFeePct) / 100);
  const transferredBalance = balance + transferFee;

  const stay = payoff(balance, payment, () => pos(inp.currentAprPct));
  const transfer = payoff(transferredBalance, payment, (m) =>
    m <= promoMonths ? pos(inp.promoAprPct) : pos(inp.postPromoAprPct),
  );

  const stayCost = stay.interest;
  const transferCost = transfer.interest + transferFee;

  return {
    stay,
    transfer,
    transferFee,
    transferredBalance,
    savings: stayCost - transferCost,
    paidOffWithinPromo: !transfer.neverPaidOff && transfer.months <= promoMonths,
    paymentToClearInPromo:
      promoMonths > 0
        ? pos(inp.promoAprPct) === 0
          ? transferredBalance / promoMonths
          : // annuity payment at the promo rate over promoMonths
            (() => {
              const r = pos(inp.promoAprPct) / 100 / 12;
              return (transferredBalance * r) / (1 - Math.pow(1 + r, -promoMonths));
            })()
        : 0,
    monthsSaved: stay.neverPaidOff || transfer.neverPaidOff ? 0 : stay.months - transfer.months,
  };
}
