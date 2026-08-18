"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

function amortized(principal: number, aprPct: number, months: number): number {
  const r = aprPct / 100 / 12;
  if (months <= 0) return 0;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

export function LeaseVsBuyCalculator() {
  // Lease
  const [leaseMonthly, setLeaseMonthly] = useState("350");
  const [leaseTerm, setLeaseTerm] = useState("36");
  const [leaseDown, setLeaseDown] = useState("2000");
  // Buy
  const [carPrice, setCarPrice] = useState("30000");
  const [buyDown, setBuyDown] = useState("3000");
  const [apr, setApr] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("60");
  const [resale, setResale] = useState("18000");
  const [currency, setCurrency] = useState("USD");

  const lm = num(leaseMonthly);
  const N = num(leaseTerm);
  const ld = num(leaseDown);
  const price = num(carPrice);
  const bd = num(buyDown);
  const rate = num(apr);
  const lt = num(loanTerm);
  const resaleValue = num(resale);

  const valid =
    lm >= 0 &&
    N > 0 &&
    ld >= 0 &&
    price > 0 &&
    bd >= 0 &&
    Number.isFinite(rate) &&
    rate >= 0 &&
    lt > 0 &&
    resaleValue >= 0 &&
    [lm, N, ld, price, bd, rate, lt, resaleValue].every(Number.isFinite);

  const money = (v: number) => formatMoney(v, currency);

  let result: {
    cheaper: string;
    diff: number;
    leaseTotal: number;
    buyNet: number;
  } | null = null;

  if (valid) {
    const leaseTotal = ld + lm * N;
    const buyPrincipal = price - bd;
    const buyMonthly = amortized(buyPrincipal, rate, lt);
    const paidOverN = bd + buyMonthly * Math.min(N, lt);
    const buyNet = paidOverN - resaleValue;
    const cheaper = leaseTotal < buyNet ? "Leasing" : "Buying";
    const diff = Math.abs(leaseTotal - buyNet);
    result = { cheaper, diff, leaseTotal, buyNet };
  }

  return (
    <ToolCard>
      <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)] mb-2">
        Lease
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Monthly lease payment">
          <div className="flex gap-2">
            <NumberInput value={leaseMonthly} onChange={setLeaseMonthly} />
            <select
              className="field w-24"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              aria-label="Currency"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </Field>
        <Field label="Lease term (months)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={leaseTerm}
            onChange={(e) => setLeaseTerm(e.target.value)}
          />
        </Field>
        <Field label="Lease down payment">
          <NumberInput value={leaseDown} onChange={setLeaseDown} />
        </Field>
      </div>

      <div className="mt-6 text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)] mb-2">
        Buy
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Car price">
          <NumberInput value={carPrice} onChange={setCarPrice} />
        </Field>
        <Field label="Buy down payment">
          <NumberInput value={buyDown} onChange={setBuyDown} />
        </Field>
        <Field label="Loan APR (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={apr}
            onChange={(e) => setApr(e.target.value)}
          />
        </Field>
        <Field label="Loan term (months)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
          />
        </Field>
        <Field label="Resale value after lease term">
          <NumberInput value={resale} onChange={setResale} />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Cheaper option"
          accent
          value={
            result ? `${result.cheaper} — saves ${money(result.diff)}` : "—"
          }
        />
        <Stat
          label="Lease total cost"
          value={result ? money(result.leaseTotal) : "—"}
        />
        <Stat
          label="Buy net cost"
          value={result ? money(result.buyNet) : "—"}
          sub={result ? `over ${N} months` : undefined}
        />
      </div>
    </ToolCard>
  );
}
