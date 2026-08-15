"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Gender = "male" | "female";
type Units = "metric" | "imperial";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const KG_TO_LB = 2.2046226;

export function IdealWeightCalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [units, setUnits] = useState<Units>("metric");

  // metric height (cm)
  const [cm, setCm] = useState("178");

  // imperial height (ft + in)
  const [ft, setFt] = useState("5");
  const [inch, setInch] = useState("10");

  let heightInches = NaN;
  if (units === "metric") {
    const h = num(cm);
    if (Number.isFinite(h)) heightInches = h / 2.54;
  } else {
    const f = num(ft);
    const i = num(inch);
    if (Number.isFinite(f) || Number.isFinite(i)) {
      heightInches =
        (Number.isFinite(f) ? f : 0) * 12 + (Number.isFinite(i) ? i : 0);
    }
  }

  const valid = Number.isFinite(heightInches) && heightInches > 0;
  const x = valid ? Math.max(0, heightInches - 60) : NaN;

  const male = gender === "male";
  const devine = valid ? (male ? 50 + 2.3 * x : 45.5 + 2.3 * x) : NaN;
  const robinson = valid ? (male ? 52 + 1.9 * x : 49 + 1.7 * x) : NaN;
  const miller = valid ? (male ? 56.2 + 1.41 * x : 53.1 + 1.36 * x) : NaN;
  const hamwi = valid ? (male ? 48 + 2.7 * x : 45.5 + 2.2 * x) : NaN;
  const average = valid ? (devine + robinson + miller + hamwi) / 4 : NaN;

  const kgLb = (kg: number) =>
    valid
      ? `${formatNumber(kg, 1)} kg (${formatNumber(kg * KG_TO_LB, 1)} lb)`
      : "—";

  return (
    <ToolCard>
      <Segmented<Gender>
        value={gender}
        onChange={setGender}
        options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]}
      />

      <div className="mt-3">
        <Segmented<Units>
          value={units}
          onChange={setUnits}
          options={[
            { value: "metric", label: "Metric" },
            { value: "imperial", label: "Imperial" },
          ]}
        />
      </div>

      {units === "metric" ? (
        <div className="mt-5">
          <Field label="Height (cm)">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={cm}
              onChange={(e) => setCm(e.target.value)}
            />
          </Field>
        </div>
      ) : (
        <div className="mt-5">
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
        </div>
      )}

      <div className="mt-5 grid gap-3">
        <Stat label="Average ideal weight" accent value={kgLb(average)} />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Stat label="Devine" value={kgLb(devine)} />
        <Stat label="Robinson" value={kgLb(robinson)} />
        <Stat label="Miller" value={kgLb(miller)} />
        <Stat label="Hamwi" value={kgLb(hamwi)} />
      </div>
    </ToolCard>
  );
}
