"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const UNITS = ["US MPG", "UK MPG", "L/100km", "km/L"] as const;
type Unit = (typeof UNITS)[number];

/** Convert a value in the given unit to the L/100km pivot. */
function toPivot(value: number, unit: Unit): number {
  switch (unit) {
    case "US MPG":
      return 235.215 / value;
    case "UK MPG":
      return 282.481 / value;
    case "km/L":
      return 100 / value;
    default:
      return value; // L/100km
  }
}

/** Convert an L/100km pivot value to the given unit. */
function fromPivot(l: number, unit: Unit): number {
  switch (unit) {
    case "US MPG":
      return 235.215 / l;
    case "UK MPG":
      return 282.481 / l;
    case "km/L":
      return 100 / l;
    default:
      return l; // L/100km
  }
}

function convert(value: number, from: Unit, to: Unit): number {
  const l = toPivot(value, from);
  return fromPivot(l, to);
}

export function FuelEconomyConverter() {
  const [value, setValue] = useState("30");
  const [fromUnit, setFromUnit] = useState<Unit>("US MPG");
  const [toUnit, setToUnit] = useState<Unit>("L/100km");

  const x = num(value);
  const valid = x > 0;

  const result = valid ? convert(x, fromUnit, toUnit) : NaN;
  const display =
    valid && Number.isFinite(result) ? formatNumber(result, 2) : "—";

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
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as Unit)}
            aria-label="From unit"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </Field>
        <Field label="To">
          <select
            className="field"
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value as Unit)}
            aria-label="To unit"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Stat
          label="Converted value"
          accent
          value={
            valid && Number.isFinite(result) ? `${display} ${toUnit}` : "—"
          }
          sub={
            valid
              ? `${formatNumber(x, 2)} ${fromUnit} = ${display} ${toUnit}`
              : "Enter a value greater than zero"
          }
        />
      </div>

      {valid ? (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--ink-soft)]">
                <th className="py-2 font-medium">Unit</th>
                <th className="py-2 font-medium text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {UNITS.map((u) => (
                <tr key={u} className="border-t border-[var(--rule)]">
                  <td className="py-2">{u}</td>
                  <td className="py-2 text-right numeral">
                    {formatNumber(convert(x, fromUnit, u), 2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </ToolCard>
  );
}
