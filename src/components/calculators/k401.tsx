"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { AreaChart, MultiBar } from "@/components/chart";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function K401Calculator() {
  const [currentAge, setCurrentAge] = useState("30");
  const [retirementAge, setRetirementAge] = useState("65");
  const [annualSalary, setAnnualSalary] = useState("60000");
  const [currentBalance, setCurrentBalance] = useState("20000");
  const [contributionPercent, setContributionPercent] = useState("6");
  const [employerMatchPercent, setEmployerMatchPercent] = useState("50");
  const [employerMatchLimit, setEmployerMatchLimit] = useState("6");
  const [annualReturn, setAnnualReturn] = useState("7");
  const [salaryGrowth, setSalaryGrowth] = useState("2");
  const [currency, setCurrency] = useState("USD");

  const ca = num(currentAge);
  const ra = num(retirementAge);
  const sal0 = num(annualSalary);
  const cb = num(currentBalance);
  const cp = num(contributionPercent);
  const emp = num(employerMatchPercent);
  const eml = num(employerMatchLimit);
  const ar = num(annualReturn);
  const sg = num(salaryGrowth);

  const valid =
    Number.isFinite(ca) &&
    Number.isFinite(ra) &&
    ra > ca &&
    sal0 >= 0 &&
    cb >= 0 &&
    Number.isFinite(cp) &&
    Number.isFinite(emp) &&
    Number.isFinite(eml) &&
    Number.isFinite(ar) &&
    Number.isFinite(sg);

  let bal = NaN;
  let totalEmp = NaN;
  let totalMatch = NaN;
  let growth = NaN;
  let balances: number[] = [];

  if (valid) {
    let b = cb;
    let salary = sal0;
    let te = 0;
    let tm = 0;
    const years = Math.max(0, Math.round(ra - ca));
    balances = [cb];
    for (let y = 0; y < years; y++) {
      const empContrib = (salary * cp) / 100;
      const matched = Math.min(cp, eml) / 100;
      const empr = (salary * matched * emp) / 100;
      const monthlyAdd = (empContrib + empr) / 12;
      for (let m = 1; m <= 12; m++) {
        b = b * (1 + ar / 100 / 12) + monthlyAdd;
      }
      te += empContrib;
      tm += empr;
      salary *= 1 + sg / 100;
      balances.push(b);
    }
    bal = b;
    totalEmp = te;
    totalMatch = tm;
    growth = bal - cb - totalEmp - totalMatch;
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
        <Field label="Annual salary">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={annualSalary}
              onChange={(e) => setAnnualSalary(e.target.value)}
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
        <Field label="Current 401(k) balance">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={currentBalance}
            onChange={(e) => setCurrentBalance(e.target.value)}
          />
        </Field>
        <Field label="Your contribution (% of salary)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={contributionPercent}
            onChange={(e) => setContributionPercent(e.target.value)}
          />
        </Field>
        <Field label="Employer match (% of your contribution)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={employerMatchPercent}
            onChange={(e) => setEmployerMatchPercent(e.target.value)}
          />
        </Field>
        <Field label="Employer match limit (% of salary)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={employerMatchLimit}
            onChange={(e) => setEmployerMatchLimit(e.target.value)}
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
        <Field label="Salary growth (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={salaryGrowth}
            onChange={(e) => setSalaryGrowth(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="401(k) at retirement"
          accent
          value={valid ? formatMoney(bal, currency) : "—"}
        />
        <Stat
          label="Total employee contributions"
          value={valid ? formatMoney(totalEmp, currency) : "—"}
        />
        <Stat
          label="Total employer match"
          value={valid ? formatMoney(totalMatch, currency) : "—"}
        />
        <Stat
          label="Total growth"
          value={valid ? formatMoney(growth, currency) : "—"}
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
              { label: "Starting balance", value: Math.max(0, cb), color: "var(--ink-soft)" },
              { label: "Your contributions", value: Math.max(0, totalEmp), color: "var(--accent)" },
              { label: "Employer match", value: Math.max(0, totalMatch), color: "var(--accent-2)" },
              { label: "Investment growth", value: Math.max(0, growth), color: "var(--good)" },
            ]}
          />
        </div>
      ) : null}
    </ToolCard>
  );
}
