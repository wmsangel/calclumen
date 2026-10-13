"use client";

import { useState } from "react";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";
import { estimateBac, LEGAL, weightKgFromInput, type Sex } from "@/lib/math/bac";

type Units = "kg" | "lb";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function BacCalculator() {
  const [sex, setSex] = useState<Sex>("male");
  const [units, setUnits] = useState<Units>("lb");
  const [weight, setWeight] = useState("165");
  const [drinks, setDrinks] = useState("3");
  const [hours, setHours] = useState("2");

  const wInput = num(weight);
  const d = num(drinks);
  const h = num(hours);

  const weightKg = weightKgFromInput(units, wInput);
  const valid =
    Number.isFinite(weightKg) && weightKg > 0 &&
    Number.isFinite(d) && d >= 0 &&
    Number.isFinite(h) && h >= 0;

  let bac = NaN;
  let peak = NaN;
  let toSober = NaN; // hours until BAC = 0
  let toLegal = NaN; // hours until BAC = 0.08
  if (valid) {
    ({ bac, peak, toSober, toLegal } = estimateBac(sex, weightKg, d, h));
  }

  const over = valid && bac >= LEGAL;
  const fmtHrs = (x: number) => {
    const m = Math.round(x * 60);
    const hh = Math.floor(m / 60);
    const mm = m % 60;
    return hh > 0 ? `${hh}h ${mm}m` : `${mm}m`;
  };

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Sex">
          <Segmented<Sex>
            value={sex}
            onChange={setSex}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />
        </Field>
        <Field label="Body weight">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <select
              className="field w-20"
              value={units}
              onChange={(e) => setUnits(e.target.value as Units)}
              aria-label="Weight unit"
            >
              <option value="lb">lb</option>
              <option value="kg">kg</option>
            </select>
          </div>
        </Field>
        <Field label="Standard drinks" hint="1 drink = 14 g alcohol (12 oz beer, 5 oz wine, 1.5 oz spirits)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={drinks}
            onChange={(e) => setDrinks(e.target.value)}
          />
        </Field>
        <Field label="Hours since first drink">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Estimated BAC"
          accent
          value={valid ? `${bac.toFixed(3)}%` : "—"}
          sub={
            valid
              ? over
                ? "Over the 0.08% US driving limit"
                : bac > 0
                ? "Under 0.08%, but impairment starts well below it"
                : "Fully eliminated"
              : undefined
          }
        />
        <Stat
          label="Legal to drive? (US 0.08%)"
          value={valid ? (over ? "No" : bac > 0 ? "Under limit" : "Yes") : "—"}
          sub={valid && over ? `~${fmtHrs(toLegal)} until under 0.08%` : undefined}
        />
        <Stat
          label="Time until sober (BAC 0)"
          value={valid ? `~${fmtHrs(toSober)}` : "—"}
          sub={valid ? "at ~0.015%/hour" : undefined}
        />
        <Stat
          label="Peak BAC (no elimination)"
          value={valid ? `${peak.toFixed(3)}%` : "—"}
        />
      </div>

      <p className="mt-4 text-sm text-[var(--ink-soft)]">
        This is a rough Widmark-formula estimate, not a breathalyzer. Real BAC
        depends on food, medication, drinking pace, metabolism, hydration and
        more, and the elimination rate varies by person. Impairment begins well
        below 0.08%, and 0.05% or lower is the limit in many places. Never use
        this to decide whether to drive — if you&apos;ve been drinking, don&apos;t.
      </p>
    </ToolCard>
  );
}
