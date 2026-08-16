"use client";

import { useEffect, useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { AreaChart, SplitBar } from "@/components/chart";
import { ResultActions } from "@/components/result-actions";
import { readParam, syncParams } from "@/lib/share";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const FREQUENCIES = [
  { value: "1", label: "Annually" },
  { value: "2", label: "Semiannually" },
  { value: "4", label: "Quarterly" },
  { value: "12", label: "Monthly" },
  { value: "365", label: "Daily" },
];

function balanceAt(
  principal: number,
  annualRatePct: number,
  y: number,
  n: number,
  monthly: number,
) {
  const fvPrincipal = principal * Math.pow(1 + annualRatePct / 100 / n, n * y);
  const i = annualRatePct / 100 / 12;
  const N = 12 * y;
  const fvContributions =
    i === 0 ? monthly * N : monthly * ((Math.pow(1 + i, N) - 1) / i);
  return fvPrincipal + fvContributions;
}

export function CompoundInterestCalculator() {
  const [deposit, setDeposit] = useState("10000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("10");
  const [frequency, setFrequency] = useState("12");
  const [monthly, setMonthly] = useState("200");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const map: Record<string, (v: string) => void> = {
      deposit: setDeposit,
      rate: setRate,
      years: setYears,
      freq: setFrequency,
      monthly: setMonthly,
    };
    for (const [k, set] of Object.entries(map)) {
      const v = readParam(k);
      if (v) set(v);
    }
    const c = readParam("cur");
    if (c && (CURRENCIES as readonly string[]).includes(c)) setCurrency(c);
  }, []);

  useEffect(() => {
    syncParams({ deposit, rate, years, freq: frequency, monthly, cur: currency });
  }, [deposit, rate, years, frequency, monthly, currency]);

  const p = num(deposit);
  const r = num(rate);
  const t = num(years);
  const n = num(frequency);
  const c = num(monthly);
  const valid =
    p >= 0 && Number.isFinite(r) && t > 0 && t <= 100 && n > 0 && Number.isFinite(c) && c >= 0;

  const years0 = valid ? Math.round(t) : 0;
  const balances = valid
    ? Array.from({ length: years0 + 1 }, (_, y) => balanceAt(p, r, y, n, c))
    : [];
  const futureValue = valid ? balanceAt(p, r, t, n, c) : NaN;
  const totalContributions = valid ? p + c * 12 * t : NaN;
  const totalInterest = valid ? futureValue - totalContributions : NaN;
  const money = (v: number) => formatMoney(v, currency);

  const summary = valid
    ? `${money(p)} at ${r}% for ${t} years with ${money(c)}/mo → future value ${money(
        futureValue,
      )} (interest ${money(totalInterest)}). via CalcLumen`
    : "";

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
        <Stat label="Future value" accent value={valid ? money(futureValue) : "—"} />
        <Stat
          label="Total contributions"
          value={valid ? money(totalContributions) : "—"}
        />
        <Stat label="Total interest" value={valid ? money(totalInterest) : "—"} />
      </div>

      {valid && balances.length > 1 ? (
        <>
          <div className="mt-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)] mb-2">
              Growth over {years0} years
            </div>
            <AreaChart data={balances} />
            <div className="mt-4">
              <SplitBar
                a={totalContributions}
                b={totalInterest}
                aLabel={`Contributions ${money(totalContributions)}`}
                bLabel={`Interest ${money(totalInterest)}`}
              />
            </div>
          </div>
          <div className="mt-5">
            <ResultActions summary={summary} />
          </div>
        </>
      ) : null}
    </ToolCard>
  );
}
