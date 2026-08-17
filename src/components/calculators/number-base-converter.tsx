"use client";

import { useState } from "react";
import { Field, Stat, ToolCard } from "@/components/ui";

const BASES = [
  { value: 2, label: "Binary" },
  { value: 8, label: "Octal" },
  { value: 10, label: "Decimal" },
  { value: 16, label: "Hexadecimal" },
] as const;

const PATTERNS: Record<number, RegExp> = {
  2: /^[01]+$/,
  8: /^[0-7]+$/,
  10: /^\d+$/,
  16: /^[0-9a-fA-F]+$/,
};

const TABLE_BASES = [
  { base: 2, label: "Binary" },
  { base: 8, label: "Octal" },
  { base: 10, label: "Decimal" },
  { base: 16, label: "Hexadecimal" },
] as const;

function isValid(value: string, base: number): boolean {
  const v = value.trim();
  if (v === "") return false;
  return PATTERNS[base].test(v);
}

export function NumberBaseConverter() {
  const [value, setValue] = useState("1010");
  const [fromBase, setFromBase] = useState(2);
  const [toBase, setToBase] = useState(10);

  const valid = isValid(value, fromBase);
  const dec = valid ? parseInt(value.trim(), fromBase) : NaN;
  const result =
    valid && Number.isFinite(dec) ? dec.toString(toBase).toUpperCase() : "—";

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Value">
          <input
            className="field font-mono"
            type="text"
            inputMode="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Field>
        <Field label="From base">
          <select
            className="field"
            value={fromBase}
            onChange={(e) => setFromBase(Number(e.target.value))}
            aria-label="From base"
          >
            {BASES.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="To base">
          <select
            className="field"
            value={toBase}
            onChange={(e) => setToBase(Number(e.target.value))}
            aria-label="To base"
          >
            {BASES.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Stat
          label="Converted value"
          accent
          value={<span className="font-mono">{result}</span>}
          sub={valid ? undefined : "Enter a valid value for the from-base"}
        />
      </div>

      {valid && Number.isFinite(dec) ? (
        <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--rule)]">
          <table className="w-full text-sm tabular-nums">
            <thead>
              <tr className="text-left text-[var(--ink-soft)] border-b border-[var(--rule)]">
                <th className="px-3 py-2 font-medium">Base</th>
                <th className="px-3 py-2 font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_BASES.map((b) => (
                <tr
                  key={b.base}
                  className="border-b border-[var(--rule)] last:border-0"
                >
                  <td className="px-3 py-1.5">{b.label}</td>
                  <td className="px-3 py-1.5 font-mono">
                    {dec.toString(b.base).toUpperCase()}
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
