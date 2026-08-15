"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const FREQUENCIES = [
  { value: "1", label: "Annually" },
  { value: "2", label: "Semiannually" },
  { value: "4", label: "Quarterly" },
  { value: "12", label: "Monthly" },
  { value: "365", label: "Daily" },
];

/** Future value of a lump sum plus monthly contributions with compound interest. */
function compound(
  principal: number,
  annualRatePct: number,
  years: number,
  n: number,
  monthly: number,
) {
  const fvPrincipal = principal * Math.pow(1 + annualRatePct / 100 / n, n * years);
  const i = annualRatePct / 100 / 12;
  const N = 12 * years;
  const fvContributions =
    i === 0 ? monthly * N : monthly * ((Math.pow(1 + i, N) - 1) / i);
  const futureValue = fvPrincipal + fvContributions;
  const totalContributions = principal + monthly * N;
  const totalInterest = futureValue - totalContributions;
  return { futureValue, totalContributions, totalInterest };
}

export function CompoundInterestCalculator() {
  const [deposit, setDeposit] = useState("10000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("10");
  const [frequency, setFrequency] = useState("12");
  const [monthly, setMonthly] = useState("200");
  const [currency, setCurrency] = useState("USD");

  const p = num(deposit);
  const r = num(rate);
  const t = num(years);
  const n = num(frequency);
  const c = num(monthly);
  const valid =
    p >= 0 &&
    Number.isFinite(r) &&
    t > 0 &&
    n > 0 &&
    Number.isFinite(c) &&
    c >= 0;

  const { futureValue, totalContributions, totalInterest } = valid
    ? compound(p, r, t, n, c)
    : { futureValue: NaN, totalContributions: NaN, totalInterest: NaN };

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Initial deposit">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
            />
            <select
              className="field w-24"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              aria-label="Currency"
            >
              {CURRENCIES.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </div>
        </Field>
        <Field label="Annual interest rate (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
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
        <Field label="Compounding frequency">
          <select
            className="field"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            aria-label="Compounding frequency"
          >
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Monthly contribution">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Future value"
          accent
          value={valid ? formatMoney(futureValue, currency) : "—"}
        />
        <Stat
          label="Total contributions"
          value={valid ? formatMoney(totalContributions, currency) : "—"}
        />
        <Stat
          label="Total interest"
          value={valid ? formatMoney(totalInterest, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
