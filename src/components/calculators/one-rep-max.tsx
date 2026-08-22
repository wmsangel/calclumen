"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Unit = "kg" | "lb";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const PERCENTS = [95, 90, 85, 80, 75, 70, 65, 60, 55, 50];

export function OneRepMaxCalculator() {
  const [unit, setUnit] = useState<Unit>("kg");
  const [weightLifted, setWeightLifted] = useState("100");
  const [reps, setReps] = useState("5");

  const w = num(weightLifted);
  const r = num(reps);
  const valid = w > 0 && r > 0;

  const epley = valid ? w * (1 + r / 30) : NaN;
  const brzycki = valid && r < 37 ? (w * 36) / (37 - r) : NaN;
  // Average the two estimates; fall back to Epley when Brzycki is undefined
  // (reps ≥ 37) so the result doesn't collapse entirely.
  const avg = valid
    ? Number.isFinite(brzycki)
      ? (epley + brzycki) / 2
      : epley
    : NaN;

  const ok = Number.isFinite(avg) && avg > 0;

  return (
    <ToolCard>
      <Segmented<Unit>
        value={unit}
        onChange={setUnit}
        options={[
          { value: "kg", label: "kg" },
          { value: "lb", label: "lb" },
        ]}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label={`Weight lifted (${unit})`}>
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={weightLifted}
            onChange={(e) => setWeightLifted(e.target.value)}
          />
        </Field>
        <Field label="Reps">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Estimated 1RM"
          accent
          value={ok ? `${formatNumber(avg, 1)} ${unit}` : "—"}
          sub={ok ? undefined : "Enter weight and reps"}
        />
        <Stat
          label="Epley"
          value={ok ? `${formatNumber(epley, 1)} ${unit}` : "—"}
        />
        <Stat
          label="Brzycki"
          value={
            ok && Number.isFinite(brzycki)
              ? `${formatNumber(brzycki, 1)} ${unit}`
              : "—"
          }
        />
      </div>

      {ok ? (
        <div className="mt-6">
          <div className="label mb-2">Percentage of 1RM</div>
          <div className="overflow-hidden rounded-lg border border-[var(--rule)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--rule)] text-left text-[var(--ink-soft)]">
                  <th className="px-4 py-2 font-medium">% of 1RM</th>
                  <th className="px-4 py-2 font-medium">Load ({unit})</th>
                </tr>
              </thead>
              <tbody>
                {PERCENTS.map((pct) => (
                  <tr
                    key={pct}
                    className="border-b border-[var(--rule)] last:border-0"
                  >
                    <td className="px-4 py-2 numeral">{pct}%</td>
                    <td className="px-4 py-2 numeral">
                      {formatNumber((avg * pct) / 100, 1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </ToolCard>
  );
}
