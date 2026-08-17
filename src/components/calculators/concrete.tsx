"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function ConcreteCalculator() {
  const [length, setLength] = useState("10");
  const [width, setWidth] = useState("10");
  const [thickness, setThickness] = useState("4");
  const [quantity, setQuantity] = useState("1");
  const [pricePerYard, setPricePerYard] = useState("0");
  const [currency, setCurrency] = useState("USD");

  const l = num(length);
  const w = num(width);
  const t = num(thickness);
  const q = num(quantity);
  const price = num(pricePerYard);

  const valid = l > 0 && w > 0 && t > 0 && q > 0;

  const volumeFt3 = l * w * (t / 12) * q;
  const yards3 = volumeFt3 / 27;
  const bags60 = Math.ceil(volumeFt3 / 0.45);
  const bags80 = Math.ceil(volumeFt3 / 0.6);
  const cost = yards3 * price;
  const hasPrice = Number.isFinite(price) && price > 0;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Length (ft)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
        </Field>
        <Field label="Width (ft)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
        </Field>
        <Field label="Thickness (inches)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={thickness}
            onChange={(e) => setThickness(e.target.value)}
          />
        </Field>
        <Field label="Quantity">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Field>
        <Field label="Price per cubic yard (optional)">
          <div className="flex gap-2">
            <NumberInput value={pricePerYard} onChange={setPricePerYard} />
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
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Cubic yards"
          accent
          value={valid ? `${formatNumber(yards3, 2)} yd³` : "—"}
        />
        <Stat
          label="Cubic feet"
          value={valid ? `${formatNumber(volumeFt3, 1)} ft³` : "—"}
        />
        <Stat
          label="Bags needed"
          value={valid ? `${bags60} × 60 lb  or  ${bags80} × 80 lb` : "—"}
        />
        <Stat
          label="Estimated cost"
          value={valid && hasPrice ? formatMoney(cost, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
