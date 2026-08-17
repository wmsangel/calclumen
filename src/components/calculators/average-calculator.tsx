"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

export function AverageCalculator() {
  const [text, setText] = useState("5, 8, 12, 12, 20");

  const numbers = text
    .split(/[\s,]+/)
    .map(Number)
    .filter((v) => Number.isFinite(v));
  const n = numbers.length;
  const valid = n >= 1;

  const sum = numbers.reduce((acc, v) => acc + v, 0);
  const mean = valid ? sum / n : NaN;

  const sorted = [...numbers].sort((a, b) => a - b);
  const median = valid
    ? n % 2
      ? sorted[(n - 1) / 2]
      : (sorted[n / 2 - 1] + sorted[n / 2]) / 2
    : NaN;

  const min = valid ? sorted[0] : NaN;
  const max = valid ? sorted[n - 1] : NaN;
  const range = max - min;

  // Mode: value(s) with the highest frequency; "No mode" if all unique.
  let modeStr = "—";
  if (valid) {
    const counts = new Map<number, number>();
    for (const v of numbers) counts.set(v, (counts.get(v) ?? 0) + 1);
    let maxFreq = 0;
    for (const c of counts.values()) if (c > maxFreq) maxFreq = c;
    if (maxFreq <= 1) {
      modeStr = "No mode";
    } else {
      const modes = [...counts.entries()]
        .filter(([, c]) => c === maxFreq)
        .map(([v]) => v)
        .sort((a, b) => a - b);
      modeStr = modes.map((v) => formatNumber(v, 4)).join(", ");
    }
  }

  return (
    <ToolCard>
      <Field
        label="Numbers"
        hint="Separate values with commas, spaces, or new lines."
      >
        <textarea
          className="field min-h-24"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Field>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label="Mean" accent value={valid ? formatNumber(mean, 4) : "—"} />
        <Stat label="Median" value={valid ? formatNumber(median, 4) : "—"} />
        <Stat label="Mode" value={modeStr} />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Stat label="Count" value={valid ? formatNumber(n, 0) : "—"} />
        <Stat label="Sum" value={valid ? formatNumber(sum, 4) : "—"} />
        <Stat label="Range" value={valid ? formatNumber(range, 4) : "—"} />
      </div>
    </ToolCard>
  );
}
