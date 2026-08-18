"use client";

import { useEffect, useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { ResultActions } from "@/components/result-actions";
import { NumberInput } from "@/components/number-input";
import { readParam, syncParams } from "@/lib/share";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function EmergencyFundCalculator() {
  const [expenses, setExpenses] = useState("3000");
  const [months, setMonths] = useState("6");
  const [savings, setSavings] = useState("5000");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const e = readParam("expenses");
    const m = readParam("months");
    const s = readParam("savings");
    const c = readParam("cur");
    if (e) setExpenses(e);
    if (m) setMonths(m);
    if (s) setSavings(s);
    if (c && (CURRENCIES as readonly string[]).includes(c)) setCurrency(c);
  }, []);

  useEffect(() => {
    syncParams({ expenses, months, savings, cur: currency });
  }, [expenses, months, savings, currency]);

  const exp = num(expenses);
  const m = num(months);
  const sav = num(savings);
  const valid =
    exp > 0 && Number.isFinite(m) && m > 0 && Number.isFinite(sav) && sav >= 0;

  const target = valid ? exp * m : null;
  const stillNeeded = valid ? Math.max(0, exp * m - sav) : null;
  const monthsCovered = valid ? (exp > 0 ? sav / exp : 0) : null;
  const money = (v: number) => formatMoney(v, currency);

  const summary =
    valid && target !== null && stillNeeded !== null && monthsCovered !== null
      ? `Emergency fund target ${money(target)} (${m} months of ${money(
          exp,
        )} expenses) — ${money(
          stillNeeded,
        )} still to save, currently ${formatNumber(
          monthsCovered,
          1,
        )} months covered. via CalcLumen`
      : "";

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Monthly essential expenses">
          <div className="flex gap-2">
            <NumberInput value={expenses} onChange={setExpenses} />
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
        <Field label="Months of coverage">
          <select
            className="field"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
          >
            {[3, 6, 9, 12].map((v) => (
              <option key={v} value={v}>
                {v} months
              </option>
            ))}
          </select>
        </Field>
        <Field label="Current savings">
          <NumberInput value={savings} onChange={setSavings} />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Target fund"
          accent
          value={target !== null ? money(target) : "—"}
        />
        <Stat
          label="Still to save"
          value={stillNeeded !== null ? money(stillNeeded) : "—"}
        />
        <Stat
          label="Months currently covered"
          value={monthsCovered !== null ? formatNumber(monthsCovered, 1) : "—"}
        />
      </div>

      {valid ? (
        <div className="mt-5">
          <ResultActions summary={summary} />
        </div>
      ) : null}
    </ToolCard>
  );
}
