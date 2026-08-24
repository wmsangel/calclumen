"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function SalesCommissionCalculator() {
  const [sales, setSales] = useState("50000");
  const [rate, setRate] = useState("5");
  const [base, setBase] = useState("0");
  const [currency, setCurrency] = useState("USD");

  const s = num(sales);
  const r = num(rate);
  const b = num(base);
  const valid = s >= 0 && Number.isFinite(s) && Number.isFinite(r) && r >= 0;

  const commission = valid ? (s * r) / 100 : NaN;
  const baseVal = Number.isFinite(b) && b >= 0 ? b : 0;
  const total = valid ? commission + baseVal : NaN;
  const effective = valid && s > 0 ? (total / s) * 100 : NaN;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Total sales">
          <div className="flex gap-2">
            <NumberInput value={sales} onChange={setSales} />
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
        <Field label="Commission rate (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </Field>
        <Field label="Base pay (optional)">
          <NumberInput value={base} onChange={setBase} />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Commission earned"
          accent
          value={valid ? formatMoney(commission, currency) : "—"}
        />
        <Stat
          label="Total earnings"
          value={valid ? formatMoney(total, currency) : "—"}
        />
        <Stat
          label="Effective rate"
          value={
            valid && Number.isFinite(effective)
              ? `${formatNumber(effective, 2)}%`
              : "—"
          }
        />
      </div>
    </ToolCard>
  );
}
