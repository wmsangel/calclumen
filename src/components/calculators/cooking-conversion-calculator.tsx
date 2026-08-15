"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

/** Milliliter equivalents per unit. */
const FACTORS: Record<string, number> = {
  tsp: 4.92892,
  tbsp: 14.7868,
  "fl oz": 29.5735,
  cup: 236.588,
  ml: 1,
  liter: 1000,
  pint: 473.176,
  quart: 946.353,
};

const UNITS = Object.keys(FACTORS);
const COMMON = ["tsp", "tbsp", "cup", "ml"];

function convert(value: number, from: string, to: string): number {
  const ml = value * FACTORS[from];
  return ml / FACTORS[to];
}

/** formatNumber(n, 4) with trailing zeros trimmed for a tidy result. */
function formatResult(n: number): string {
  const raw = formatNumber(n, 4);
  return raw.includes(".") ? raw.replace(/\.?0+$/, "") : raw;
}

export function CookingConversionCalculator() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("cup");
  const [toUnit, setToUnit] = useState("ml");

  const x = num(value);
  const valid = Number.isFinite(x);

  const result = valid ? convert(x, fromUnit, toUnit) : NaN;
  const display =
    valid && Number.isFinite(result) ? formatResult(result) : "—";

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
            onChange={(e) => setFromUnit(e.target.value)}
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
            onChange={(e) => setToUnit(e.target.value)}
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
              ? `${formatResult(x)} ${fromUnit} = ${display} ${toUnit}`
              : "Enter a value to convert"
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
              {COMMON.map((u) => (
                <tr key={u} className="border-t border-[var(--rule)]">
                  <td className="py-2">{u}</td>
                  <td className="py-2 text-right numeral">
                    {formatResult(convert(x, fromUnit, u))}
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
