"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

/** Standard amortizing loan payment. */
function monthlyPayment(principal: number, annualRatePct: number, years: number) {
  const n = Math.round(years * 12);
  const r = annualRatePct / 100 / 12;
  if (n <= 0) return { payment: NaN, total: NaN, interest: NaN, n };
  if (r === 0) {
    const payment = principal / n;
    return { payment, total: principal, interest: 0, n };
  }
  const factor = Math.pow(1 + r, n);
  const payment = (principal * r * factor) / (factor - 1);
  const total = payment * n;
  return { payment, total, interest: total - principal, n };
}

export function LoanCalculator() {
  const [amount, setAmount] = useState("250000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const [currency, setCurrency] = useState("USD");

  const p = num(amount);
  const r = num(rate);
  const y = num(years);
  const valid = p > 0 && Number.isFinite(r) && y > 0;

  const { payment, total, interest, n } = valid
    ? monthlyPayment(p, r, y)
    : { payment: NaN, total: NaN, interest: NaN, n: 0 };

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Loan amount">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
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
        <Field label="Interest rate (APR %)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </Field>
        <Field label="Term (years)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </Field>
        <Field label="Payments">
          <input className="field" value={valid ? `${n} monthly` : "—"} readOnly />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Monthly payment"
          accent
          value={valid ? formatMoney(payment, currency) : "—"}
        />
        <Stat
          label="Total interest"
          value={valid ? formatMoney(interest, currency) : "—"}
        />
        <Stat
          label="Total cost"
          value={valid ? formatMoney(total, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
