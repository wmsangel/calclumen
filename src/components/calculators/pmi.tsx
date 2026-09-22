"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function PmiCalculator() {
  const [price, setPrice] = useState("400000");
  const [down, setDown] = useState("40000");
  const [rate, setRate] = useState("6.5");
  const [term, setTerm] = useState("30");
  const [pmiRate, setPmiRate] = useState("0.5");
  const [currency, setCurrency] = useState("USD");

  const p = num(price);
  const d = num(down);
  const r = num(rate);
  const t = num(term);
  const pr = num(pmiRate);

  const valid =
    Number.isFinite(p) &&
    p > 0 &&
    Number.isFinite(d) &&
    d >= 0 &&
    d < p &&
    Number.isFinite(r) &&
    r >= 0 &&
    Number.isFinite(t) &&
    t > 0 &&
    Number.isFinite(pr) &&
    pr >= 0;

  let loan = NaN;
  let ltv = NaN;
  let downPct = NaN;
  let needsPmi = false;
  let monthlyPmi = NaN;
  let annualPmi = NaN;
  let monthsToCancel = NaN;
  let totalPmi = NaN;
  let extraToEquity = NaN;

  if (valid) {
    loan = p - d;
    ltv = loan / p;
    downPct = d / p;
    needsPmi = ltv > 0.8;
    // Balance at which PMI can be cancelled: 80% of the original home value.
    const cancelBalance = 0.8 * p;
    extraToEquity = Math.max(0, loan - cancelBalance);

    if (needsPmi) {
      annualPmi = loan * (pr / 100);
      monthlyPmi = annualPmi / 12;

      // Amortize to find the month the balance first reaches 80% LTV.
      const n = Math.round(t * 12);
      const mr = r / 100 / 12;
      const payment =
        mr === 0 ? loan / n : (loan * mr) / (1 - Math.pow(1 + mr, -n));
      let balance = loan;
      let months = 0;
      while (balance > cancelBalance && months < n) {
        const interest = balance * mr;
        balance -= payment - interest;
        months++;
      }
      monthsToCancel = months;
      totalPmi = monthlyPmi * months;
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Home price">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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
        <Field label="Down payment">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={down}
            onChange={(e) => setDown(e.target.value)}
          />
        </Field>
        <Field label="Loan interest rate (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </Field>
        <Field label="Loan term (years)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </Field>
        <Field label="Annual PMI rate (% of loan)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={pmiRate}
            onChange={(e) => setPmiRate(e.target.value)}
          />
        </Field>
      </div>

      {valid && !needsPmi ? (
        <div className="mt-5">
          <Stat
            label="PMI required?"
            accent
            value="No PMI needed"
            sub={`Your down payment is ${(downPct * 100).toFixed(1)}% (${(ltv * 100).toFixed(1)}% LTV) — 20% or more, so conventional lenders don't require PMI.`}
          />
        </div>
      ) : (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Stat
              label="Monthly PMI"
              accent
              value={valid ? formatMoney(monthlyPmi, currency) : "—"}
            />
            <Stat
              label="Annual PMI"
              value={valid ? formatMoney(annualPmi, currency) : "—"}
            />
            <Stat
              label="Down payment / LTV"
              value={valid ? `${(downPct * 100).toFixed(1)}% down` : "—"}
              sub={valid ? `${(ltv * 100).toFixed(1)}% loan-to-value` : undefined}
            />
            <Stat
              label="PMI removed after"
              value={
                valid && Number.isFinite(monthsToCancel)
                  ? `${(monthsToCancel / 12).toFixed(1)} yrs`
                  : "—"
              }
              sub={
                valid ? "when the balance reaches 80% of the home value" : undefined
              }
            />
            <Stat
              label="Total PMI until cancelled"
              value={valid ? formatMoney(totalPmi, currency) : "—"}
            />
            <Stat
              label="Extra principal to reach 20% equity"
              value={valid ? formatMoney(extraToEquity, currency) : "—"}
            />
          </div>
          <p className="mt-4 text-sm text-[var(--ink-soft)]">
            You can ask your lender to cancel PMI once the balance reaches 80% of
            the original value; by law it drops automatically at 78%. Paying a
            little extra principal each month gets you there sooner.
          </p>
        </>
      )}
    </ToolCard>
  );
}
