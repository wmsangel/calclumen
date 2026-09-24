"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { AreaChart, MultiBar } from "@/components/chart";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function College529Calculator() {
  const [childAge, setChildAge] = useState("5");
  const [collegeAge, setCollegeAge] = useState("18");
  const [balance, setBalance] = useState("5000");
  const [monthly, setMonthly] = useState("300");
  const [annualReturn, setAnnualReturn] = useState("6");
  const [annualCost, setAnnualCost] = useState("25000");
  const [costInflation, setCostInflation] = useState("5");
  const [currency, setCurrency] = useState("USD");

  const ca = num(childAge);
  const co = num(collegeAge);
  const cb = num(balance);
  const m = num(monthly);
  const ar = num(annualReturn);
  const cost = num(annualCost);
  const infl = num(costInflation);

  const valid =
    Number.isFinite(ca) &&
    Number.isFinite(co) &&
    co > ca &&
    ca >= 0 &&
    cb >= 0 &&
    Number.isFinite(m) &&
    m >= 0 &&
    Number.isFinite(ar) &&
    Number.isFinite(cost) &&
    cost >= 0 &&
    Number.isFinite(infl) &&
    infl >= 0;

  let fv = NaN;
  let totalContrib = NaN;
  let growth = NaN;
  let cost4yr = NaN;
  let coverage = NaN;
  let surplus = NaN;
  let balances: number[] = [];

  if (valid) {
    const years = Math.round(co - ca);
    const mr = ar / 100 / 12;
    let b = cb;
    balances = [cb];
    for (let y = 0; y < years; y++) {
      for (let mo = 0; mo < 12; mo++) {
        b = b * (1 + mr) + m;
      }
      balances.push(b);
    }
    fv = b;
    totalContrib = cb + m * years * 12;
    growth = fv - totalContrib;

    // Projected cost of four years of college, each year inflated from today.
    let total = 0;
    for (let k = 0; k < 4; k++) {
      total += cost * Math.pow(1 + infl / 100, years + k);
    }
    cost4yr = total;
    coverage = total > 0 ? (fv / total) * 100 : 0;
    surplus = fv - total;
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Child's current age">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={childAge}
            onChange={(e) => setChildAge(e.target.value)}
          />
        </Field>
        <Field label="Age starting college">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={collegeAge}
            onChange={(e) => setCollegeAge(e.target.value)}
          />
        </Field>
        <Field label="Current 529 balance">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
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
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
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
        <Field label="Current annual college cost">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={annualCost}
            onChange={(e) => setAnnualCost(e.target.value)}
          />
        </Field>
        <Field label="College cost inflation (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={costInflation}
            onChange={(e) => setCostInflation(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="529 balance at college"
          accent
          value={valid ? formatMoney(fv, currency) : "—"}
        />
        <Stat
          label="Projected 4-year cost"
          value={valid ? formatMoney(cost4yr, currency) : "—"}
        />
        <Stat
          label="Total contributions"
          value={valid ? formatMoney(totalContrib, currency) : "—"}
        />
        <Stat
          label="Investment growth"
          value={valid ? formatMoney(growth, currency) : "—"}
        />
        <Stat
          label="Covered by savings"
          value={valid ? `${coverage.toFixed(0)}%` : "—"}
        />
        <Stat
          label={valid && surplus < 0 ? "Projected shortfall" : "Projected surplus"}
          value={valid ? formatMoney(Math.abs(surplus), currency) : "—"}
        />
      </div>

      {valid && balances.length > 1 ? (
        <div className="mt-6 space-y-5">
          <div>
            <div className="text-sm font-medium mb-2">Balance growth to college</div>
            <AreaChart data={balances} />
          </div>
          <MultiBar
            segments={[
              { label: "Starting balance", value: Math.max(0, cb), color: "var(--ink-soft)" },
              { label: "Your contributions", value: Math.max(0, totalContrib - cb), color: "var(--accent)" },
              { label: "Investment growth", value: Math.max(0, growth), color: "var(--good)" },
            ]}
          />
        </div>
      ) : null}
    </ToolCard>
  );
}
