"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Category = "length" | "weight" | "temperature" | "volume";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

/** Base-unit factors: value_in_base = value * factor. */
const FACTORS: Record<Exclude<Category, "temperature">, Record<string, number>> = {
  length: {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    mi: 1609.344,
    yd: 0.9144,
    ft: 0.3048,
    in: 0.0254,
  },
  weight: {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    t: 1000,
    lb: 0.45359237,
    oz: 0.0283495231,
    st: 6.35029318,
  },
  volume: {
    L: 1,
    mL: 0.001,
    "gal (US)": 3.785411784,
    qt: 0.946352946,
    pt: 0.473176473,
    cup: 0.2365882365,
    "fl oz": 0.0295735296,
  },
};

const TEMP_UNITS = ["C", "F", "K"] as const;

/** Ordered unit list per category. */
function unitsFor(cat: Category): string[] {
  if (cat === "temperature") return [...TEMP_UNITS];
  return Object.keys(FACTORS[cat]);
}

/** Sensible default from/to units and value per category. */
const DEFAULTS: Record<Category, { from: string; to: string; value: string }> = {
  length: { from: "km", to: "mi", value: "10" },
  weight: { from: "kg", to: "lb", value: "10" },
  temperature: { from: "C", to: "F", value: "20" },
  volume: { from: "L", to: "gal (US)", value: "10" },
};

/** Temperature conversion via Celsius — never uses the factor path. */
function convertTemp(value: number, from: string, to: string): number {
  let c: number;
  if (from === "C") c = value;
  else if (from === "F") c = ((value - 32) * 5) / 9;
  else c = value - 273.15; // K

  if (to === "C") return c;
  if (to === "F") return (c * 9) / 5 + 32;
  return c + 273.15; // K
}

function convert(cat: Category, value: number, from: string, to: string): number {
  if (cat === "temperature") return convertTemp(value, from, to);
  const factors = FACTORS[cat];
  const base = value * factors[from];
  return base / factors[to];
}

/** formatNumber(n, 4) with trailing zeros trimmed for a tidy result. */
function formatResult(n: number): string {
  const raw = formatNumber(n, 4);
  return raw.includes(".") ? raw.replace(/\.?0+$/, "") : raw;
}

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: "length", label: "Length" },
  { value: "weight", label: "Weight" },
  { value: "temperature", label: "Temperature" },
  { value: "volume", label: "Volume" },
];

export function UnitConverter() {
  const [category, setCategory] = useState<Category>("length");
  const [value, setValue] = useState(DEFAULTS.length.value);
  const [from, setFrom] = useState(DEFAULTS.length.from);
  const [to, setTo] = useState(DEFAULTS.length.to);

  const units = unitsFor(category);

  function changeCategory(cat: Category) {
    setCategory(cat);
    const u = unitsFor(cat);
    setFrom(u[0]);
    setTo(u[1]);
    setValue(DEFAULTS[cat].value);
  }

  const x = num(value);
  const valid = Number.isFinite(x) && x >= 0;
  const result = valid ? convert(category, x, from, to) : NaN;
  const display = valid && Number.isFinite(result) ? formatResult(result) : "—";

  return (
    <ToolCard>
      <Segmented<Category>
        value={category}
        onChange={changeCategory}
        options={CATEGORY_OPTIONS}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Field label="Value">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Field>
        <Field label="From">
          <select
            className="field"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            aria-label="From unit"
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </Field>
        <Field label="To">
          <select
            className="field"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            aria-label="To unit"
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Stat
          label="Result"
          accent
          value={valid && Number.isFinite(result) ? `${display} ${to}` : "—"}
          sub={
            valid && Number.isFinite(result)
              ? `${formatResult(x)} ${from} = ${display} ${to}`
              : "Enter a value to convert"
          }
        />
      </div>
    </ToolCard>
  );
}
