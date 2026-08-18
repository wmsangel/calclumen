"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function FlooringCalculator() {
  const [length, setLength] = useState("12");
  const [width, setWidth] = useState("12");
  const [coverage, setCoverage] = useState("20");
  const [waste, setWaste] = useState("10");
  const [pricePerBox, setPricePerBox] = useState("0");
  const [currency, setCurrency] = useState("USD");

  const l = num(length);
  const w = num(width);
  const cov = num(coverage);
  const wastePct = num(waste);
  const price = num(pricePerBox);

  const valid = l > 0 && w > 0 && cov > 0 && wastePct >= 0;

  const area = l * w;
  const withWaste = area * (1 + wastePct / 100);
  const boxes = cov > 0 ? Math.ceil(withWaste / cov) : 0;
  const cost = boxes * price;
  const hasPrice = Number.isFinite(price) && price > 0;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Room length (ft)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
        </Field>
        <Field label="Room width (ft)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
        </Field>
        <Field label="Coverage per box (sq ft)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={coverage}
            onChange={(e) => setCoverage(e.target.value)}
          />
        </Field>
        <Field label="Waste %">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={waste}
            onChange={(e) => setWaste(e.target.value)}
          />
        </Field>
        <Field label="Price per box (optional)">
          <div className="flex gap-2">
            <NumberInput value={pricePerBox} onChange={setPricePerBox} />
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
          label="Floor area"
          accent
          value={valid ? `${formatNumber(area, 1)} sq ft` : "—"}
        />
        <Stat
          label="Area with waste"
          value={valid ? `${formatNumber(withWaste, 1)} sq ft` : "—"}
        />
        <Stat
          label="Boxes needed"
          value={valid ? formatNumber(boxes, 0) : "—"}
        />
        <Stat
          label="Estimated cost"
          value={valid && hasPrice ? formatMoney(cost, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
