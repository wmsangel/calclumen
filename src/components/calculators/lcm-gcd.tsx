"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

function gcd(a: number, b: number): number {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function LcmGcdCalculator() {
  const [text, setText] = useState("12, 18, 24");

  const numbers = text
    .split(/[\s,]+/)
    .map(Number)
    .filter((v) => Number.isInteger(v) && v > 0);

  const valid = numbers.length >= 2;

  const gcdValue = valid ? numbers.reduce((acc, v) => gcd(acc, v)) : NaN;
  const lcmValue = valid
    ? numbers.reduce((acc, v) => (acc / gcd(acc, v)) * v)
    : NaN;

  return (
    <ToolCard>
      <Field
        label="Numbers"
        hint="Enter two or more positive whole numbers, separated by commas or spaces."
      >
        <textarea
          className="field min-h-24"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Field>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="GCD"
          accent
          value={valid ? formatNumber(gcdValue, 0) : "—"}
          sub="Greatest common divisor"
        />
        <Stat
          label="LCM"
          value={valid ? formatNumber(lcmValue, 0) : "—"}
          sub="Least common multiple"
        />
        <Stat
          label="Count"
          value={valid ? formatNumber(numbers.length, 0) : "—"}
          sub="Numbers used"
        />
      </div>
    </ToolCard>
  );
}
