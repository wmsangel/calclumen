"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

/** Amortized payment for a monthly rate r over n months. */
function amortized(principal: number, r: number, n: number) {
  if (n <= 0) return NaN;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

export function MortgageRefinanceCalculator() {
  const [currentBalance, setCurrentBalance] = useState("250000");
  const [currentRate, setCurrentRate] = useState("6.5");
  const [remainingMonths, setRemainingMonths] = useState("300");
  const [newRate, setNewRate] = useState("5.25");
  const [newTermYears, setNewTermYears] = useState("30");
  const [closingCosts, setClosingCosts] = useState("4000");
  const [rollIn, setRollIn] = useState(false);
  const [currency, setCurrency] = useState("USD");

  const bal = num(currentBalance);
  const cr = num(currentRate);
  const rm = num(remainingMonths);
  const nr = num(newRate);
  const nt = num(newTermYears);
  const cc = num(closingCosts);

  const valid =
    bal > 0 &&
    Number.isFinite(cr) &&
    rm > 0 &&
    Number.isFinite(nr) &&
    nt > 0 &&
    Number.isFinite(cc) &&
    cc >= 0;

  let newPayment = NaN;
  let monthlySavings = NaN;
  let breakEvenMonths: number | null = null;
  let interestSaved = NaN;

  if (valid) {
    const rc = cr / 100 / 12;
    const Mc = amortized(bal, rc, rm);
    const principal = rollIn ? bal + cc : bal;
    const rn = nr / 100 / 12;
    const nn = nt * 12;
    const Mn = amortized(principal, rn, nn);
    newPayment = Mn;
    monthlySavings = Mc - Mn;
    breakEvenMonths = monthlySavings > 0 ? cc / monthlySavings : null;
    const totalIntCurrent = Mc * rm - bal;
    const totalIntNew = Mn * nn - principal;
    interestSaved = totalIntCurrent - totalIntNew;
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Current loan balance">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={currentBalance}
              onChange={(e) => setCurrentBalance(e.target.value)}
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
        <Field label="Current rate (APR %)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={currentRate}
            onChange={(e) => setCurrentRate(e.target.value)}
          />
        </Field>
        <Field label="Remaining months">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={remainingMonths}
            onChange={(e) => setRemainingMonths(e.target.value)}
          />
        </Field>
        <Field label="New rate (APR %)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={newRate}
            onChange={(e) => setNewRate(e.target.value)}
          />
        </Field>
        <Field label="New term (years)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={newTermYears}
            onChange={(e) => setNewTermYears(e.target.value)}
          />
        </Field>
        <Field label="Closing costs">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={closingCosts}
            onChange={(e) => setClosingCosts(e.target.value)}
          />
        </Field>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-[var(--ink-soft)]">
        <input
          type="checkbox"
          checked={rollIn}
          onChange={(e) => setRollIn(e.target.checked)}
        />
        Roll closing costs into loan
      </label>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="New monthly payment"
          accent
          value={valid ? formatMoney(newPayment, currency) : "—"}
        />
        <Stat
          label="Monthly savings"
          value={valid ? formatMoney(monthlySavings, currency) : "—"}
        />
        <Stat
          label="Break-even"
          value={
            valid
              ? breakEvenMonths === null
                ? "No savings"
                : `${formatNumber(Math.ceil(breakEvenMonths), 0)} months`
              : "—"
          }
        />
        <Stat
          label="Lifetime interest saved"
          value={valid ? formatMoney(interestSaved, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
