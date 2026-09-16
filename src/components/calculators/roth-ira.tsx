"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { AreaChart, MultiBar } from "@/components/chart";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function RothIraCalculator() {
  const [currentAge, setCurrentAge] = useState("30");
  const [retirementAge, setRetirementAge] = useState("65");
  const [currentBalance, setCurrentBalance] = useState("10000");
  const [annualContribution, setAnnualContribution] = useState("7000");
  const [annualReturn, setAnnualReturn] = useState("7");
  const [taxRate, setTaxRate] = useState("15");
  const [currency, setCurrency] = useState("USD");

  const ca = num(currentAge);
  const ra = num(retirementAge);
  const cb = num(currentBalance);
  const contrib = num(annualContribution);
  const ar = num(annualReturn);
  const tr = num(taxRate);

  const valid =
    Number.isFinite(ca) &&
    Number.isFinite(ra) &&
    ra > ca &&
    cb >= 0 &&
    contrib >= 0 &&
    Number.isFinite(ar) &&
    Number.isFinite(tr) &&
    tr >= 0 &&
    tr < 100;

  let bal = NaN;
  let totalContrib = NaN;
  let growth = NaN;
  let taxableEnd = NaN;
  let taxAdvantage = NaN;
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
    // In a taxable brokerage the growth would be taxed at withdrawal; a Roth
    // pays no tax on qualified withdrawals. Approximate the taxable equivalent
    // by taxing total gains at the capital-gains rate.
    taxableEnd = totalContrib + Math.max(0, growth) * (1 - tr / 100);
    taxAdvantage = bal - taxableEnd;
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
        <Field label="Current Roth IRA balance">
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
        <Field label="Capital-gains tax rate (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Roth IRA at retirement (tax-free)"
          accent
          value={valid ? formatMoney(bal, currency) : "—"}
        />
        <Stat
          label="Total contributions"
          value={valid ? formatMoney(totalContrib, currency) : "—"}
        />
        <Stat
          label="Tax-free growth"
          value={valid ? formatMoney(growth, currency) : "—"}
        />
        <Stat
          label="Tax saved vs taxable account"
          value={valid ? formatMoney(taxAdvantage, currency) : "—"}
        />
      </div>

      {valid && balances.length > 1 ? (
        <div className="mt-6 space-y-5">
          <div>
            <div className="text-sm font-medium mb-2">
              Balance growth to retirement
            </div>
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
                label: "Tax-free growth",
                value: Math.max(0, growth),
                color: "var(--good)",
              },
            ]}
          />
        </div>
      ) : null}
    </ToolCard>
  );
}
