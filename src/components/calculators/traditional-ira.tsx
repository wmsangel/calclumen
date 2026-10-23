"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { AreaChart, MultiBar } from "@/components/chart";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function TraditionalIraCalculator() {
  const [currentAge, setCurrentAge] = useState("30");
  const [retirementAge, setRetirementAge] = useState("65");
  const [currentBalance, setCurrentBalance] = useState("10000");
  const [annualContribution, setAnnualContribution] = useState("7000");
  const [annualReturn, setAnnualReturn] = useState("7");
  const [currentTaxRate, setCurrentTaxRate] = useState("22");
  const [retirementTaxRate, setRetirementTaxRate] = useState("15");
  const [currency, setCurrency] = useState("USD");

  const ca = num(currentAge);
  const ra = num(retirementAge);
  const cb = num(currentBalance);
  const contrib = num(annualContribution);
  const ar = num(annualReturn);
  const now = num(currentTaxRate);
  const later = num(retirementTaxRate);

  const valid =
    Number.isFinite(ca) &&
    Number.isFinite(ra) &&
    ra > ca &&
    cb >= 0 &&
    contrib >= 0 &&
    Number.isFinite(ar) &&
    Number.isFinite(now) &&
    now >= 0 &&
    now < 100 &&
    Number.isFinite(later) &&
    later >= 0 &&
    later < 100;

  let bal = NaN;
  let totalContrib = NaN;
  let growth = NaN;
  let afterTax = NaN;
  let upfrontTaxSaved = NaN;
  let balances: number[] = [];

  if (valid) {
    let b = cb;
    const monthlyAdd = contrib / 12;
    const years = Math.max(0, Math.round(ra - ca));
    balances = [cb];
    for (let y = 0; y < years; y++) {
      for (let m = 1; m <= 12; m++) {
        b = b * (1 + ar / 100 / 12) + monthlyAdd;
      }
      balances.push(b);
    }
    bal = b;
    totalContrib = cb + contrib * years;
    growth = bal - totalContrib;
    // A Traditional IRA grows tax-deferred; the whole balance is taxed as
    // income when withdrawn in retirement.
    afterTax = bal * (1 - later / 100);
    // Contributions are pre-tax, so each year's contribution reduces this
    // year's taxable income — a deduction worth contribution × current rate.
    upfrontTaxSaved = contrib * (now / 100);
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
        <Field label="Current Traditional IRA balance">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={currentBalance}
              onChange={(e) => setCurrentBalance(e.target.value)}
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
        <Field label="Annual contribution">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={annualContribution}
            onChange={(e) => setAnnualContribution(e.target.value)}
          />
        </Field>
        <Field label="Expected annual return (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={annualReturn}
            onChange={(e) => setAnnualReturn(e.target.value)}
          />
        </Field>
        <Field label="Tax rate now (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={currentTaxRate}
            onChange={(e) => setCurrentTaxRate(e.target.value)}
          />
        </Field>
        <Field label="Tax rate in retirement (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={retirementTaxRate}
            onChange={(e) => setRetirementTaxRate(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="IRA at retirement (before tax)"
          accent
          value={valid ? formatMoney(bal, currency) : "—"}
        />
        <Stat
          label="After-tax value in retirement"
          value={valid ? formatMoney(afterTax, currency) : "—"}
        />
        <Stat
          label="Total contributions"
          value={valid ? formatMoney(totalContrib, currency) : "—"}
        />
        <Stat
          label="Tax-deferred growth"
          value={valid ? formatMoney(growth, currency) : "—"}
        />
      </div>

      {valid ? (
        <p className="mt-3 text-xs text-[var(--ink-soft)] leading-relaxed">
          Each year&rsquo;s {formatMoney(contrib, currency)} contribution is pre-tax, cutting
          this year&rsquo;s tax bill by about {formatMoney(upfrontTaxSaved, currency)} at your{" "}
          {currentTaxRate}% rate. The trade-off: withdrawals in retirement are taxed as income.
          A Traditional IRA wins when your tax rate is lower in retirement than today.
        </p>
      ) : null}

      {valid && balances.length > 1 ? (
        <div className="mt-6 space-y-5">
          <div>
            <div className="text-sm font-medium mb-2">Balance growth to retirement</div>
            <AreaChart data={balances} />
          </div>
          <MultiBar
            segments={[
              {
                label: "Starting balance",
                value: Math.max(0, cb),
                color: "var(--ink-soft)",
              },
              {
                label: "Your contributions",
                value: Math.max(0, totalContrib - cb),
                color: "var(--accent)",
              },
              {
                label: "Tax-deferred growth",
                value: Math.max(0, growth),
                color: "var(--good)",
              },
            ]}
          />
        </div>
      ) : null}

      <p className="mt-4 text-xs text-[var(--ink-soft)] leading-relaxed">
        This is an estimate, not tax or investment advice. Traditional IRAs have annual
        contribution limits and required minimum distributions (RMDs) starting at age 73;
        early withdrawals before 59½ may incur a penalty. Check current IRS rules.
      </p>
    </ToolCard>
  );
}
