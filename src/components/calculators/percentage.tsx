"use client";

import { useEffect, useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";
import { ResultActions } from "@/components/result-actions";
import { readParam, syncParams } from "@/lib/share";

type Mode = "of" | "change" | "isWhat";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("of");
  const [a, setA] = useState("15");
  const [b, setB] = useState("200");

  useEffect(() => {
    const m = readParam("mode");
    if (m === "of" || m === "change" || m === "isWhat") setMode(m);
    const av = readParam("a");
    const bv = readParam("b");
    if (av) setA(av);
    if (bv) setB(bv);
  }, []);

  useEffect(() => {
    syncParams({ mode, a, b });
  }, [mode, a, b]);

  const x = num(a);
  const y = num(b);
  const valid = Number.isFinite(x) && Number.isFinite(y);

  let result: string | null = null;
  let caption = "";

  if (valid) {
    if (mode === "of") {
      result = formatNumber((x / 100) * y);
      caption = `${formatNumber(x, 0)}% of ${formatNumber(y, 0)}`;
    } else if (mode === "change") {
      const change = x === 0 ? NaN : ((y - x) / Math.abs(x)) * 100;
      result = Number.isFinite(change)
        ? `${change > 0 ? "+" : ""}${formatNumber(change)}%`
        : "—";
      caption = `Change from ${formatNumber(x, 0)} to ${formatNumber(y, 0)}`;
    } else {
      const pct = y === 0 ? NaN : (x / y) * 100;
      result = Number.isFinite(pct) ? `${formatNumber(pct)}%` : "—";
      caption = `${formatNumber(x, 0)} is this percent of ${formatNumber(y, 0)}`;
    }
  }

  const labels: Record<Mode, [string, string]> = {
    of: ["Percentage", "Of value"],
    change: ["From (original)", "To (new)"],
    isWhat: ["Value", "Total"],
  };

  return (
    <ToolCard>
      <Segmented<Mode>
        value={mode}
        onChange={setMode}
        options={[
          { value: "of", label: "% of a number" },
          { value: "change", label: "% change" },
          { value: "isWhat", label: "X is what %" },
        ]}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label={labels[mode][0]}>
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={a}
            onChange={(e) => setA(e.target.value)}
          />
        </Field>
        <Field label={labels[mode][1]}>
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={b}
            onChange={(e) => setB(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Stat
          label="Result"
          accent
          value={result ?? "—"}
          sub={valid ? caption : "Enter two numbers"}
        />
      </div>

      {valid && result ? (
        <div className="mt-5 no-print">
          <ResultActions
            summary={`${caption} = ${result} — via calclumen.com`}
          />
        </div>
      ) : null}
    </ToolCard>
  );
}
