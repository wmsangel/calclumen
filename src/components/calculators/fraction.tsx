"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

type Op = "+" | "−" | "×" | "÷";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function FractionCalculator() {
  const [n1, setN1] = useState("1");
  const [d1, setD1] = useState("2");
  const [op, setOp] = useState<Op>("+");
  const [n2, setN2] = useState("1");
  const [d2, setD2] = useState("3");

  const a = num(n1);
  const b = num(d1);
  const c = num(n2);
  const d = num(d2);

  const finite =
    Number.isFinite(a) &&
    Number.isFinite(b) &&
    Number.isFinite(c) &&
    Number.isFinite(d);

  let valid = finite && b !== 0 && d !== 0;
  if (op === "÷" && c === 0) valid = false;

  let num_ = 0;
  let den = 1;
  let mixedStr = "—";
  let decimal = NaN;

  if (valid) {
    if (op === "+") {
      num_ = a * d + c * b;
      den = b * d;
    } else if (op === "−") {
      num_ = a * d - c * b;
      den = b * d;
    } else if (op === "×") {
      num_ = a * c;
      den = b * d;
    } else {
      num_ = a * d;
      den = b * c;
    }

    const g = gcd(Math.abs(num_), Math.abs(den)) || 1;
    num_ /= g;
    den /= g;
    if (den < 0) {
      num_ = -num_;
      den = -den;
    }

    const whole = Math.trunc(num_ / den);
    const rem = Math.abs(num_ % den);
    mixedStr =
      whole !== 0 && rem !== 0
        ? `${whole} ${rem}/${den}`
        : rem === 0
          ? `${whole}`
          : `${num_}/${den}`;
    decimal = num_ / den;
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] items-end">
        <div className="space-y-2">
          <Field label="Numerator 1">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={n1}
              onChange={(e) => setN1(e.target.value)}
            />
          </Field>
          <Field label="Denominator 1">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={d1}
              onChange={(e) => setD1(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Operator">
          <select
            className="field"
            value={op}
            onChange={(e) => setOp(e.target.value as Op)}
            aria-label="Operator"
          >
            <option value="+">+</option>
            <option value="−">−</option>
            <option value="×">×</option>
            <option value="÷">÷</option>
          </select>
        </Field>

        <div className="space-y-2">
          <Field label="Numerator 2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={n2}
              onChange={(e) => setN2(e.target.value)}
            />
          </Field>
          <Field label="Denominator 2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={d2}
              onChange={(e) => setD2(e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Result"
          accent
          value={valid ? `${num_}/${den}` : "—"}
        />
        <Stat label="Mixed number" value={valid ? mixedStr : "—"} />
        <Stat
          label="Decimal"
          value={valid ? formatNumber(decimal, 4) : "—"}
        />
      </div>
    </ToolCard>
  );
}
