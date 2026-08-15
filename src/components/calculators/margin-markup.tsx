"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Mode = "price" | "margin" | "markup";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function MarginMarkupCalculator() {
  const [mode, setMode] = useState<Mode>("price");
  const [cost, setCost] = useState("40");
  const [sellingPrice, setSellingPrice] = useState("60");
  const [marginPercent, setMarginPercent] = useState("33.33");
  const [markupPercent, setMarkupPercent] = useState("50");
  const [currency, setCurrency] = useState("USD");

  const c = num(cost);
  const sp = num(sellingPrice);
  const mg = num(marginPercent);
  const mk = num(markupPercent);

  let price = NaN;
  let profit = NaN;
  let margin = NaN;
  let markup = NaN;
  let valid = false;

  if (c > 0) {
    if (mode === "price" && Number.isFinite(sp)) {
      price = sp;
      profit = price - c;
      margin = price === 0 ? NaN : (profit / price) * 100;
      markup = (profit / c) * 100;
      valid = Number.isFinite(margin);
    } else if (mode === "margin" && Number.isFinite(mg) && mg < 100) {
      price = c / (1 - mg / 100);
      profit = price - c;
      markup = (profit / c) * 100;
      margin = mg;
      valid = Number.isFinite(price);
    } else if (mode === "markup" && Number.isFinite(mk)) {
      price = c * (1 + mk / 100);
      profit = price - c;
      margin = price === 0 ? NaN : (profit / price) * 100;
      markup = mk;
      valid = Number.isFinite(margin);
    }
  }

  const secondField =
    mode === "price" ? (
      <Field label="Selling price">
        <input
          className="field"
          type="number"
          inputMode="decimal"
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
        />
      </Field>
    ) : mode === "margin" ? (
      <Field label="Margin (%)">
        <input
          className="field"
          type="number"
          inputMode="decimal"
          value={marginPercent}
          onChange={(e) => setMarginPercent(e.target.value)}
        />
      </Field>
    ) : (
      <Field label="Markup (%)">
        <input
          className="field"
          type="number"
          inputMode="decimal"
          value={markupPercent}
          onChange={(e) => setMarkupPercent(e.target.value)}
        />
      </Field>
    );

  return (
    <ToolCard>
      <Segmented<Mode>
        value={mode}
        onChange={setMode}
        options={[
          { value: "price", label: "Price" },
          { value: "margin", label: "Margin %" },
          { value: "markup", label: "Markup %" },
        ]}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Cost">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
            <select
              className="field w-24"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              aria-label="Currency"
            >
              {CURRENCIES.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </div>
        </Field>
        {secondField}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Selling price"
          accent
          value={valid ? formatMoney(price, currency) : "—"}
        />
        <Stat
          label="Profit"
          value={valid ? formatMoney(profit, currency) : "—"}
        />
        <Stat
          label="Margin %"
          value={valid ? `${formatNumber(margin)}%` : "—"}
        />
        <Stat
          label="Markup %"
          value={valid ? `${formatNumber(markup)}%` : "—"}
        />
      </div>
    </ToolCard>
  );
}
