"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

/** formatNumber with trailing zeros trimmed off the decimal part. */
const fmt = (n: number, digits = 3) => {
  const s = formatNumber(n, digits);
  return s.includes(".") ? s.replace(/\.?0+$/, "") : s;
};

export function QuadraticEquationCalculator() {
  const [a, setA] = useState("1");
  const [b, setB] = useState("-3");
  const [c, setC] = useState("2");

  const aVal = num(a);
  const bVal = num(b);
  const cVal = num(c);

  const nums = Number.isFinite(aVal) && Number.isFinite(bVal) && Number.isFinite(cVal);
  const valid = nums && aVal !== 0;

  let roots: string | null = null;
  let discriminant: number = NaN;
  let vertexX: number = NaN;
  let vertexY: number = NaN;

  if (valid) {
    const D = bVal * bVal - 4 * aVal * cVal;
    discriminant = D;
    vertexX = -bVal / (2 * aVal);
    vertexY = aVal * vertexX * vertexX + bVal * vertexX + cVal;

    if (D > 0) {
      const x1 = (-bVal + Math.sqrt(D)) / (2 * aVal);
      const x2 = (-bVal - Math.sqrt(D)) / (2 * aVal);
      roots = `x = ${fmt(x1)} or x = ${fmt(x2)}`;
    } else if (D === 0) {
      const x = -bVal / (2 * aVal);
      roots = `x = ${fmt(x)} (double)`;
    } else {
      const real = -bVal / (2 * aVal);
      const imag = Math.sqrt(-D) / (2 * aVal);
      roots = `x = ${fmt(real)} ± ${fmt(imag)}i`;
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="a">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={a}
            onChange={(e) => setA(e.target.value)}
          />
        </Field>
        <Field label="b">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={b}
            onChange={(e) => setB(e.target.value)}
          />
        </Field>
        <Field label="c">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={c}
            onChange={(e) => setC(e.target.value)}
          />
        </Field>
      </div>

      {nums && aVal === 0 ? (
        <p className="mt-3 text-sm text-[var(--ink-soft)]">
          a cannot be 0 for a quadratic.
        </p>
      ) : null}

      <div className="mt-5">
        <Stat
          label="Roots"
          accent
          value={roots ?? "—"}
          sub={valid ? "ax² + bx + c = 0" : "Enter a, b and c"}
        />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Discriminant"
          value={valid ? formatNumber(discriminant) : "—"}
        />
        <Stat
          label="Vertex"
          value={valid ? `(${fmt(vertexX)}, ${fmt(vertexY)})` : "—"}
        />
      </div>
    </ToolCard>
  );
}
