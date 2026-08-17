"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const FREQUENCIES: { value: string; label: string }[] = [
  { value: "52", label: "Weekly" },
  { value: "26", label: "Biweekly" },
  { value: "24", label: "Semi-monthly" },
  { value: "12", label: "Monthly" },
];

export function PaycheckCalculator() {
  const [salary, setSalary] = useState("60000");
  const [frequency, setFrequency] = useState("26");
  const [retPct, setRetPct] = useState("5");
  const [taxRate, setTaxRate] = useState("22");

  const currency = "USD";
  const gross = num(salary);
  const freq = num(frequency);
  const ret = num(retPct);
  const tax = num(taxRate);

  const valid =
    gross > 0 &&
    freq > 0 &&
    Number.isFinite(ret) &&
    ret >= 0 &&
    ret < 100 &&
    Number.isFinite(tax) &&
    tax >= 0 &&
    tax < 100;

  const result = valid
    ? (() => {
        const retirement = (gross * ret) / 100;
        const fica = gross * 0.0765;
        const taxable = gross - retirement;
        const incomeTax = (taxable * tax) / 100;
        const net = gross - retirement - fica - incomeTax;
        const perPaycheck = net / freq;
        return {
          retirement,
          fica,
          incomeTax,
          net,
          perPaycheck,
          totalTaxes: fica + incomeTax,
        };
      })()
    : null;

  const money = (v: number) => formatMoney(v, currency);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Gross annual salary">
          <NumberInput value={salary} onChange={setSalary} />
        </Field>
        <Field label="Pay frequency">
          <select
            className="field"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            aria-label="Pay frequency"
          >
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Retirement contribution (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={retPct}
            onChange={(e) => setRetPct(e.target.value)}
          />
        </Field>
        <Field label="Estimated income tax rate (federal + state)">
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
          label="Take-home per paycheck"
          accent
          value={result ? money(result.perPaycheck) : "—"}
        />
        <Stat label="Net annual pay" value={result ? money(result.net) : "—"} />
        <Stat
          label="Total taxes"
          value={result ? money(result.totalTaxes) : "—"}
        />
        <Stat
          label="Retirement contribution"
          value={result ? money(result.retirement) : "—"}
        />
      </div>
    </ToolCard>
  );
}
