"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const UNITS = ["m²", "ft²", "km²", "mi²", "acre", "hectare", "yd²", "cm²"] as const;
type Unit = (typeof UNITS)[number];

/** Factors to square metres: value_in_m2 = value * factor. */
const FACTORS: Record<Unit, number> = {
  "m²": 1,
  "ft²": 0.09290304,
  "km²": 1000000,
  "mi²": 2589988.110336,
  acre: 4046.8564224,
  hectare: 10000,
  "yd²": 0.83612736,
  "cm²": 0.0001,
};

function convert(value: number, from: Unit, to: Unit): number {
  const base = value * FACTORS[from];
  return base / FACTORS[to];
}

/** formatNumber(n, 4) with trailing zeros trimmed for a tidy result. */
function formatResult(n: number): string {
  const raw = formatNumber(n, 4);
  return raw.includes(".") ? raw.replace(/\.?0+$/, "") : raw;
}

export function AreaConverter() {
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState<Unit>("m²");
  const [to, setTo] = useState<Unit>("ft²");

  const x = num(value);
  const valid = Number.isFinite(x) && x >= 0;
  const result = valid ? convert(x, from, to) : NaN;
  const display = valid && Number.isFinite(result) ? formatResult(result) : "—";

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
            onChange={(e) => setFrom(e.target.value as Unit)}
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
            value={to}
            onChange={(e) => setTo(e.target.value as Unit)}
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
          value={valid && Number.isFinite(result) ? `${display} ${to}` : "—"}
          sub={
            valid && Number.isFinite(result)
              ? `${formatResult(x)} ${from} = ${display} ${to}`
              : "Enter an area to convert"
          }
        />
      </div>

      {valid ? (
        <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--rule)]">
          <table className="w-full text-sm tabular-nums">
            <thead>
              <tr className="text-left text-[var(--ink-soft)] border-b border-[var(--rule)]">
                <th className="px-3 py-2 font-medium">Unit</th>
                <th className="px-3 py-2 font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {UNITS.map((u) => (
                <tr
                  key={u}
                  className="border-b border-[var(--rule)] last:border-0"
                >
                  <td className="px-3 py-1.5">{u}</td>
                  <td className="px-3 py-1.5">{formatResult(convert(x, from, u))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </ToolCard>
  );
}
