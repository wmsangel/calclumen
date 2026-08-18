"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

function category(backEnd: number): string {
  if (backEnd <= 36) return "Healthy";
  if (backEnd <= 43) return "Manageable";
  return "High";
}

export function DtiCalculator() {
  const [income, setIncome] = useState("5000");
  const [housing, setHousing] = useState("1500");
  const [other, setOther] = useState("500");
  const [currency, setCurrency] = useState("USD");

  const inc = num(income);
  const house = Number.isFinite(num(housing)) ? num(housing) : 0;
  const debt = Number.isFinite(num(other)) ? num(other) : 0;
  const valid = inc > 0;

  const frontEnd = valid ? (house / inc) * 100 : 0;
  const backEnd = valid ? ((house + debt) / inc) * 100 : 0;
  const money = (v: number) => formatMoney(v, currency);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Gross monthly income">
          <div className="flex gap-2">
            <NumberInput value={income} onChange={setIncome} />
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
        <Field label="Monthly housing payment" hint="Rent or mortgage, taxes and insurance.">
          <NumberInput value={housing} onChange={setHousing} />
        </Field>
        <Field label="Other monthly debt payments" hint="Loans, cards, and other minimums.">
          <NumberInput value={other} onChange={setOther} />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="DTI ratio"
          accent
          value={valid ? `${formatNumber(backEnd, 1)}%` : "—"}
          sub="Back-end (all debts)"
        />
        <Stat
          label="Front-end ratio"
          value={valid ? `${formatNumber(frontEnd, 1)}%` : "—"}
          sub="Housing only"
        />
        <Stat
          label="Category"
          value={valid ? category(backEnd) : "—"}
          sub={valid ? `Total debt ${money(house + debt)}/mo` : undefined}
        />
      </div>

      {valid ? (
        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)] mb-2">
            Where you stand
          </div>
          <div className="relative h-3 w-full flex rounded-full overflow-hidden">
            <div style={{ width: "60%", background: "var(--good)" }} />
            <div style={{ width: "11.67%", background: "var(--warn)" }} />
            <div style={{ width: "28.33%", background: "var(--bad)" }} />
            <div
              className="absolute -top-1 h-5 w-[3px] rounded bg-[var(--ink)]"
              style={{ left: `${Math.min(Math.max(backEnd, 0), 60) / 60 * 100}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-[var(--ink-soft)]">
            <span>0%</span>
            <span>36% healthy</span>
            <span>43%</span>
            <span>60%+</span>
          </div>
        </div>
      ) : null}
    </ToolCard>
  );
}
