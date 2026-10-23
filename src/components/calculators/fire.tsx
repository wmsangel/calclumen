"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { AreaChart } from "@/components/chart";
import { fire } from "@/lib/math/fire";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function FireCalculator() {
  const [expenses, setExpenses] = useState("40000");
  const [savings, setSavings] = useState("50000");
  const [contribution, setContribution] = useState("20000");
  const [annualReturn, setAnnualReturn] = useState("7");
  const [swr, setSwr] = useState("4");
  const [currency, setCurrency] = useState("USD");

  const ex = num(expenses);
  const sv = num(savings);
  const ct = num(contribution);
  const ar = num(annualReturn);
  const sw = num(swr);

  const valid =
    ex > 0 &&
    sv >= 0 &&
    ct >= 0 &&
    Number.isFinite(ar) &&
    Number.isFinite(sw) &&
    sw > 0;

  const res = valid ? fire(ex, sv, ct, ar, sw) : null;
  const money = (x: number) => formatMoney(x, currency);

  const yearsLabel = res
    ? res.alreadyFi
      ? "Already there 🎉"
      : res.yearsToFi == null
        ? "100+ yrs"
        : `${res.yearsToFi} yrs`
    : "—";

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Annual expenses (spending)">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
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
        <Field label="Current invested savings">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={savings}
            onChange={(e) => setSavings(e.target.value)}
          />
        </Field>
        <Field label="Annual contribution">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={contribution}
            onChange={(e) => setContribution(e.target.value)}
          />
        </Field>
        <Field label="Expected annual return (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={annualReturn}
            onChange={(e) => setAnnualReturn(e.target.value)}
          />
        </Field>
        <Field label="Safe withdrawal rate (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={swr}
            onChange={(e) => setSwr(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label="Your FIRE number" accent value={res ? money(res.fireNumber) : "—"} />
        <Stat label="Years to financial independence" value={yearsLabel} />
        <Stat
          label="Monthly spending covered"
          value={res ? money(ex / 12) : "—"}
        />
      </div>

      {res && res.balances.length > 1 && !res.alreadyFi ? (
        <div className="mt-6">
          <div className="text-sm font-medium mb-2">Path to your FIRE number</div>
          <AreaChart data={res.balances} />
        </div>
      ) : null}

      <p className="mt-4 text-xs text-[var(--ink-soft)] leading-relaxed">
        Your FIRE number is the nest egg that funds your yearly spending at a safe withdrawal
        rate — expenses ÷ rate. The common 4% rule implies 25× your annual expenses. A lower
        rate (3–3.5%) is safer for a long early retirement but needs a bigger number. This is
        an estimate in today&rsquo;s money and not financial advice.
      </p>
    </ToolCard>
  );
}
