"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function RetirementSavingsCalculator() {
  const [currentAge, setCurrentAge] = useState("30");
  const [retirementAge, setRetirementAge] = useState("65");
  const [currentSavings, setCurrentSavings] = useState("25000");
  const [monthlyContribution, setMonthlyContribution] = useState("500");
  const [annualReturn, setAnnualReturn] = useState("7");
  const [annualContributionIncrease, setAnnualContributionIncrease] =
    useState("0");
  const [currency, setCurrency] = useState("USD");

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
    cs >= 0 &&
    mc >= 0 &&
    Number.isFinite(ar) &&
    Number.isFinite(inc);

  let fv = NaN;
  let totalContributions = NaN;
  let growth = NaN;

  if (valid) {
    const r = ar / 100 / 12;
    const n = Math.max(0, Math.round((ra - ca) * 12));
    let totalContrib: number;

    if (inc === 0) {
      fv =
        cs * Math.pow(1 + r, n) +
        (r === 0 ? mc * n : (mc * (Math.pow(1 + r, n) - 1)) / r);
      totalContrib = mc * n;
    } else {
      let balAcc = cs;
      let c = mc;
      let contribSum = 0;
      for (let m = 1; m <= n; m++) {
        balAcc = balAcc * (1 + r) + c;
        contribSum += c;
        if (m % 12 === 0) c *= 1 + inc / 100;
      }
      fv = balAcc;
      totalContrib = contribSum;
    }

    totalContributions = cs + totalContrib;
    growth = fv - totalContributions;
  }

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
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
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
        <Field label="Monthly contribution">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(e.target.value)}
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
        <Stat
          label="Balance at retirement"
          accent
          value={valid ? formatMoney(fv, currency) : "—"}
        />
        <Stat
          label="Total contributions"
          value={valid ? formatMoney(totalContributions, currency) : "—"}
        />
        <Stat
          label="Total growth"
          value={valid ? formatMoney(growth, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
