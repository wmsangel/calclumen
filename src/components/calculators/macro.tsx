"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Goal = "maintain" | "cut" | "bulk";
type Split = "balanced" | "high-protein" | "low-carb";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const GOAL_FACTOR: Record<Goal, number> = {
  maintain: 1.0,
  cut: 0.8,
  bulk: 1.15,
};

const SPLITS: Record<Split, { c: number; p: number; f: number }> = {
  balanced: { c: 40, p: 30, f: 30 },
  "high-protein": { c: 30, p: 40, f: 30 },
  "low-carb": { c: 20, p: 40, f: 40 },
};

export function MacroCalculator() {
  const [dailyCalories, setDailyCalories] = useState("2000");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [split, setSplit] = useState<Split>("balanced");

  const cals = num(dailyCalories);
  const valid = Number.isFinite(cals) && cals > 0;

  const { c, p, f } = SPLITS[split];
  const adjusted = valid ? cals * GOAL_FACTOR[goal] : NaN;
  const protein = valid ? (adjusted * p) / 100 / 4 : NaN;
  const carbs = valid ? (adjusted * c) / 100 / 4 : NaN;
  const fat = valid ? (adjusted * f) / 100 / 9 : NaN;

  const grams = (x: number) => (valid ? `${formatNumber(x, 0)} g` : "—");

  return (
    <ToolCard>
      <div className="grid gap-4">
        <Field label="Daily calories (kcal)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={dailyCalories}
            onChange={(e) => setDailyCalories(e.target.value)}
          />
        </Field>

        <Field label="Goal">
          <Segmented<Goal>
            value={goal}
            onChange={setGoal}
            options={[
              { value: "maintain", label: "Maintain" },
              { value: "cut", label: "Cut" },
              { value: "bulk", label: "Bulk" },
            ]}
          />
        </Field>

        <Field label="Macro split">
          <Segmented<Split>
            value={split}
            onChange={setSplit}
            options={[
              { value: "balanced", label: "Balanced" },
              { value: "high-protein", label: "High-protein" },
              { value: "low-carb", label: "Low-carb" },
            ]}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Target calories"
          accent
          value={valid ? `${formatNumber(adjusted, 0)} kcal` : "—"}
        />
        <Stat label="Protein" value={grams(protein)} />
        <Stat label="Carbs" value={grams(carbs)} />
        <Stat label="Fat" value={grams(fat)} />
      </div>
    </ToolCard>
  );
}
