"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Method = "basic" | "karvonen";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const ZONES: { name: string; low: number; high: number }[] = [
  { name: "Fat burn", low: 0.5, high: 0.7 },
  { name: "Cardio", low: 0.7, high: 0.85 },
  { name: "Peak", low: 0.85, high: 1.0 },
];

export function TargetHeartRateCalculator() {
  const [age, setAge] = useState("30");
  const [method, setMethod] = useState<Method>("basic");
  const [resting, setResting] = useState("60");

  const a = num(age);
  const rest = num(resting);
  const validAge = a >= 1 && a <= 120;
  const valid =
    validAge &&
    (method === "basic" || (Number.isFinite(rest) && rest > 0 && rest < 220));

  const maxHR = validAge ? 220 - a : NaN;

  const bpm = (pct: number) =>
    method === "karvonen" ? (maxHR - rest) * pct + rest : maxHR * pct;

  return (
    <ToolCard>
      <div className="flex flex-wrap gap-3">
        <Segmented<Method>
          value={method}
          onChange={setMethod}
          options={[
            { value: "basic", label: "Basic (220 − age)" },
            { value: "karvonen", label: "Karvonen" },
          ]}
        />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Age (years)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </Field>
        {method === "karvonen" ? (
          <Field
            label="Resting heart rate (bpm)"
            hint="Measure first thing in the morning, at rest."
          >
            <input
              className="field"
              type="number"
              inputMode="numeric"
              value={resting}
              onChange={(e) => setResting(e.target.value)}
            />
          </Field>
        ) : null}
      </div>

      <div className="mt-5">
        <Stat
          label="Maximum heart rate"
          accent
          value={valid ? `${formatNumber(maxHR, 0)} bpm` : "—"}
          sub="Estimated from 220 − age"
        />
      </div>

      <div className="mt-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)] mb-2">
          Training zones
        </div>
        <div className="overflow-x-auto rounded-xl border border-[var(--rule)]">
          <table className="w-full text-sm tabular-nums">
            <thead>
              <tr className="text-left text-[var(--ink-soft)] border-b border-[var(--rule)]">
                <th className="px-3 py-2 font-medium">Zone</th>
                <th className="px-3 py-2 font-medium">Intensity</th>
                <th className="px-3 py-2 font-medium">Heart rate (bpm)</th>
              </tr>
            </thead>
            <tbody>
              {ZONES.map((z) => (
                <tr
                  key={z.name}
                  className="border-b border-[var(--rule)] last:border-0"
                >
                  <td className="px-3 py-2 font-medium">{z.name}</td>
                  <td className="px-3 py-2 text-[var(--ink-soft)]">
                    {formatNumber(z.low * 100, 0)}–{formatNumber(z.high * 100, 0)}%
                  </td>
                  <td className="px-3 py-2">
                    {valid
                      ? `${formatNumber(bpm(z.low), 0)}–${formatNumber(bpm(z.high), 0)}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ToolCard>
  );
}
