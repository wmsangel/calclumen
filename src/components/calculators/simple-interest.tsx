"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState("5000");
  const [annualRate, setAnnualRate] = useState("6");
  const [timeYears, setTimeYears] = useState("3");
  const [currency, setCurrency] = useState("USD");

  const p = num(principal);
  const rate = num(annualRate);
  const time = num(timeYears);
  const valid =
    p > 0 && Number.isFinite(rate) && Number.isFinite(time) && time > 0;

  const interest = (p * rate * time) / 100;
  const total = p + interest;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Principal">
          <div className="flex gap-2">
            <NumberInput value={principal} onChange={setPrincipal} />
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
        <Field label="Annual rate (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={annualRate}
            onChange={(e) => setAnnualRate(e.target.value)}
          />
        </Field>
        <Field label="Time (years)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={timeYears}
            onChange={(e) => setTimeYears(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Interest amount"
          accent
          value={valid ? formatMoney(interest, currency) : "—"}
        />
        <Stat
          label="Total amount"
          value={valid ? formatMoney(total, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
