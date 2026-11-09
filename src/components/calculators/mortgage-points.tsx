"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";
import { mortgagePoints } from "@/lib/math/mortgage-points";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));
const usd = (n: number) => formatMoney(Math.round(n * 100) / 100, "USD");

function Pct({
  label,
  value,
  onChange,
  hint,
  step = "0.125",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  step?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        className="field"
        type="number"
        inputMode="decimal"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

function months(m: number): string {
  const y = Math.floor(m / 12);
  const r = m % 12;
  if (y === 0) return `${m} months`;
  return r === 0 ? `${m} months (${y} yr)` : `${m} months (${y} yr ${r} mo)`;
}

export function MortgagePointsCalculator() {
  const [loanAmount, setLoanAmount] = useState("400000");
  const [termYears, setTermYears] = useState("30");
  const [baseRate, setBaseRate] = useState("6.5");
  const [pointsRate, setPointsRate] = useState("6");
  const [points, setPoints] = useState("2");
  const [yearsKept, setYearsKept] = useState("7");

  const loan = num(loanAmount);
  const valid = loan > 0 && num(termYears) > 0;
  const r = valid
    ? mortgagePoints({
        loanAmount: loan,
        termYears: num(termYears),
        baseRatePct: num(baseRate) || 0,
        pointsRatePct: num(pointsRate) || 0,
        points: num(points) || 0,
        yearsKept: num(yearsKept) || 0,
      })
    : null;

  const verdict = !r
    ? "—"
    : r.monthlySavings <= 0
      ? "Points don't lower the payment"
      : r.netAfterYearsKept >= 0
        ? `Worth it — ahead by ${usd(r.netAfterYearsKept)}`
        : `Not worth it — behind by ${usd(-r.netAfterYearsKept)}`;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Loan amount">
          <NumberInput value={loanAmount} onChange={setLoanAmount} />
        </Field>
        <Pct label="Loan term (years)" value={termYears} onChange={setTermYears} step="1" />
        <Pct label="Rate without points (%)" value={baseRate} onChange={setBaseRate} />
        <Pct
          label="Rate with points (%)"
          value={pointsRate}
          onChange={setPointsRate}
          hint="One point usually lowers the rate by about 0.25%"
        />
        <Pct
          label="Points bought"
          value={points}
          onChange={setPoints}
          step="0.125"
          hint="Each point costs 1% of the loan"
        />
        <Pct
          label="Years you'll keep the loan"
          value={yearsKept}
          onChange={setYearsKept}
          step="1"
          hint="Until you sell or refinance"
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label={`If kept ${valid ? yearsKept : "—"} years`} accent value={verdict} />
        <Stat
          label="Break-even"
          value={!r ? "—" : r.breakEvenMonths === null ? "Never" : months(r.breakEvenMonths)}
          sub="When savings cover the cost of points"
        />
        <Stat label="Cost of points" value={r ? usd(r.pointsCost) : "—"} />
        <Stat
          label="Monthly payment"
          value={r ? `${usd(r.paymentWithPoints)} vs ${usd(r.paymentBase)}` : "—"}
          sub="With points vs without"
        />
        <Stat label="Monthly savings" value={r ? usd(r.monthlySavings) : "—"} />
        <Stat
          label="Net over the full term"
          value={r ? (r.netOverFullTerm >= 0 ? "+" : "−") + usd(Math.abs(r.netOverFullTerm)) : "—"}
          sub={r ? `Interest ${usd(r.interestWithPoints)} vs ${usd(r.interestBase)}` : undefined}
        />
      </div>
    </ToolCard>
  );
}
