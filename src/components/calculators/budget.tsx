"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function BudgetCalculator() {
  const [income, setIncome] = useState("4000");
  const [currency, setCurrency] = useState("USD");

  const inc = num(income);
  const valid = inc > 0;

  const needs = inc * 0.5;
  const wants = inc * 0.3;
  const savings = inc * 0.2;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Monthly after-tax income">
          <div className="flex gap-2">
            <NumberInput value={income} onChange={setIncome} />
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
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Needs — 50%"
          accent
          value={valid ? formatMoney(needs, currency) : "—"}
        />
        <Stat
          label="Wants — 30%"
          value={valid ? formatMoney(wants, currency) : "—"}
        />
        <Stat
          label="Savings & debt — 20%"
          value={valid ? formatMoney(savings, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
