"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const SCALES = ["Celsius", "Fahrenheit", "Kelvin"] as const;
type Scale = (typeof SCALES)[number];

const UNIT: Record<Scale, string> = {
  Celsius: "°C",
  Fahrenheit: "°F",
  Kelvin: "K",
};

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

/** Convert any scale to Celsius. */
function toCelsius(x: number, from: Scale): number {
  if (from === "Celsius") return x;
  if (from === "Fahrenheit") return ((x - 32) * 5) / 9;
  return x - 273.15; // Kelvin
}

/** Convert Celsius to any scale. */
function fromCelsius(c: number, to: Scale): number {
  if (to === "Celsius") return c;
  if (to === "Fahrenheit") return (c * 9) / 5 + 32;
  return c + 273.15; // Kelvin
}

export function TemperatureConverter() {
  const [value, setValue] = useState("100");
  const [from, setFrom] = useState<Scale>("Celsius");
  const [to, setTo] = useState<Scale>("Fahrenheit");

  const x = num(value);
  const valid = Number.isFinite(x);

  const celsius = valid ? toCelsius(x, from) : NaN;
  const result = valid ? fromCelsius(celsius, to) : NaN;

  const all = SCALES.map((s) => ({
    scale: s,
    unit: UNIT[s],
    value: valid ? fromCelsius(celsius, s) : NaN,
  }));

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
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
            onChange={(e) => setFrom(e.target.value as Scale)}
            aria-label="From scale"
          >
            {SCALES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="To">
          <select
            className="field"
            value={to}
            onChange={(e) => setTo(e.target.value as Scale)}
            aria-label="To scale"
          >
            {SCALES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Stat
          label="Converted value"
          accent
          value={valid ? `${formatNumber(result, 2)} ${UNIT[to]}` : "—"}
          sub={
            valid
              ? `${formatNumber(x, 2)} ${UNIT[from]} = ${formatNumber(
                  result,
                  2
                )} ${UNIT[to]}`
              : "Enter a value to convert"
          }
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {all.map((row) => (
          <Stat
            key={row.scale}
            label={row.scale}
            value={valid ? `${formatNumber(row.value, 2)} ${row.unit}` : "—"}
          />
        ))}
      </div>
    </ToolCard>
  );
}
