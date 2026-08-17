"use client";

import { useEffect, useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { AreaChart, SplitBar } from "@/components/chart";
import { ResultActions } from "@/components/result-actions";
import { NumberInput } from "@/components/number-input";
import { readParam, syncParams } from "@/lib/share";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function RetirementSavingsCalculator() {
  const [currentAge, setCurrentAge] = useState("30");
  const [retirementAge, setRetirementAge] = useState("65");
  const [currentSavings, setCurrentSavings] = useState("25000");
  const [monthlyContribution, setMonthlyContribution] = useState("500");
  const [annualReturn, setAnnualReturn] = useState("7");
  const [annualContributionIncrease, setAnnualContributionIncrease] = useState("0");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const map: Record<string, (v: string) => void> = {
      ca: setCurrentAge,
      ra: setRetirementAge,
      savings: setCurrentSavings,
      monthly: setMonthlyContribution,
      ret: setAnnualReturn,
      inc: setAnnualContributionIncrease,
    };
    for (const [k, set] of Object.entries(map)) {
      const v = readParam(k);
      if (v) set(v);
    }
    const c = readParam("cur");
    if (c && (CURRENCIES as readonly string[]).includes(c)) setCurrency(c);
  }, []);

  useEffect(() => {
    syncParams({
      ca: currentAge,
      ra: retirementAge,
      savings: currentSavings,
      monthly: monthlyContribution,
      ret: annualReturn,
      inc: annualContributionIncrease,
      cur: currency,
    });
  }, [
    currentAge,
    retirementAge,
    currentSavings,
    monthlyContribution,
    annualReturn,
    annualContributionIncrease,
    currency,
  ]);

  const ca = num(currentAge);
  const ra = num(retirementAge);
  const cs = num(currentSavings);
  const mc = num(monthlyContribution);
  const ar = num(annualReturn);
  const inc = num(annualContributionIncrease);

  const valid =
    Number.isFinite(ca) &&
    Number.isFinite(ra) &&
    ra > ca &&
    ra - ca <= 100 &&
    cs >= 0 &&
    mc >= 0 &&
    Number.isFinite(ar) &&
    Number.isFinite(inc);

  let fv = NaN;
  let totalContributions = NaN;
  let growth = NaN;
  const balances: number[] = [];

  if (valid) {
    const r = ar / 100 / 12;
    const n = Math.max(0, Math.round((ra - ca) * 12));
    let bal = cs;
    let c = mc;
    let contribSum = 0;
    balances.push(cs);
    for (let m = 1; m <= n; m++) {
      bal = bal * (1 + r) + c;
      contribSum += c;
      if (m % 12 === 0) {
        c *= 1 + inc / 100;
        balances.push(bal);
      }
    }
    if (n % 12 !== 0) balances.push(bal);
    fv = bal;
    totalContributions = cs + contribSum;
    growth = fv - totalContributions;
  }

  const money = (v: number) => formatMoney(v, currency);
  const summary = valid
    ? `Retirement: from age ${ca} to ${ra}, ${money(cs)} + ${money(
        mc,
      )}/mo at ${ar}% → ${money(fv)} at retirement (growth ${money(growth)}). via CalcLumen`
    : "";

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Current age">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={currentAge}
            onChange={(e) => setCurrentAge(e.target.value)}
          />
        </Field>
        <Field label="Retirement age">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={retirementAge}
            onChange={(e) => setRetirementAge(e.target.value)}
          />
        </Field>
        <Field label="Current savings">
          <div className="flex gap-2">
            <NumberInput value={currentSavings} onChange={setCurrentSavings} />
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
        <Field label="Monthly contribution">
          <NumberInput
            value={monthlyContribution}
            onChange={setMonthlyContribution}
          />
        </Field>
        <Field label="Annual return (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={annualReturn}
            onChange={(e) => setAnnualReturn(e.target.value)}
          />
        </Field>
        <Field label="Annual contribution increase (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={annualContributionIncrease}
            onChange={(e) => setAnnualContributionIncrease(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label="Balance at retirement" accent value={valid ? money(fv) : "—"} />
        <Stat
          label="Total contributions"
          value={valid ? money(totalContributions) : "—"}
        />
        <Stat label="Total growth" value={valid ? money(growth) : "—"} />
      </div>

      {valid && balances.length > 1 ? (
        <>
          <div className="mt-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)] mb-2">
              Projected balance
            </div>
            <AreaChart data={balances} />
            <div className="mt-4">
              <SplitBar
                a={totalContributions}
                b={growth}
                aLabel={`Contributions ${money(totalContributions)}`}
                bLabel={`Growth ${money(growth)}`}
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
