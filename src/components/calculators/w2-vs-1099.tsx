"use client";

import { useState } from "react";
import { formatMoney, formatPercent } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";
import { ResultActions } from "@/components/result-actions";
import { w2Vs1099 } from "@/lib/math/w2-vs-1099";
import { TAX_YEAR, type Filing } from "@/lib/math/federal-tax-2026";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));
const usd = (n: number) => formatMoney(Math.round(n), "USD");

export function W2Vs1099Calculator() {
  const [filing, setFiling] = useState<Filing>("single");
  const [salary, setSalary] = useState("90000");
  const [health, setHealth] = useState("7000");
  const [match, setMatch] = useState("3600");
  const [pto, setPto] = useState("25");
  const [w2Ret, setW2Ret] = useState("0");
  const [gross, setGross] = useState("110000");
  const [expenses, setExpenses] = useState("5000");
  const [selfHealth, setSelfHealth] = useState("8400");
  const [selfRet, setSelfRet] = useState("0");
  const [qbi, setQbi] = useState<"yes" | "no">("yes");
  const [statePct, setStatePct] = useState("0");

  const sal = num(salary);
  const g = num(gross);
  const valid = sal >= 0 && g >= 0 && Number.isFinite(sal) && Number.isFinite(g) && (sal > 0 || g > 0);
  const r = valid
    ? w2Vs1099({
        filing,
        w2Salary: sal || 0,
        employerHealth: num(health) || 0,
        employerMatch: num(match) || 0,
        paidDaysOff: num(pto) || 0,
        w2Retirement: num(w2Ret) || 0,
        gross1099: g || 0,
        businessExpenses: num(expenses) || 0,
        selfHealth: num(selfHealth) || 0,
        selfRetirement: num(selfRet) || 0,
        applyQbi: qbi === "yes",
        statePct: num(statePct) || 0,
      })
    : null;

  const summary = r
    ? `W-2 ${usd(sal)} vs 1099 ${usd(g)} (${TAX_YEAR}): W-2 take-home ${usd(r.w2.takeHome)} + benefits ${usd(r.w2.benefitsValue)} = ${usd(r.w2.totalValue)}; 1099 take-home ${usd(r.c1099.takeHome)} (SE tax ${usd(r.c1099.payrollTax)}). ${r.difference >= 0 ? "1099 ahead by" : "W-2 ahead by"} ${usd(Math.abs(r.difference))}. Break-even 1099 rate: ${usd(r.breakEven1099)} (${r.breakEvenMultiple.toFixed(2)}× salary).`
    : "";

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Filing status">
          <Segmented<Filing> value={filing} onChange={setFiling} options={[{ value: "single", label: "Single" }, { value: "mfj", label: "Married filing jointly" }]} />
        </Field>
        <Field label="State income tax rate (%)" hint="Flat estimate; 0 for states without a wage income tax">
          <input className="field" type="number" inputMode="decimal" value={statePct} onChange={(e) => setStatePct(e.target.value)} />
        </Field>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="card p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)] mb-3">W-2 job offer</div>
          <div className="grid gap-4">
            <Field label="Annual salary"><NumberInput value={salary} onChange={setSalary} /></Field>
            <Field label="Employer-paid health insurance (per year)" hint="The employer's share of premiums"><NumberInput value={health} onChange={setHealth} /></Field>
            <Field label="Employer 401(k) match (per year)"><NumberInput value={match} onChange={setMatch} /></Field>
            <Field label="Paid days off per year" hint="Vacation + holidays + sick days, valued at salary ÷ 260">
              <input className="field" type="number" inputMode="numeric" value={pto} onChange={(e) => setPto(e.target.value)} />
            </Field>
            <Field label="Your pre-tax 401(k) contribution (per year)"><NumberInput value={w2Ret} onChange={setW2Ret} /></Field>
          </div>
        </div>
        <div className="card p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)] mb-3">1099 contract</div>
          <div className="grid gap-4">
            <Field label="Gross 1099 income (per year)"><NumberInput value={gross} onChange={setGross} /></Field>
            <Field label="Business expenses (per year)" hint="Equipment, software, home office, mileage…"><NumberInput value={expenses} onChange={setExpenses} /></Field>
            <Field label="Health insurance you buy yourself (per year)" hint="Deductible above the line"><NumberInput value={selfHealth} onChange={setSelfHealth} /></Field>
            <Field label="SEP-IRA / Solo 401(k) contribution (per year)"><NumberInput value={selfRet} onChange={setSelfRet} /></Field>
            <Field label="Apply the 20% QBI deduction?">
              <Segmented<"yes" | "no"> value={qbi} onChange={setQbi} options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]} />
            </Field>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Verdict" accent value={r ? (r.difference >= 0 ? `1099 ahead by ${usd(r.difference)}` : `W-2 ahead by ${usd(-r.difference)}`) : "—"} sub={r ? "Take-home plus benefits and retirement, per year" : undefined} />
        <Stat label="Break-even 1099 rate" value={r ? usd(r.breakEven1099) : "—"} sub={r ? `${r.breakEvenMultiple.toFixed(2)}× the salary, or ${usd(r.breakEven1099 / 2080)}/hour at 2,080 h` : undefined} />
        <Stat label="W-2 total value" value={r ? usd(r.w2.totalValue) : "—"} sub={r ? `Take-home ${usd(r.w2.takeHome)} + benefits ${usd(r.w2.benefitsValue)}${num(w2Ret) > 0 ? ` + your 401(k) ${usd(num(w2Ret))}` : ""}` : undefined} />
        <Stat label="1099 total value" value={r ? usd(r.c1099.totalValue) : "—"} sub={r ? `Take-home ${usd(r.c1099.takeHome)} after health${num(selfRet) > 0 ? ` + retirement ${usd(num(selfRet))}` : ""}` : undefined} />
        <Stat label="Taxes as W-2" value={r ? usd(r.w2.payrollTax + r.w2.additionalMedicare + r.w2.incomeTax + r.w2.stateTax) : "—"} sub={r ? `FICA ${usd(r.w2.payrollTax)} · income tax ${usd(r.w2.incomeTax)} · ${formatPercent(r.w2.effectiveRate * 100, 1)} of salary` : undefined} />
        <Stat label="Taxes as 1099" value={r ? usd(r.c1099.payrollTax + r.c1099.additionalMedicare + r.c1099.incomeTax + r.c1099.stateTax) : "—"} sub={r ? `SE tax ${usd(r.c1099.payrollTax)} · income tax ${usd(r.c1099.incomeTax)} · ${formatPercent(r.c1099.effectiveRate * 100, 1)} of profit` : undefined} />
      </div>

      {r ? (
        <div className="mt-4">
          <ResultActions summary={summary} />
        </div>
      ) : null}
    </ToolCard>
  );
}
