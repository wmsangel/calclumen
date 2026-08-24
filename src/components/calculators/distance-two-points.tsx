"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function DistanceTwoPointsCalculator() {
  const [x1, setX1] = useState("0");
  const [y1, setY1] = useState("0");
  const [x2, setX2] = useState("3");
  const [y2, setY2] = useState("4");

  const a1 = num(x1);
  const b1 = num(y1);
  const a2 = num(x2);
  const b2 = num(y2);
  const valid = [a1, b1, a2, b2].every((n) => Number.isFinite(n));

  const dx = a2 - a1;
  const dy = b2 - b1;
  const distance = Math.hypot(dx, dy);
  const midX = (a1 + a2) / 2;
  const midY = (b1 + b2) / 2;
  const slope = dx === 0 ? null : dy / dx;

  const field = (
    label: string,
    value: string,
    onChange: (v: string) => void,
  ) => (
    <Field label={label}>
      <input
        className="field"
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );

  return (
    <ToolCard>
      <div className="space-y-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)] mb-2">
            Point 1 (x₁, y₁)
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("x₁", x1, setX1)}
            {field("y₁", y1, setY1)}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)] mb-2">
            Point 2 (x₂, y₂)
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("x₂", x2, setX2)}
            {field("y₂", y2, setY2)}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Distance"
          accent
          value={valid ? formatNumber(distance, 4) : "—"}
        />
        <Stat
          label="Midpoint"
          value={
            valid
              ? `(${formatNumber(midX, 3)}, ${formatNumber(midY, 3)})`
              : "—"
          }
        />
        <Stat
          label="Slope"
          value={
            !valid
              ? "—"
              : slope === null
                ? "Undefined (vertical)"
                : formatNumber(slope, 4)
          }
        />
        <Stat
          label="Δx, Δy"
          value={
            valid
              ? `${formatNumber(dx, 3)}, ${formatNumber(dy, 3)}`
              : "—"
          }
        />
      </div>

      {valid ? (
        <p className="mt-3 text-sm text-[var(--ink-soft)] leading-relaxed">
          d = √((x₂ − x₁)² + (y₂ − y₁)²) = √(({formatNumber(dx, 2)})² + (
          {formatNumber(dy, 2)})²) ={" "}
          <strong className="text-[var(--ink)]">
            {formatNumber(distance, 4)}
          </strong>
          .
        </p>
      ) : null}
    </ToolCard>
  );
}
