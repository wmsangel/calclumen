"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  "D-": 0.7,
  F: 0.0,
};

const GRADES = Object.keys(GRADE_POINTS);

type Row = { grade: string; credits: string };

const DEFAULT_ROWS: Row[] = [
  { grade: "A", credits: "3" },
  { grade: "B+", credits: "4" },
  { grade: "A-", credits: "3" },
  { grade: "B", credits: "3" },
];

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function GpaCalculator() {
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);

  const update = (i: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const addRow = () =>
    setRows((rs) => [...rs, { grade: "A", credits: "3" }]);
  const removeRow = (i: number) =>
    setRows((rs) => (rs.length > 1 ? rs.filter((_, idx) => idx !== i) : rs));

  let qualityPoints = 0;
  let totalCredits = 0;
  for (const r of rows) {
    const credits = num(r.credits);
    const points = GRADE_POINTS[r.grade];
    if (Number.isFinite(credits) && credits > 0 && points !== undefined) {
      qualityPoints += points * credits;
      totalCredits += credits;
    }
  }

  const valid = totalCredits > 0;
  const gpa = valid ? qualityPoints / totalCredits : 0;

  return (
    <ToolCard>
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <Field label="Grade">
              <select
                className="field"
                value={r.grade}
                onChange={(e) => update(i, { grade: e.target.value })}
                aria-label={`Grade for course ${i + 1}`}
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Credits">
              <input
                className="field"
                type="number"
                inputMode="decimal"
                min={0}
                step={0.5}
                value={r.credits}
                onChange={(e) => update(i, { credits: e.target.value })}
                aria-label={`Credits for course ${i + 1}`}
              />
            </Field>
            <button
              type="button"
              className="field w-11 grid place-items-center text-[var(--ink-soft)] hover:text-[var(--accent)]"
              onClick={() => removeRow(i)}
              aria-label={`Remove course ${i + 1}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-3 text-sm font-medium text-[var(--accent)] hover:underline"
        onClick={addRow}
      >
        + Add course
      </button>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="GPA"
          accent
          value={valid ? formatNumber(gpa, 2) : "—"}
        />
        <Stat
          label="Total credits"
          value={valid ? formatNumber(totalCredits, 1) : "—"}
        />
        <Stat
          label="Quality points"
          value={valid ? formatNumber(qualityPoints, 2) : "—"}
        />
      </div>
    </ToolCard>
  );
}
