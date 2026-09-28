"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { MultiBar } from "@/components/chart";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function LifeInsuranceNeedsCalculator() {
  const [income, setIncome] = useState("60000");
  const [years, setYears] = useState("10");
  const [debts, setDebts] = useState("10000");
  const [mortgage, setMortgage] = useState("250000");
  const [education, setEducation] = useState("100000");
  const [finalExpenses, setFinalExpenses] = useState("15000");
  const [existing, setExisting] = useState("50000");
  const [currency, setCurrency] = useState("USD");

  const inc = num(income);
  const yr = num(years);
  const d = num(debts);
  const m = num(mortgage);
  const edu = num(education);
  const fe = num(finalExpenses);
  const ex = num(existing);

  const valid =
    Number.isFinite(inc) &&
    inc >= 0 &&
    Number.isFinite(yr) &&
    yr >= 0 &&
    Number.isFinite(d) &&
    d >= 0 &&
    Number.isFinite(m) &&
    m >= 0 &&
    Number.isFinite(edu) &&
    edu >= 0 &&
    Number.isFinite(fe) &&
    fe >= 0 &&
    Number.isFinite(ex) &&
    ex >= 0;

  let incomeRepl = NaN;
  let obligations = NaN;
  let gross = NaN;
  let need = NaN;

  if (valid) {
    incomeRepl = inc * yr;
    obligations = d + m + edu + fe;
    gross = incomeRepl + obligations;
    need = Math.max(0, gross - ex);
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Annual income to replace">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
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
        <Field label="Years of income to replace">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </Field>
        <Field label="Debts (credit cards, loans)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={debts}
            onChange={(e) => setDebts(e.target.value)}
          />
        </Field>
        <Field label="Mortgage balance">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={mortgage}
            onChange={(e) => setMortgage(e.target.value)}
          />
        </Field>
        <Field label="Children's education fund">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          />
        </Field>
        <Field label="Final expenses (funeral, etc.)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={finalExpenses}
            onChange={(e) => setFinalExpenses(e.target.value)}
          />
        </Field>
        <Field label="Existing life cover + savings">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={existing}
            onChange={(e) => setExisting(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Coverage you need"
          accent
          value={valid ? formatMoney(need, currency) : "—"}
        />
        <Stat
          label="Income replacement"
          value={valid ? formatMoney(incomeRepl, currency) : "—"}
        />
        <Stat
          label="Debts, mortgage, education, final"
          value={valid ? formatMoney(obligations, currency) : "—"}
        />
        <Stat
          label="Less existing cover + savings"
          value={valid ? `− ${formatMoney(ex, currency)}` : "—"}
        />
      </div>

      {valid && gross > 0 ? (
        <div className="mt-6">
          <MultiBar
            segments={[
              { label: "Income replacement", value: Math.max(0, incomeRepl), color: "var(--accent)" },
              { label: "Mortgage", value: Math.max(0, m), color: "var(--accent-2)" },
              { label: "Other debts", value: Math.max(0, d), color: "var(--ink-soft)" },
              { label: "Education", value: Math.max(0, edu), color: "var(--good)" },
              { label: "Final expenses", value: Math.max(0, fe), color: "var(--warn, #d97706)" },
            ]}
          />
        </div>
      ) : null}

      <p className="mt-4 text-sm text-[var(--ink-soft)]">
        This uses the DIME method (Debt, Income, Mortgage, Education) minus what
        you already have. Term life insurance covers large amounts like this
        cheaply — a healthy 35-year-old can often get $500k of 20-year term for
        around $25–35 a month.
      </p>
    </ToolCard>
  );
}
