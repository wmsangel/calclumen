"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Gender = "male" | "female";
type Units = "metric" | "imperial";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

/** Mifflin-St Jeor BMR from weight (kg), height (cm), age (years). */
function mifflin(gender: Gender, w: number, h: number, a: number) {
  const base = 10 * w + 6.25 * h - 5 * a;
  return gender === "male" ? base + 5 : base - 161;
}

/** Harris-Benedict (revised) BMR from weight (kg), height (cm), age (years). */
function harris(gender: Gender, w: number, h: number, a: number) {
  return gender === "male"
    ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * a
    : 447.593 + 9.247 * w + 3.098 * h - 4.33 * a;
}

export function BmrCalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [units, setUnits] = useState<Units>("metric");
  const [age, setAge] = useState("30");

  // metric inputs
  const [cm, setCm] = useState("178");
  const [kg, setKg] = useState("75");

  // imperial inputs
  const [ft, setFt] = useState("5");
  const [inch, setInch] = useState("10");
  const [lb, setLb] = useState("165");

  const a = num(age);

  let w = NaN; // kg
  let h = NaN; // cm
  if (units === "metric") {
    w = num(kg);
    h = num(cm);
  } else {
    const f = num(ft);
    const i = num(inch);
    const pounds = num(lb);
    if (Number.isFinite(pounds)) w = pounds / 2.2046226;
    if (Number.isFinite(f) || Number.isFinite(i)) {
      h = ((Number.isFinite(f) ? f : 0) * 12 + (Number.isFinite(i) ? i : 0)) * 2.54;
    }
  }

  const valid = a > 0 && w > 0 && h > 0;
  const bmr = valid ? mifflin(gender, w, h, a) : NaN;
  const hb = valid ? harris(gender, w, h, a) : NaN;

  const kcal = (x: number) => (valid ? `${formatNumber(x, 0)} kcal/day` : "—");

  return (
    <ToolCard>
      <div className="flex flex-wrap gap-3">
        <Segmented<Gender>
          value={gender}
          onChange={setGender}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
        />
        <Segmented<Units>
          value={units}
          onChange={setUnits}
          options={[
            { value: "metric", label: "Metric" },
            { value: "imperial", label: "Imperial" },
          ]}
        />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Age (years)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </Field>

        {units === "metric" ? (
          <>
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
          </>
        ) : (
          <>
            <Field label="Height">
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
          </>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="BMR"
          accent
          value={kcal(bmr)}
          sub="Mifflin-St Jeor equation"
        />
        <Stat
          label="Harris-Benedict"
          value={kcal(hb)}
          sub="Revised Harris-Benedict equation"
        />
      </div>
    </ToolCard>
  );
}
