"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

// Common roof pitches as rise (inches) per 12 inches of run.
const PITCHES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18];

export function RoofingCalculator() {
  const [length, setLength] = useState("50");
  const [width, setWidth] = useState("30");
  const [pitch, setPitch] = useState("6");
  const [waste, setWaste] = useState("10");
  const [bundlesPerSquare, setBundlesPerSquare] = useState("3");
  const [pricePerBundle, setPricePerBundle] = useState("0");
  const [currency, setCurrency] = useState("USD");

  const l = num(length);
  const w = num(width);
  const rise = num(pitch);
  const wastePct = num(waste);
  const bps = num(bundlesPerSquare);
  const price = num(pricePerBundle);

  const valid = l > 0 && w > 0 && rise >= 0 && wastePct >= 0 && bps > 0;

  // Sloped area = footprint × pitch factor, where factor = hypotenuse / run.
  const factor = Math.sqrt(1 + (rise / 12) ** 2);
  const angle = (Math.atan(rise / 12) * 180) / Math.PI;
  const footprint = l * w;
  const roofArea = footprint * factor;
  const withWaste = roofArea * (1 + wastePct / 100);
  const squares = withWaste / 100;
  const bundles = Math.ceil(squares * bps);
  // Synthetic underlayment rolls typically cover ~1,000 sq ft (10 squares).
  const underlayRolls = Math.ceil(withWaste / 1000);
  const hasPrice = Number.isFinite(price) && price > 0;
  const cost = bundles * price;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Roof length incl. overhang (ft)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
        </Field>
        <Field label="Roof width incl. overhang (ft)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
        </Field>
        <Field label="Roof pitch (rise per 12 in of run)">
          <select
            className="field"
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
          >
            {PITCHES.map((p) => (
              <option key={p} value={p}>
                {p}/12{p === 0 ? " (flat)" : ""}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Waste %" hint="10% for simple gables, 15% or more for hips and valleys">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={waste}
            onChange={(e) => setWaste(e.target.value)}
          />
        </Field>
        <Field label="Bundles per square">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={bundlesPerSquare}
            onChange={(e) => setBundlesPerSquare(e.target.value)}
          />
        </Field>
        <Field label="Price per bundle (optional)">
          <div className="flex gap-2">
            <NumberInput value={pricePerBundle} onChange={setPricePerBundle} />
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
          label="Shingle bundles needed"
          accent
          value={valid ? formatNumber(bundles, 0) : "—"}
          sub={valid ? `${formatNumber(squares, 2)} roofing squares incl. waste` : undefined}
        />
        <Stat
          label="Roof surface area"
          value={valid ? `${formatNumber(roofArea, 0)} sq ft` : "—"}
          sub={valid ? `${formatNumber(footprint, 0)} sq ft footprint` : undefined}
        />
        <Stat
          label="Pitch factor"
          value={valid ? `× ${formatNumber(factor, 3)}` : "—"}
          sub={valid ? `${formatNumber(angle, 1)}° slope` : undefined}
        />
        <Stat
          label="Underlayment rolls"
          value={valid ? formatNumber(underlayRolls, 0) : "—"}
          sub="at ~1,000 sq ft per synthetic roll"
        />
        <Stat
          label="Estimated shingle cost"
          value={valid && hasPrice ? formatMoney(cost, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
