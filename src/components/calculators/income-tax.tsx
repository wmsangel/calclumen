"use client";

import { useState } from "react";
import { formatMoney, formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

type Filing = "single" | "mfj";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const DEDUCTION: Record<Filing, number> = {
  single: 14600,
  mfj: 29200,
};

const BRACKETS: Record<Filing, [number, number][]> = {
  single: [
    [0.1, 11600],
    [0.12, 47150],
    [0.22, 100525],
    [0.24, 191950],
    [0.32, 243725],
    [0.35, 609350],
    [0.37, Infinity],
  ],
  mfj: [
    [0.1, 23200],
    [0.12, 94300],
    [0.22, 201050],
    [0.24, 383900],
    [0.32, 487450],
    [0.35, 731200],
    [0.37, Infinity],
  ],
};

function computeTax(income: number, filing: Filing) {
  const deduction = DEDUCTION[filing];
  const taxable = Math.max(0, income - deduction);
  const brackets = BRACKETS[filing];

  let tax = 0;
  let prevCap = 0;
  let marginal = brackets[0][0];

  for (const [rate, upTo] of brackets) {
    if (taxable > prevCap) {
      tax += rate * (Math.min(taxable, upTo) - prevCap);
    }
    if (taxable > prevCap) marginal = rate;
    prevCap = upTo;
  }

  const effective = income > 0 ? (tax / income) * 100 : 0;
  const afterTax = income - tax;

  return { taxable, tax, effective, marginal: marginal * 100, afterTax };
}

export function IncomeTaxCalculator() {
  const [income, setIncome] = useState("75000");
  const [filing, setFiling] = useState<Filing>("single");

  const currency = "USD";
  const inc = num(income);
  const valid = inc >= 0 && Number.isFinite(inc);

  const result = valid ? computeTax(inc, filing) : null;
  const money = (v: number) => formatMoney(v, currency);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Annual income">
          <NumberInput value={income} onChange={setIncome} />
        </Field>
        <Field label="Filing status">
          <Segmented<Filing>
            value={filing}
            onChange={setFiling}
            options={[
              { value: "single", label: "Single" },
              { value: "mfj", label: "Married filing jointly" },
            ]}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat label="Federal tax" accent value={result ? money(result.tax) : "—"} />
        <Stat
          label="After-tax income"
          value={result ? money(result.afterTax) : "—"}
        />
        <Stat
          label="Effective rate"
          value={result ? `${formatNumber(result.effective)}%` : "—"}
        />
        <Stat
          label="Marginal rate"
          value={result ? `${formatNumber(result.marginal)}%` : "—"}
        />
      </div>
    </ToolCard>
  );
}
