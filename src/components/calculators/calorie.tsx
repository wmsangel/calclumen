"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Sex = "male" | "female";
type Units = "metric" | "imperial";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const ACTIVITY = [
  { value: "1.2", label: "Sedentary (little or no exercise)" },
  { value: "1.375", label: "Lightly active (1–3 days/week)" },
  { value: "1.55", label: "Moderately active (3–5 days/week)" },
  { value: "1.725", label: "Very active (6–7 days/week)" },
  { value: "1.9", label: "Extra active (hard job / training)" },
];

/** Mifflin-St Jeor BMR from weight (kg), height (cm), age (years). */
function bmr(sex: Sex, w: number, h: number, a: number) {
  const base = 10 * w + 6.25 * h - 5 * a;
  return sex === "male" ? base + 5 : base - 161;
}

export function CalorieCalculator() {
  const [sex, setSex] = useState<Sex>("male");
  const [units, setUnits] = useState<Units>("metric");
  const [age, setAge] = useState("30");

  // metric inputs
  const [cm, setCm] = useState("178");
  const [kg, setKg] = useState("75");

  // imperial inputs
  const [ft, setFt] = useState("5");
  const [inch, setInch] = useState("10");
  const [lb, setLb] = useState("165");

  const [activity, setActivity] = useState("1.375");

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

  const mult = num(activity);
  const valid =
    a > 0 && w > 0 && h > 0 && Number.isFinite(mult) && mult > 0;

  const b = valid ? bmr(sex, w, h, a) : NaN;
  const tdee = valid ? b * mult : NaN;

  const kcal = (x: number) => (valid ? `${formatNumber(x, 0)} kcal/day` : "—");

  return (
    <ToolCard>
      <div className="flex flex-wrap gap-3">
        <Segmented<Sex>
          value={sex}
          onChange={setSex}
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

        <Field label="Activity level">
          <select
            className="field"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          >
            {ACTIVITY.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Maintenance (TDEE)"
          accent
          value={kcal(tdee)}
          sub="Calories to maintain your weight"
        />
        <Stat
          label="Mild weight loss"
          value={kcal(tdee - 500)}
          sub="≈ 0.5 kg / 1 lb per week"
        />
        <Stat
          label="Weight gain"
          value={kcal(tdee + 500)}
          sub="≈ 0.5 kg / 1 lb per week"
        />
        <Stat
          label="BMR"
          value={kcal(b)}
          sub="Calories burned at complete rest"
        />
      </div>
    </ToolCard>
  );
}
