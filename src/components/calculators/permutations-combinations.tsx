"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

/** Iterative factorial, capped at 170 (beyond that JS overflows to Infinity). */
function factorial(k: number): number {
  if (k > 170) return Infinity;
  let acc = 1;
  for (let i = 2; i <= k; i++) acc *= i;
  return acc;
}

export function PermutationsCombinationsCalculator() {
  const [nStr, setNStr] = useState("5");
  const [rStr, setRStr] = useState("2");

  const n = num(nStr);
  const r = num(rStr);

  const valid =
    Number.isInteger(n) &&
    Number.isInteger(r) &&
    r >= 0 &&
    r <= n;

  // nPr = product of r terms counting down from n
  let nPr = 1;
  if (valid) {
    for (let i = 0; i < r; i++) nPr *= n - i;
  }
  const rFact = valid ? factorial(r) : NaN;
  const nCr = valid ? nPr / rFact : NaN;
  const nFact = valid ? factorial(n) : NaN;

  const show = (x: number, digits = 0) =>
    !valid || !Number.isFinite(x) ? "too large" : formatNumber(x, digits);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="n (total items)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={nStr}
            onChange={(e) => setNStr(e.target.value)}
          />
        </Field>
        <Field label="r (chosen items)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={rStr}
            onChange={(e) => setRStr(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Combinations (nCr)"
          accent
          value={valid ? show(nCr) : "—"}
        />
        <Stat
          label="Permutations (nPr)"
          value={valid ? show(nPr) : "—"}
        />
        <Stat label="n!" value={valid ? show(nFact) : "—"} />
        <Stat label="r!" value={valid ? show(rFact) : "—"} />
      </div>
    </ToolCard>
  );
}
