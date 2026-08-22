"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Mode = "to" | "from";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

/** Trim trailing zeros from a fixed-decimal string. */
const trim = (n: number, digits = 6) =>
  Number.isFinite(n) ? String(Number(n.toFixed(digits))) : "—";

export function ScientificNotationCalculator() {
  const [mode, setMode] = useState<Mode>("to");
  const [decimal, setDecimal] = useState("12345");
  const [mantissa, setMantissa] = useState("1.2345");
  const [exponent, setExponent] = useState("4");

  return (
    <ToolCard>
      <Segmented<Mode>
        value={mode}
        onChange={setMode}
        options={[
          { value: "to", label: "To scientific" },
          { value: "from", label: "From scientific" },
        ]}
      />

      {mode === "to" ? (
        <ToScientific value={decimal} onChange={setDecimal} />
      ) : (
        <FromScientific
          mantissa={mantissa}
          exponent={exponent}
          onMantissa={setMantissa}
          onExponent={setExponent}
        />
      )}
    </ToolCard>
  );
}

function ToScientific({
  value,
  onChange,
}: {
  value: string;
  onChange: (s: string) => void;
}) {
  const n = num(value);
  const valid = Number.isFinite(n);

  let mant = NaN;
  let exp = 0;
  if (valid && n !== 0) {
    exp = Math.floor(Math.log10(Math.abs(n)));
    mant = n / Math.pow(10, exp);
  }

  const zero = valid && n === 0;

  return (
    <>
      <div className="mt-5">
        <Field label="Decimal number">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Scientific notation"
          accent
          value={
            !valid ? (
              "—"
            ) : zero ? (
              "0"
            ) : (
              <span>
                {trim(mant, 4)} × 10<sup>{exp}</sup>
              </span>
            )
          }
        />
        <Stat
          label="E-notation"
          value={!valid ? "—" : zero ? "0e0" : `${trim(mant, 6)}e${exp}`}
        />
        <Stat
          label="Expanded"
          value={!valid ? "—" : zero ? "0" : trim(n, 10)}
        />
      </div>
    </>
  );
}

function FromScientific({
  mantissa,
  exponent,
  onMantissa,
  onExponent,
}: {
  mantissa: string;
  exponent: string;
  onMantissa: (s: string) => void;
  onExponent: (s: string) => void;
}) {
  const m = num(mantissa);
  const e = num(exponent);
  const valid = Number.isFinite(m) && Number.isFinite(e);
  const value = valid ? m * Math.pow(10, e) : NaN;

  return (
    <>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Mantissa">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={mantissa}
            onChange={(ev) => onMantissa(ev.target.value)}
          />
        </Field>
        <Field label="Exponent">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={exponent}
            onChange={(ev) => onExponent(ev.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Decimal value"
          accent
          value={valid ? formatNumber(value, 4).replace(/\.?0+$/, "") : "—"}
        />
        <Stat
          label="E-notation"
          value={valid ? `${trim(m, 6)}e${e}` : "—"}
        />
        <Stat
          label="Scientific form"
          value={
            valid ? (
              <span>
                {trim(m, 6)} × 10<sup>{e}</sup>
              </span>
            ) : (
              "—"
            )
          }
        />
      </div>
    </>
  );
}
