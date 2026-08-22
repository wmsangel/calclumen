"use client";

import { useState } from "react";
import { Stat, Field, ToolCard } from "@/components/ui";

const TO_ROMAN: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

const ROMAN_VALUES: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

function numberToRoman(n: number): string {
  let out = "";
  let remaining = n;
  for (const [value, symbol] of TO_ROMAN) {
    while (remaining >= value) {
      out += symbol;
      remaining -= value;
    }
  }
  return out;
}

function romanToNumber(input: string): number {
  const value = input.toUpperCase();
  let total = 0;
  for (let i = 0; i < value.length; i++) {
    const cur = ROMAN_VALUES[value[i]];
    const next = ROMAN_VALUES[value[i + 1]];
    if (next !== undefined && cur < next) total -= cur;
    else total += cur;
  }
  return total;
}

export function RomanNumeralConverter() {
  const [raw, setRaw] = useState("2026");
  const value = raw.trim();

  let result: string | null = null;
  let breakdown = "";
  let note = "";

  if (/^[0-9]+$/.test(value)) {
    const n = Number(value);
    if (n >= 1 && n <= 3999) {
      result = numberToRoman(n);
      const parts: number[] = [];
      let remaining = n;
      for (const [v, symbol] of TO_ROMAN) {
        while (remaining >= v) {
          parts.push(v);
          remaining -= v;
        }
        void symbol;
      }
      breakdown = `${result} = ${parts.join("+")}`;
    } else {
      note = "Enter 1–3999";
    }
  } else if (/^[ivxlcdmIVXLCDM]+$/.test(value)) {
    const upper = value.toUpperCase();
    const n = romanToNumber(upper);
    result = String(n);
    // Decompose the value into Roman token values (subtractive-aware) so the
    // sum is correct — e.g. IX = 9, not "1+10" which reads as 11.
    const parts: number[] = [];
    let remaining = n;
    for (const [v] of TO_ROMAN) {
      while (remaining >= v) {
        parts.push(v);
        remaining -= v;
      }
    }
    breakdown = `${upper} = ${parts.join("+")}`;
  }

  return (
    <ToolCard>
      <Field label="Number or Roman numeral">
        <input
          className="field"
          type="text"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          aria-label="Value to convert"
        />
      </Field>

      <div className="mt-5">
        <Stat
          label="Result"
          accent
          value={result ?? "—"}
          sub={result ? breakdown : note || "Enter a number (1–3999) or Roman numeral"}
        />
      </div>
    </ToolCard>
  );
}
