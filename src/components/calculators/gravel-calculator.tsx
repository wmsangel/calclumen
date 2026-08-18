"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const MATERIALS = [
  { label: "Gravel", density: 1.5 },
  { label: "Mulch", density: 0.5 },
  { label: "Topsoil", density: 1.1 },
  { label: "Sand", density: 1.35 },
] as const;

export function GravelCalculator() {
  const [length, setLength] = useState("10");
  const [width, setWidth] = useState("10");
  const [depth, setDepth] = useState("2");
  const [material, setMaterial] = useState("Gravel");
  const [pricePerYard, setPricePerYard] = useState("0");
  const [currency, setCurrency] = useState("USD");

  const l = num(length);
  const w = num(width);
  const d = num(depth);
  const price = num(pricePerYard);

  const density =
    MATERIALS.find((m) => m.label === material)?.density ?? 1.5;

  const valid = l > 0 && w > 0 && d > 0;

  const volumeFt3 = l * w * (d / 12);
  const yards3 = volumeFt3 / 27;
  const tons = yards3 * density;
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
        <Field label="Depth (in)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
          />
        </Field>
        <Field label="Material">
          <select
            className="field"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          >
            {MATERIALS.map((m) => (
              <option key={m.label} value={m.label}>
                {m.label}
              </option>
            ))}
          </select>
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
          label="Weight"
          value={valid ? `${formatNumber(tons, 2)} tons` : "—"}
        />
        <Stat
          label="Estimated cost"
          value={valid && hasPrice ? formatMoney(cost, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
