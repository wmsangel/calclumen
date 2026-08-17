"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Unit = "kg" | "lb";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const ACTIVITIES: { label: string; met: number }[] = [
  { label: "Walking (brisk)", met: 4.3 },
  { label: "Running (6 mph)", met: 9.8 },
  { label: "Cycling (moderate)", met: 7.5 },
  { label: "Swimming", met: 7.0 },
  { label: "Jump rope", met: 12.3 },
  { label: "Weightlifting", met: 3.5 },
  { label: "Yoga", met: 2.5 },
  { label: "Hiking", met: 6.0 },
  { label: "Elliptical", met: 5.0 },
  { label: "Rowing", met: 7.0 },
  { label: "Dancing", met: 5.0 },
  { label: "Basketball", met: 6.5 },
];

export function CaloriesBurnedCalculator() {
  const [activity, setActivity] = useState(ACTIVITIES[0].label);
  const [unit, setUnit] = useState<Unit>("kg");
  const [weight, setWeight] = useState("70");
  const [duration, setDuration] = useState("30");

  const met = ACTIVITIES.find((a) => a.label === activity)?.met ?? 0;
  const w = num(weight);
  const minutes = num(duration);

  const weightKg = unit === "lb" ? w / 2.2046226 : w;

  const valid =
    Number.isFinite(weightKg) &&
    weightKg > 0 &&
    Number.isFinite(minutes) &&
    minutes > 0;

  const calories = valid ? (met * 3.5 * weightKg) / 200 * minutes : NaN;

  const setUnitAndDefault = (u: Unit) => {
    setUnit(u);
    setWeight(u === "lb" ? "154" : "70");
  };

  return (
    <ToolCard>
      <Field label="Activity">
        <select
          className="field"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
        >
          {ACTIVITIES.map((a) => (
            <option key={a.label} value={a.label}>
              {a.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Weight">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <Segmented<Unit>
              value={unit}
              onChange={setUnitAndDefault}
              options={[
                { value: "kg", label: "kg" },
                { value: "lb", label: "lb" },
              ]}
            />
          </div>
        </Field>
        <Field label="Duration (minutes)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Calories burned"
          accent
          value={valid ? `${formatNumber(calories, 0)} kcal` : "—"}
        />
        <Stat
          label="Per hour"
          value={
            valid ? `${formatNumber((calories / minutes) * 60, 0)} kcal/h` : "—"
          }
        />
        <Stat label="MET value" value={formatNumber(met, 1)} />
      </div>
    </ToolCard>
  );
}
