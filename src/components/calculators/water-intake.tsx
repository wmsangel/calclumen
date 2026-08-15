"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Unit = "kg" | "lb";
type Climate = "Normal" | "Hot";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function WaterIntakeCalculator() {
  const [unit, setUnit] = useState<Unit>("kg");
  const [weight, setWeight] = useState("70");
  const [exerciseMinutes, setExerciseMinutes] = useState("30");
  const [climate, setClimate] = useState<Climate>("Normal");

  const w = num(weight);
  const ex = num(exerciseMinutes);
  const valid = w > 0 && Number.isFinite(ex) && ex >= 0;

  let liters = NaN;
  let ounces = NaN;
  let cups = NaN;
  let glasses = NaN;

  if (valid) {
    const weightKg = unit === "lb" ? w / 2.2046226 : w;
    const baseMl = weightKg * 35;
    const exerciseMl = (ex / 30) * 350;
    const hot = climate === "Hot" ? 500 : 0;
    const totalMl = baseMl + exerciseMl + hot;
    liters = totalMl / 1000;
    ounces = totalMl / 29.5735;
    cups = ounces / 8;
    glasses = Math.round(ounces / 8);
  }

  const ok = valid && Number.isFinite(liters);

  return (
    <ToolCard>
      <Segmented<Unit>
        value={unit}
        onChange={(u) => {
          setUnit(u);
          setWeight(u === "lb" ? "154" : "70");
        }}
        options={[
          { value: "kg", label: "kg" },
          { value: "lb", label: "lb" },
        ]}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label={`Weight (${unit})`}>
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </Field>
        <Field label="Exercise (minutes/day)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={exerciseMinutes}
            onChange={(e) => setExerciseMinutes(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Climate">
          <Segmented<Climate>
            value={climate}
            onChange={setClimate}
            options={[
              { value: "Normal", label: "Normal" },
              { value: "Hot", label: "Hot" },
            ]}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Daily water"
          accent
          value={ok ? `${formatNumber(liters, 2)} L` : "—"}
          sub={ok ? undefined : "Enter your weight"}
        />
        <Stat
          label="Ounces"
          value={ok ? `${formatNumber(ounces, 0)} oz` : "—"}
        />
        <Stat label="Cups" value={ok ? formatNumber(cups, 1) : "—"} />
        <Stat label="Glasses (8 oz)" value={ok ? String(glasses) : "—"} />
      </div>
    </ToolCard>
  );
}
