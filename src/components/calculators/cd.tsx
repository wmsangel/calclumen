"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const FREQUENCIES = [
  { value: "1", label: "Annually" },
  { value: "2", label: "Semiannually" },
  { value: "4", label: "Quarterly" },
  { value: "12", label: "Monthly" },
  { value: "365", label: "Daily" },
];

export function CdCalculator() {
  const [principal, setPrincipal] = useState("10000");
  const [annualRate, setAnnualRate] = useState("4.5");
  const [termYears, setTermYears] = useState("2");
  const [compoundingFrequency, setCompoundingFrequency] = useState("12");
  const [currency, setCurrency] = useState("USD");

  const p = num(principal);
  const rate = num(annualRate);
  const term = num(termYears);
  const n = num(compoundingFrequency);
  const valid =
    p > 0 && Number.isFinite(rate) && term > 0 && Number.isFinite(n) && n > 0;

  const periodic = rate / 100 / n;
  const maturity = p * Math.pow(1 + periodic, n * term);
  const interest = maturity - p;
  const apy = Math.pow(1 + periodic, n) - 1;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Principal">
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
        <Field label="Annual rate (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={annualRate}
            onChange={(e) => setAnnualRate(e.target.value)}
          />
        </Field>
        <Field label="Term (years)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={termYears}
            onChange={(e) => setTermYears(e.target.value)}
          />
        </Field>
        <Field label="Compounding frequency">
          <select
            className="field"
            value={compoundingFrequency}
            onChange={(e) => setCompoundingFrequency(e.target.value)}
          >
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Maturity value"
          accent
          value={valid ? formatMoney(maturity, currency) : "—"}
        />
        <Stat
          label="Total interest"
          value={valid ? formatMoney(interest, currency) : "—"}
        />
        <Stat
          label="APY"
          value={valid ? `${formatNumber(apy * 100, 2)}%` : "—"}
        />
      </div>
    </ToolCard>
  );
}
