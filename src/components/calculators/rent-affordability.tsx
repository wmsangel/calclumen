"use client";

import { useEffect, useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { ResultActions } from "@/components/result-actions";
import { NumberInput } from "@/components/number-input";
import { readParam, syncParams } from "@/lib/share";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function RentAffordabilityCalculator() {
  const [income, setIncome] = useState("5000");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const i = readParam("income");
    const c = readParam("cur");
    if (i) setIncome(i);
    if (c && (CURRENCIES as readonly string[]).includes(c)) setCurrency(c);
  }, []);

  useEffect(() => {
    syncParams({ income, cur: currency });
  }, [income, currency]);

  const inc = num(income);
  const valid = inc > 0;

  const comfortable = valid ? inc * 0.25 : null;
  const recommended = valid ? inc * 0.3 : null;
  const stretch = valid ? inc * 0.35 : null;
  const money = (v: number) => formatMoney(v, currency);

  const summary =
    valid && recommended !== null && comfortable !== null && stretch !== null
      ? `On ${money(
          inc,
        )} gross monthly income — recommended max rent ${money(
          recommended,
        )} (30%), comfortable ${money(comfortable)} (25%), stretch ${money(
          stretch,
        )} (35%). via CalcLumen`
      : "";

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Gross monthly income">
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
          label="Recommended max rent"
          accent
          value={recommended !== null ? money(recommended) : "—"}
        />
        <Stat
          label="Comfortable"
          value={comfortable !== null ? money(comfortable) : "—"}
        />
        <Stat label="Stretch" value={stretch !== null ? money(stretch) : "—"} />
      </div>

      {valid ? (
        <div className="mt-5">
          <ResultActions summary={summary} />
        </div>
      ) : null}
    </ToolCard>
  );
}
