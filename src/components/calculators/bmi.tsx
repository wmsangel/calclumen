"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Unit = "metric" | "imperial";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

function category(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "var(--warn)" };
  if (bmi < 25) return { label: "Normal", color: "var(--good)" };
  if (bmi < 30) return { label: "Overweight", color: "var(--warn)" };
  return { label: "Obese", color: "var(--bad)" };
}

export function BmiCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [cm, setCm] = useState("175");
  const [kg, setKg] = useState("70");
  const [ft, setFt] = useState("5");
  const [inch, setInch] = useState("9");
  const [lb, setLb] = useState("160");

  let bmi = NaN;
  let low = NaN;
  let high = NaN;
  let range = "—";

  if (unit === "metric") {
    const h = num(cm);
    const w = num(kg);
    const m = h / 100;
    const valid = h > 0 && w > 0;
    if (valid) {
      bmi = w / (m * m);
      low = 18.5 * m * m;
      high = 24.9 * m * m;
      range = `${formatNumber(low, 1)}–${formatNumber(high, 1)} kg`;
    }
  } else {
    const totalInches = num(ft) * 12 + num(inch);
    const w = num(lb);
    const valid = totalInches > 0 && w > 0;
    if (valid) {
      bmi = (703 * w) / (totalInches * totalInches);
      low = (18.5 * totalInches * totalInches) / 703;
      high = (24.9 * totalInches * totalInches) / 703;
      range = `${formatNumber(low, 1)}–${formatNumber(high, 1)} lb`;
    }
  }

  const valid = Number.isFinite(bmi) && bmi > 0;
  const cat = valid ? category(bmi) : null;

  return (
    <ToolCard>
      <Segmented<Unit>
        value={unit}
        onChange={setUnit}
        options={[
          { value: "metric", label: "Metric" },
          { value: "imperial", label: "Imperial" },
        ]}
      />

      {unit === "metric" ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Height (cm)">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={cm}
              onChange={(e) => setCm(e.target.value)}
            />
          </Field>
          <Field label="Weight (kg)">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={kg}
              onChange={(e) => setKg(e.target.value)}
            />
          </Field>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Height (ft & in)">
            <div className="flex gap-2">
              <input
                className="field"
                type="number"
                inputMode="numeric"
                value={ft}
                onChange={(e) => setFt(e.target.value)}
                aria-label="Feet"
              />
              <input
                className="field"
                type="number"
                inputMode="numeric"
                value={inch}
                onChange={(e) => setInch(e.target.value)}
                aria-label="Inches"
              />
            </div>
          </Field>
          <Field label="Weight (lb)">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={lb}
              onChange={(e) => setLb(e.target.value)}
            />
          </Field>
        </div>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label="BMI" accent value={valid ? formatNumber(bmi, 1) : "—"} />
        <Stat
          label="Category"
          value={
            cat ? (
              <span style={{ color: cat.color }}>{cat.label}</span>
            ) : (
              "—"
            )
          }
        />
        <Stat label="Healthy weight range" value={valid ? range : "—"} />
      </div>
    </ToolCard>
  );
}
