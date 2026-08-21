"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Mode = "time" | "rate";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function RuleOf72Calculator() {
  const [mode, setMode] = useState<Mode>("time");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("9");

  const r = num(rate);
  const y = num(years);

  // Time-to-double mode: years = 72 / rate. Exact = ln(2) / ln(1 + r).
  const rateValid = r > 0;
  const est72Years = rateValid ? 72 / r : NaN;
  const exactYears = rateValid ? Math.log(2) / Math.log(1 + r / 100) : NaN;

  // Required-rate mode: rate = 72 / years. Exact = (2^(1/years) − 1) × 100.
  const yearsValid = y > 0;
  const est72Rate = yearsValid ? 72 / y : NaN;
  const exactRate = yearsValid ? (Math.pow(2, 1 / y) - 1) * 100 : NaN;

  return (
    <ToolCard>
      <Segmented<Mode>
        value={mode}
        onChange={setMode}
        options={[
          { value: "time", label: "Time to double" },
          { value: "rate", label: "Rate to double" },
        ]}
      />

      {mode === "time" ? (
        <>
          <div className="mt-5">
            <Field label="Annual interest / return rate (%)">
              <input
                className="field"
                type="number"
                inputMode="decimal"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </Field>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Stat
              label="Years to double (Rule of 72)"
              accent
              value={rateValid ? `${formatNumber(est72Years, 1)} yrs` : "—"}
            />
            <Stat
              label="Exact years to double"
              value={rateValid ? `${formatNumber(exactYears, 1)} yrs` : "—"}
            />
          </div>

          {rateValid ? (
            <p className="mt-3 text-sm text-[var(--ink-soft)] leading-relaxed">
              At {formatNumber(r, 1)}% a year, your money doubles in about{" "}
              <strong className="text-[var(--ink)]">
                {formatNumber(est72Years, 1)} years
              </strong>
              , quadruples (4×) in ~{formatNumber(est72Years * 2, 1)} years, and
              grows 8× in ~{formatNumber(est72Years * 3, 1)} years.
            </p>
          ) : null}
        </>
      ) : (
        <>
          <div className="mt-5">
            <Field label="Years to double">
              <input
                className="field"
                type="number"
                inputMode="decimal"
                value={years}
                onChange={(e) => setYears(e.target.value)}
              />
            </Field>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Stat
              label="Rate needed (Rule of 72)"
              accent
              value={yearsValid ? `${formatNumber(est72Rate, 2)}%` : "—"}
            />
            <Stat
              label="Exact rate needed"
              value={yearsValid ? `${formatNumber(exactRate, 2)}%` : "—"}
            />
          </div>

          {yearsValid ? (
            <p className="mt-3 text-sm text-[var(--ink-soft)] leading-relaxed">
              To double your money in {formatNumber(y, 1)} years, you need about{" "}
              <strong className="text-[var(--ink)]">
                {formatNumber(est72Rate, 2)}%
              </strong>{" "}
              a year (Rule of 72). The exact annual return is{" "}
              {formatNumber(exactRate, 2)}%.
            </p>
          ) : null}
        </>
      )}
    </ToolCard>
  );
}
