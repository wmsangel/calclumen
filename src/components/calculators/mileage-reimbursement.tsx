"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

type Purpose = "business" | "medical" | "charity" | "custom";

const PRESET: Record<Exclude<Purpose, "custom">, number> = {
  business: 0.67,
  medical: 0.21,
  charity: 0.14,
};

export function MileageReimbursementCalculator() {
  const [miles, setMiles] = useState("100");
  const [purpose, setPurpose] = useState<Purpose>("business");
  const [customRate, setCustomRate] = useState("0.67");
  const [currency, setCurrency] = useState("USD");

  const rate =
    purpose === "custom" ? num(customRate) : PRESET[purpose];
  const m = num(miles);
  const valid = m >= 0 && rate >= 0 && Number.isFinite(m) && Number.isFinite(rate);

  const money = (v: number) => formatMoney(v, currency);
  const reimbursement = valid ? m * rate : null;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Miles driven">
          <div className="flex gap-2">
            <NumberInput value={miles} onChange={setMiles} />
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
        <Field label="Purpose">
          <select
            className="field"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value as Purpose)}
            aria-label="Purpose"
          >
            <option value="business">Business (0.67)</option>
            <option value="medical">Medical/Moving (0.21)</option>
            <option value="charity">Charity (0.14)</option>
            <option value="custom">Custom</option>
          </select>
        </Field>
        {purpose === "custom" ? (
          <Field label="Rate per mile">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={customRate}
              onChange={(e) => setCustomRate(e.target.value)}
            />
          </Field>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Reimbursement"
          accent
          value={reimbursement !== null ? money(reimbursement) : "—"}
        />
        <Stat
          label="Rate per mile"
          value={valid ? formatMoney(rate, currency) : "—"}
        />
        <Stat label="Miles" value={valid ? formatNumber(m, 0) : "—"} />
      </div>
    </ToolCard>
  );
}
