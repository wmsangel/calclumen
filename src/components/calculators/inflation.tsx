"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";
import { AreaChart } from "@/components/chart";

type Direction = "Future value" | "Buying power";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function InflationCalculator() {
  const [direction, setDirection] = useState<Direction>("Future value");
  const [amount, setAmount] = useState("1000");
  const [annualInflationRate, setAnnualInflationRate] = useState("3");
  const [years, setYears] = useState("10");
  const [currency, setCurrency] = useState("USD");

  const a = num(amount);
  const rate = num(annualInflationRate);
  const y = num(years);
  const valid = a > 0 && Number.isFinite(rate) && y >= 0;

  const factor = Math.pow(1 + rate / 100, y);
  const adjusted = direction === "Future value" ? a * factor : a / factor;
  const change = adjusted - a;
  const changePct = (adjusted / a - 1) * 100;

  const yearsInt = Number.isFinite(y) ? Math.min(Math.max(Math.round(y), 0), 100) : 0;
  const curve =
    valid && yearsInt > 0
      ? Array.from({ length: yearsInt + 1 }, (_, i) => {
          const f = Math.pow(1 + rate / 100, i);
          return direction === "Future value" ? a * f : a / f;
        })
      : [];

  return (
    <ToolCard>
      <Segmented<Direction>
        value={direction}
        onChange={setDirection}
        options={[
          { value: "Future value", label: "Future value" },
          { value: "Buying power", label: "Buying power" },
        ]}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Amount">
          <div className="flex gap-2">
            <NumberInput value={amount} onChange={setAmount} />
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
        <Field label="Annual inflation rate (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={annualInflationRate}
            onChange={(e) => setAnnualInflationRate(e.target.value)}
          />
        </Field>
        <Field label="Years">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Adjusted amount"
          accent
          value={valid ? formatMoney(adjusted, currency) : "—"}
        />
        <Stat
          label="Total change"
          value={
            valid
              ? `${change > 0 ? "+" : ""}${formatMoney(change, currency)}`
              : "—"
          }
        />
        <Stat
          label="Change %"
          value={valid ? `${formatNumber(changePct)}%` : "—"}
        />
      </div>

      {curve.length > 1 ? (
        <div className="mt-6">
          <div className="text-sm font-medium mb-2">
            {direction === "Future value"
              ? "Value over time"
              : "Buying power over time"}
          </div>
          <AreaChart
            data={curve}
            color={direction === "Future value" ? "var(--accent)" : "var(--bad)"}
          />
        </div>
      ) : null}
    </ToolCard>
  );
}
