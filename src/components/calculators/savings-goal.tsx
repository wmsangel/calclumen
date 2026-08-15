"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function SavingsGoalCalculator() {
  const [goalAmount, setGoalAmount] = useState("20000");
  const [currentSavings, setCurrentSavings] = useState("2000");
  const [years, setYears] = useState("5");
  const [annualReturn, setAnnualReturn] = useState("4");
  const [currency, setCurrency] = useState("USD");

  const goal = num(goalAmount);
  const current = num(currentSavings);
  const y = num(years);
  const ret = num(annualReturn);
  const valid =
    goal > 0 &&
    Number.isFinite(current) &&
    y > 0 &&
    Number.isFinite(ret);

  const r = ret / 100 / 12;
  const n = y * 12;
  const growthFactor = Math.pow(1 + r, n);
  const fvNeeded = goal - current * growthFactor;
  const pmt =
    r === 0 ? (goal - current) / n : (fvNeeded * r) / (growthFactor - 1);
  const reached = valid && pmt <= 0;
  const totalDeposits = pmt * n;
  const interestEarned = goal - current - totalDeposits;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Goal amount">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
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
        <Field label="Current savings">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(e.target.value)}
          />
        </Field>
        <Field label="Years to goal">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </Field>
        <Field label="Annual return (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={annualReturn}
            onChange={(e) => setAnnualReturn(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Required monthly deposit"
          accent
          value={valid ? (reached ? "Goal already reached" : formatMoney(pmt, currency)) : "—"}
        />
        <Stat
          label="Total deposits"
          value={valid && !reached ? formatMoney(totalDeposits, currency) : "—"}
        />
        <Stat
          label="Interest earned"
          value={valid && !reached ? formatMoney(interestEarned, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
