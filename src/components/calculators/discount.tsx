"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState("80");
  const [discountPercent, setDiscountPercent] = useState("25");
  const [secondDiscount, setSecondDiscount] = useState("0");
  const [taxRate, setTaxRate] = useState("0");
  const [currency, setCurrency] = useState("USD");

  const op = num(originalPrice);
  const d1 = num(discountPercent);
  const d2 = num(secondDiscount);
  const tax = num(taxRate);

  const valid =
    op > 0 &&
    Number.isFinite(d1) &&
    Number.isFinite(d2) &&
    Number.isFinite(tax);

  let sale = NaN;
  let saved = NaN;
  let effectiveDiscount = NaN;
  let final = NaN;

  if (valid) {
    sale = op * (1 - d1 / 100);
    if (d2 > 0) sale *= 1 - d2 / 100;
    saved = op - sale;
    effectiveDiscount = (1 - sale / op) * 100;
    final = sale * (1 + tax / 100);
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Original price">
          <div className="flex gap-2">
            <NumberInput value={originalPrice} onChange={setOriginalPrice} />
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
        <Field label="Discount (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
          />
        </Field>
        <Field label="Second discount (%)" hint="Optional, stacked">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={secondDiscount}
            onChange={(e) => setSecondDiscount(e.target.value)}
          />
        </Field>
        <Field label="Tax rate (%)" hint="Optional">
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
          label="Sale price"
          accent
          value={valid ? formatMoney(sale, currency) : "—"}
        />
        <Stat
          label="Amount saved"
          value={valid ? formatMoney(saved, currency) : "—"}
        />
        <Stat
          label="Effective discount"
          value={valid ? `${formatNumber(effectiveDiscount)}%` : "—"}
        />
        <Stat
          label="Final price with tax"
          value={valid ? formatMoney(final, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
