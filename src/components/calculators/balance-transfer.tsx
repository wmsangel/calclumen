"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";
import { balanceTransfer, type PayoffPath } from "@/lib/math/balance-transfer";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));
const usd = (n: number) => formatMoney(Math.round(n * 100) / 100, "USD");

function months(p: PayoffPath): string {
  if (p.neverPaidOff) return "Never — payment too small";
  const y = Math.floor(p.months / 12);
  const m = p.months % 12;
  return y > 0 ? `${p.months} mo (${y} yr ${m} mo)` : `${p.months} mo`;
}

function Pct({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        className="field"
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function BalanceTransferCalculator() {
  const [balance, setBalance] = useState("5000");
  const [currentApr, setCurrentApr] = useState("24");
  const [payment, setPayment] = useState("300");
  const [promoApr, setPromoApr] = useState("0");
  const [promoMonths, setPromoMonths] = useState("18");
  const [feePct, setFeePct] = useState("3");
  const [postPromoApr, setPostPromoApr] = useState("24");

  const bal = num(balance);
  const pay = num(payment);
  const valid = bal > 0 && pay > 0;

  const r = valid
    ? balanceTransfer({
        balance: bal,
        currentAprPct: num(currentApr) || 0,
        monthlyPayment: pay,
        promoAprPct: num(promoApr) || 0,
        promoMonths: num(promoMonths) || 0,
        transferFeePct: num(feePct) || 0,
        postPromoAprPct: num(postPromoApr) || 0,
      })
    : null;

  const verdict = !r
    ? "—"
    : r.stay.neverPaidOff && r.transfer.neverPaidOff
      ? "Raise the payment first"
      : r.savings > 0
        ? `Transfer saves ${usd(r.savings)}`
        : r.savings < 0
          ? `Staying saves ${usd(-r.savings)}`
          : "No difference";

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Current balance">
          <NumberInput value={balance} onChange={setBalance} />
        </Field>
        <Pct label="Current card APR (%)" value={currentApr} onChange={setCurrentApr} />
        <Field label="Monthly payment" hint="Same payment in both scenarios">
          <NumberInput value={payment} onChange={setPayment} />
        </Field>
        <Pct label="Transfer fee (%)" value={feePct} onChange={setFeePct} hint="Typically 3–5%, added to the balance" />
        <Pct label="Promo APR (%)" value={promoApr} onChange={setPromoApr} />
        <Pct label="Promo length (months)" value={promoMonths} onChange={setPromoMonths} />
        <Pct
          label="APR after the promo (%)"
          value={postPromoApr}
          onChange={setPostPromoApr}
          hint="The new card's regular rate"
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Verdict" accent value={verdict} />
        <Stat
          label="Clear it within the promo?"
          value={!r ? "—" : r.paidOffWithinPromo ? "Yes" : "No"}
          sub={r && !r.paidOffWithinPromo && !r.transfer.neverPaidOff ? "Regular APR kicks in on the remainder" : undefined}
        />
        <Stat
          label="Payment to clear in promo"
          value={r && r.paymentToClearInPromo > 0 ? usd(r.paymentToClearInPromo) + "/mo" : "—"}
        />
        <Stat
          label="Stay — interest"
          value={r ? usd(r.stay.interest) : "—"}
          sub={r ? `Paid off in ${months(r.stay)}` : undefined}
        />
        <Stat
          label="Transfer — interest + fee"
          value={r ? usd(r.transfer.interest + r.transferFee) : "—"}
          sub={r ? `Fee ${usd(r.transferFee)} · paid off in ${months(r.transfer)}` : undefined}
        />
        <Stat
          label="Months saved"
          value={r ? (r.monthsSaved > 0 ? `${r.monthsSaved}` : "0") : "—"}
        />
      </div>
    </ToolCard>
  );
}
