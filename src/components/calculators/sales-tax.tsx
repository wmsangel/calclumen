"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Mode = "Add tax" | "Remove tax";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function SalesTaxCalculator() {
  const [mode, setMode] = useState<Mode>("Add tax");
  const [amount, setAmount] = useState("100");
  const [taxRate, setTaxRate] = useState("7.25");
  const [currency, setCurrency] = useState("USD");

  const a = num(amount);
  const rate = num(taxRate);
  const valid = a > 0 && Number.isFinite(rate);

  let tax = NaN;
  let net = NaN;
  let total = NaN;
  if (valid) {
    if (mode === "Add tax") {
      tax = (a * rate) / 100;
      net = a;
      total = a + tax;
    } else {
      net = a / (1 + rate / 100);
      tax = a - net;
      total = a;
    }
  }

  return (
    <ToolCard>
      <Segmented<Mode>
        value={mode}
        onChange={setMode}
        options={[
          { value: "Add tax", label: "Add tax" },
          { value: "Remove tax", label: "Remove tax" },
        ]}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Amount">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
        <Field label="Tax rate (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Tax amount"
          accent
          value={valid ? formatMoney(tax, currency) : "—"}
        />
        <Stat
          label="Pre-tax price"
          value={valid ? formatMoney(net, currency) : "—"}
        />
        <Stat
          label="Total price"
          value={valid ? formatMoney(total, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
