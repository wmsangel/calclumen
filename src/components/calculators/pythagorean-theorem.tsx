"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Mode = "hypotenuse" | "leg";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function PythagoreanTheoremCalculator() {
  const [mode, setMode] = useState<Mode>("hypotenuse");
  const [a, setA] = useState("3");
  const [b, setB] = useState("4");
  const [c, setC] = useState("5");
  const [legA, setLegA] = useState("3");

  return (
    <ToolCard>
      <Segmented<Mode>
        value={mode}
        onChange={setMode}
        options={[
          { value: "hypotenuse", label: "Find hypotenuse (c)" },
          { value: "leg", label: "Find a leg" },
        ]}
      />

      {mode === "hypotenuse" ? (
        <Hypotenuse a={a} b={b} setA={setA} setB={setB} />
      ) : (
        <Leg c={c} a={legA} setC={setC} setA={setLegA} />
      )}
    </ToolCard>
  );
}

function Hypotenuse({
  a,
  b,
  setA,
  setB,
}: {
  a: string;
  b: string;
  setA: (v: string) => void;
  setB: (v: string) => void;
}) {
  const x = num(a);
  const y = num(b);
  const valid = Number.isFinite(x) && Number.isFinite(y) && x > 0 && y > 0;

  const c = valid ? Math.sqrt(x * x + y * y) : NaN;
  const area = valid ? (x * y) / 2 : NaN;
  const perimeter = valid ? x + y + c : NaN;

  return (
    <>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Leg a">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={a}
            onChange={(e) => setA(e.target.value)}
          />
        </Field>
        <Field label="Leg b">
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
        <Stat
          label="Hypotenuse c"
          accent
          value={valid ? formatNumber(c, 4) : "—"}
        />
        <Stat label="Area" value={valid ? formatNumber(area, 4) : "—"} />
        <Stat
          label="Perimeter"
          value={valid ? formatNumber(perimeter, 4) : "—"}
        />
      </div>
    </>
  );
}

function Leg({
  c,
  a,
  setC,
  setA,
}: {
  c: string;
  a: string;
  setC: (v: string) => void;
  setA: (v: string) => void;
}) {
  const cVal = num(c);
  const aVal = num(a);
  const positive =
    Number.isFinite(cVal) && Number.isFinite(aVal) && cVal > 0 && aVal > 0;
  const valid = positive && cVal > aVal;

  const b = valid ? Math.sqrt(cVal * cVal - aVal * aVal) : NaN;
  const area = valid ? (aVal * b) / 2 : NaN;
  const perimeter = valid ? aVal + b + cVal : NaN;

  return (
    <>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Hypotenuse c">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={c}
            onChange={(e) => setC(e.target.value)}
          />
        </Field>
        <Field label="Leg a">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={a}
            onChange={(e) => setA(e.target.value)}
          />
        </Field>
      </div>

      {positive && !valid ? (
        <p className="mt-3 text-sm text-[var(--ink-soft)]">
          Hypotenuse must be longer than the leg.
        </p>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Missing leg b"
          accent
          value={valid ? formatNumber(b, 4) : "—"}
        />
        <Stat label="Area" value={valid ? formatNumber(area, 4) : "—"} />
        <Stat
          label="Perimeter"
          value={valid ? formatNumber(perimeter, 4) : "—"}
        />
      </div>
    </>
  );
}
