"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

type Mode = "Add VAT" | "Remove VAT";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const PRESETS = ["20", "5", "0"];

export function VatCalculator() {
  const [mode, setMode] = useState<Mode>("Add VAT");
  const [amount, setAmount] = useState("100");
  const [vatRate, setVatRate] = useState("20");
  const [currency, setCurrency] = useState("GBP");

  const a = num(amount);
  const rate = num(vatRate);
  const valid = a > 0 && Number.isFinite(rate);

  let vat = NaN;
  let net = NaN;
  let gross = NaN;
  if (valid) {
    if (mode === "Add VAT") {
      vat = (a * rate) / 100;
      net = a;
      gross = a + vat;
    } else {
      net = a / (1 + rate / 100);
      vat = a - net;
      gross = a;
    }
  }

  return (
    <ToolCard>
      <Segmented<Mode>
        value={mode}
        onChange={setMode}
        options={[
          { value: "Add VAT", label: "Add VAT" },
          { value: "Remove VAT", label: "Remove VAT" },
        ]}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Amount">
          <div className="flex gap-2">
            <NumberInput value={amount} onChange={setAmount} />
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
        <Field label="VAT rate (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={vatRate}
            onChange={(e) => setVatRate(e.target.value)}
          />
          <div className="seg mt-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                data-on={p === vatRate}
                onClick={() => setVatRate(p)}
              >
                {p}%
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="VAT amount"
          accent
          value={valid ? formatMoney(vat, currency) : "—"}
        />
        <Stat
          label="Net price"
          value={valid ? formatMoney(net, currency) : "—"}
        />
        <Stat
          label="Gross price"
          value={valid ? formatMoney(gross, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
