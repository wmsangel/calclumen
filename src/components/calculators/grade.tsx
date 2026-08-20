"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Mode = "average" | "final";
type Row = { name: string; grade: string; weight: string };

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const DEFAULT_ROWS: Row[] = [
  { name: "Homework", grade: "88", weight: "20" },
  { name: "Midterm", grade: "82", weight: "30" },
  { name: "Project", grade: "94", weight: "20" },
];

/** Letter grade on the common US +/- scale. */
function letter(p: number): string {
  if (p >= 93) return "A";
  if (p >= 90) return "A-";
  if (p >= 87) return "B+";
  if (p >= 83) return "B";
  if (p >= 80) return "B-";
  if (p >= 77) return "C+";
  if (p >= 73) return "C";
  if (p >= 70) return "C-";
  if (p >= 67) return "D+";
  if (p >= 63) return "D";
  if (p >= 60) return "D-";
  return "F";
}

export function GradeCalculator() {
  const [mode, setMode] = useState<Mode>("average");

  // ── Weighted average mode ──
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);
  const update = (i: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const addRow = () =>
    setRows((rs) => [...rs, { name: "", grade: "", weight: "" }]);
  const removeRow = (i: number) =>
    setRows((rs) => (rs.length > 1 ? rs.filter((_, idx) => idx !== i) : rs));

  let weighted = 0;
  let totalWeight = 0;
  for (const r of rows) {
    const g = num(r.grade);
    const w = num(r.weight);
    if (Number.isFinite(g) && Number.isFinite(w) && w > 0) {
      weighted += g * w;
      totalWeight += w;
    }
  }
  const avgValid = totalWeight > 0;
  const overall = avgValid ? weighted / totalWeight : 0;

  // ── Final grade needed mode ──
  const [current, setCurrent] = useState("88");
  const [target, setTarget] = useState("90");
  const [finalWeight, setFinalWeight] = useState("30");

  const cur = num(current);
  const tgt = num(target);
  const fw = num(finalWeight);
  const finalValid =
    Number.isFinite(cur) && Number.isFinite(tgt) && fw > 0 && fw < 100;
  const w = fw / 100;
  const required = finalValid ? (tgt - cur * (1 - w)) / w : NaN;

  return (
    <ToolCard>
      <Segmented<Mode>
        value={mode}
        onChange={setMode}
        options={[
          { value: "average", label: "Course grade" },
          { value: "final", label: "Final grade needed" },
        ]}
      />

      {mode === "average" ? (
        <>
          <div className="mt-5 space-y-3">
            {rows.map((r, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_5rem_5rem_auto] gap-2 items-end"
              >
                <Field label={i === 0 ? "Item" : ""}>
                  <input
                    className="field"
                    type="text"
                    value={r.name}
                    placeholder="Assignment"
                    onChange={(e) => update(i, { name: e.target.value })}
                    aria-label={`Name for item ${i + 1}`}
                  />
                </Field>
                <Field label={i === 0 ? "Grade %" : ""}>
                  <input
                    className="field"
                    type="number"
                    inputMode="decimal"
                    value={r.grade}
                    onChange={(e) => update(i, { grade: e.target.value })}
                    aria-label={`Grade for item ${i + 1}`}
                  />
                </Field>
                <Field label={i === 0 ? "Weight %" : ""}>
                  <input
                    className="field"
                    type="number"
                    inputMode="decimal"
                    value={r.weight}
                    onChange={(e) => update(i, { weight: e.target.value })}
                    aria-label={`Weight for item ${i + 1}`}
                  />
                </Field>
                <button
                  type="button"
                  className="field w-11 grid place-items-center text-[var(--ink-soft)] hover:text-[var(--accent)]"
                  onClick={() => removeRow(i)}
                  aria-label={`Remove item ${i + 1}`}
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
            + Add item
          </button>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Stat
              label="Course grade"
              accent
              value={avgValid ? `${formatNumber(overall, 2)}%` : "—"}
            />
            <Stat
              label="Letter grade"
              value={avgValid ? letter(overall) : "—"}
            />
            <Stat
              label="Total weight"
              value={avgValid ? `${formatNumber(totalWeight, 0)}%` : "—"}
            />
          </div>

          {avgValid && Math.abs(totalWeight - 100) > 0.5 ? (
            <p className="mt-3 text-xs text-[var(--ink-soft)] leading-relaxed">
              Your weights add up to {formatNumber(totalWeight, 0)}%, not 100%.
              The grade shown is the weighted average of the items you entered —
              useful for a grade in progress. Enter every graded item with
              weights totalling 100% for your true final course grade.
            </p>
          ) : null}
        </>
      ) : (
        <>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Field label="Current grade (%)">
              <input
                className="field"
                type="number"
                inputMode="decimal"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
            </Field>
            <Field label="Target grade (%)">
              <input
                className="field"
                type="number"
                inputMode="decimal"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </Field>
            <Field label="Final worth (% of grade)">
              <input
                className="field"
                type="number"
                inputMode="decimal"
                value={finalWeight}
                onChange={(e) => setFinalWeight(e.target.value)}
              />
            </Field>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Stat
              label="Score needed on final"
              accent
              value={finalValid ? `${formatNumber(required, 1)}%` : "—"}
            />
            <Stat
              label="Letter you'd need"
              value={
                finalValid && required <= 100 && required >= 0
                  ? letter(required)
                  : "—"
              }
            />
          </div>

          {finalValid ? (
            <p className="mt-3 text-xs text-[var(--ink-soft)] leading-relaxed">
              {required > 100
                ? `Reaching ${formatNumber(tgt, 0)}% isn't possible from a final alone — you'd need ${formatNumber(required, 1)}%, above 100%. You'd need extra credit or a lower target.`
                : required <= 0
                  ? `You've already secured ${formatNumber(tgt, 0)}% — even a 0% on the final keeps you at or above your target.`
                  : `To finish the course at ${formatNumber(tgt, 0)}%, you need ${formatNumber(required, 1)}% on a final worth ${formatNumber(fw, 0)}% of your grade.`}
            </p>
          ) : null}
        </>
      )}
    </ToolCard>
  );
}
