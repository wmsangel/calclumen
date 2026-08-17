"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Mode = "simplify" | "solve";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

/** Greatest common divisor via the Euclidean algorithm. */
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function RatioCalculator() {
  const [mode, setMode] = useState<Mode>("simplify");
  const [a, setA] = useState("1920");
  const [b, setB] = useState("1080");
  const [c, setC] = useState("5");

  if (mode === "simplify") {
    const x = num(a);
    const y = num(b);
    const valid = Number.isFinite(x) && Number.isFinite(y) && x > 0 && y > 0;

    let simplified = "—";
    let decimal = "—";
    let oneToN = "—";
    if (valid) {
      const ia = Math.round(x);
      const ib = Math.round(y);
      const g = gcd(ia, ib) || 1;
      simplified = `${formatNumber(ia / g, 0)} : ${formatNumber(ib / g, 0)}`;
      decimal = formatNumber(x / y, 4);
      oneToN = `1 : ${formatNumber(y / x, 4)}`;
    }

    return (
      <ToolCard>
        <Segmented<Mode>
          value={mode}
          onChange={setMode}
          options={[
            { value: "simplify", label: "Simplify" },
            { value: "solve", label: "Solve proportion" },
          ]}
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="A">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={a}
              onChange={(e) => setA(e.target.value)}
            />
          </Field>
          <Field label="B">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={b}
              onChange={(e) => setB(e.target.value)}
            />
          </Field>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Stat label="Simplified ratio" accent value={simplified} />
          <Stat label="Decimal (A ÷ B)" value={decimal} />
          <Stat label="As 1 : n" value={oneToN} />
        </div>
      </ToolCard>
    );
  }

  // Solve proportion: a : b = c : x  ->  x = b * c / a
  const x = num(a);
  const y = num(b);
  const z = num(c);
  const valid =
    Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z) && x !== 0;
  const missing = valid ? (y * z) / x : NaN;
  const missingStr = valid ? formatNumber(missing, 4) : "—";
  const proportion = valid
    ? `${formatNumber(x, 4)} : ${formatNumber(y, 4)} = ${formatNumber(
        z,
        4
      )} : ${missingStr}`
    : "Enter A, B and C (A ≠ 0)";

  return (
    <ToolCard>
      <Segmented<Mode>
        value={mode}
        onChange={setMode}
        options={[
          { value: "simplify", label: "Simplify" },
          { value: "solve", label: "Solve proportion" },
        ]}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Field label="A">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={a}
            onChange={(e) => setA(e.target.value)}
          />
        </Field>
        <Field label="B">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={b}
            onChange={(e) => setB(e.target.value)}
          />
        </Field>
        <Field label="C">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={c}
            onChange={(e) => setC(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Stat
          label="Missing value (x)"
          accent
          value={missingStr}
          sub={valid ? proportion : "Enter A, B and C (A ≠ 0)"}
        />
      </div>
    </ToolCard>
  );
}
