"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { apy } from "@/lib/math/apy";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const FREQUENCIES: { label: string; value: number }[] = [
  { label: "Annually", value: 1 },
  { label: "Semiannually", value: 2 },
  { label: "Quarterly", value: 4 },
  { label: "Monthly", value: 12 },
  { label: "Daily", value: 365 },
];

export function ApyCalculator() {
  const [rate, setRate] = useState("5");
  const [freq, setFreq] = useState("12");
  const [principal, setPrincipal] = useState("10000");
  const [years, setYears] = useState("1");
  const [currency, setCurrency] = useState("USD");

  const r = num(rate);
  const n = num(freq);
  const p = num(principal);
  const y = num(years);

  const valid = Number.isFinite(r) && n >= 1;
  const res = valid ? apy(r, n, Math.max(0, p || 0), Math.max(0, y || 0)) : null;
  const money = (x: number) => formatMoney(x, currency);
  const hasBalance = !!res && p > 0 && y > 0;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nominal interest rate (APR %)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </Field>
        <Field label="Compounding frequency">
          <select
            className="field"
            value={freq}
            onChange={(e) => setFreq(e.target.value)}
            aria-label="Compounding frequency"
          >
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Starting balance (optional)">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
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
        <Field label="Time (years, optional)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="APY (effective yield)"
          accent
          value={res ? `${formatNumber(res.apyPct, 3)}%` : "—"}
        />
        <Stat label="Ending balance" value={hasBalance ? money(res.balance) : "—"} />
        <Stat label="Interest earned" value={hasBalance ? money(res.interest) : "—"} />
      </div>

      <p className="mt-4 text-xs text-[var(--ink-soft)] leading-relaxed">
        APY is the real yearly return once compounding is counted: (1 + rate ÷ n)<sup>n</sup> − 1,
        where n is how often interest is added. The more often it compounds, the higher the APY
        for the same nominal rate — so APY is the number to compare savings accounts and CDs by,
        not the quoted APR.
      </p>
    </ToolCard>
  );
}
