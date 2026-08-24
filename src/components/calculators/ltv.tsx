"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";
import { SplitBar } from "@/components/chart";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function LtvCalculator() {
  const [value, setValue] = useState("300000");
  const [down, setDown] = useState("60000");
  const [currency, setCurrency] = useState("USD");

  const v = num(value);
  const d = num(down);
  const valid =
    v > 0 && Number.isFinite(v) && Number.isFinite(d) && d >= 0 && d <= v;

  const loan = valid ? v - d : NaN;
  const ltv = valid ? (loan / v) * 100 : NaN;
  const downPct = valid ? (d / v) * 100 : NaN;
  const pmi = valid && ltv > 80;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Property value">
          <div className="flex gap-2">
            <NumberInput value={value} onChange={setValue} />
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
        <Field label="Down payment">
          <NumberInput value={down} onChange={setDown} />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Loan-to-value (LTV)"
          accent
          value={valid ? `${formatNumber(ltv, 2)}%` : "—"}
        />
        <Stat
          label="Loan amount"
          value={valid ? formatMoney(loan, currency) : "—"}
        />
        <Stat
          label="Down payment"
          value={valid ? `${formatNumber(downPct, 2)}%` : "—"}
        />
      </div>

      {valid ? (
        <>
          <div className="mt-6">
            <SplitBar
              a={loan}
              b={d}
              aLabel={`Loan ${formatMoney(loan, currency)}`}
              bLabel={`Down payment ${formatMoney(d, currency)}`}
            />
          </div>
          <p className="mt-3 text-sm text-[var(--ink-soft)] leading-relaxed">
            {pmi
              ? `Your LTV is above 80%, so a lender will usually require private mortgage insurance (PMI) until you reach 80% — a larger down payment removes it.`
              : `Your LTV is 80% or below, so you typically avoid private mortgage insurance (PMI).`}
          </p>
        </>
      ) : null}
    </ToolCard>
  );
}
