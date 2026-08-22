"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Type = "Sample" | "Population";

export function StandardDeviationCalculator() {
  const [text, setText] = useState("4, 8, 15, 16, 23, 42");
  const [type, setType] = useState<Type>("Sample");

  const numbers = text
    .split(/[\s,]+/)
    .filter((t) => t.trim() !== "")
    .map(Number)
    .filter((v) => Number.isFinite(v));
  const N = numbers.length;
  const sum = numbers.reduce((acc, v) => acc + v, 0);
  const mean = N > 0 ? sum / N : NaN;
  const sumSq = numbers.reduce((acc, v) => acc + (v - mean) * (v - mean), 0);

  const enoughForSample = type === "Sample" ? N >= 2 : N >= 1;
  const valid = N >= 1 && enoughForSample;

  const variance =
    type === "Sample" ? (N >= 2 ? sumSq / (N - 1) : NaN) : N >= 1 ? sumSq / N : NaN;
  const sd = Math.sqrt(variance);

  const min = N > 0 ? Math.min(...numbers) : NaN;
  const max = N > 0 ? Math.max(...numbers) : NaN;
  const range = max - min;

  return (
    <ToolCard>
      <Segmented<Type>
        value={type}
        onChange={setType}
        options={[
          { value: "Sample", label: "Sample" },
          { value: "Population", label: "Population" },
        ]}
      />

      <div className="mt-5">
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
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Standard deviation"
          accent
          value={valid ? formatNumber(sd, 4) : "—"}
        />
        <Stat
          label="Variance"
          value={valid ? formatNumber(variance, 4) : "—"}
        />
        <Stat label="Mean" value={N >= 1 ? formatNumber(mean, 4) : "—"} />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Stat label="Count" value={N >= 1 ? formatNumber(N, 0) : "—"} />
        <Stat label="Sum" value={N >= 1 ? formatNumber(sum, 4) : "—"} />
        <Stat label="Range" value={N >= 1 ? formatNumber(range, 4) : "—"} />
      </div>
    </ToolCard>
  );
}
