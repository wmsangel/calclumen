"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Gender = "male" | "female";
type Units = "metric" | "imperial";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

function category(gender: Gender, bf: number): { label: string; color: string } {
  if (gender === "male") {
    if (bf < 6) return { label: "Essential / athlete", color: "var(--good)" };
    if (bf < 14) return { label: "Athlete", color: "var(--good)" };
    if (bf < 18) return { label: "Fitness", color: "var(--good)" };
    if (bf < 25) return { label: "Average", color: "var(--warn)" };
    return { label: "Obese", color: "var(--bad)" };
  }
  if (bf < 14) return { label: "Essential / athlete", color: "var(--good)" };
  if (bf < 21) return { label: "Athlete", color: "var(--good)" };
  if (bf < 25) return { label: "Fitness", color: "var(--good)" };
  if (bf < 32) return { label: "Average", color: "var(--warn)" };
  return { label: "Obese", color: "var(--bad)" };
}

export function BodyFatCalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [units, setUnits] = useState<Units>("metric");

  // metric inputs (cm / kg)
  const [heightM, setHeightM] = useState("178");
  const [neckM, setNeckM] = useState("38");
  const [waistM, setWaistM] = useState("90");
  const [hipM, setHipM] = useState("100");
  const [weightM, setWeightM] = useState("75");

  // imperial inputs (in / lb)
  const [heightI, setHeightI] = useState("70");
  const [neckI, setNeckI] = useState("15");
  const [waistI, setWaistI] = useState("35");
  const [hipI, setHipI] = useState("39");
  const [weightI, setWeightI] = useState("165");

  let height = NaN; // cm
  let neck = NaN; // cm
  let waist = NaN; // cm
  let hip = NaN; // cm
  let weight = NaN; // kg

  if (units === "metric") {
    height = num(heightM);
    neck = num(neckM);
    waist = num(waistM);
    hip = num(hipM);
    weight = num(weightM);
  } else {
    const inToCm = (v: number) => v * 2.54;
    const h = num(heightI);
    const n = num(neckI);
    const wa = num(waistI);
    const hp = num(hipI);
    const lb = num(weightI);
    if (Number.isFinite(h)) height = inToCm(h);
    if (Number.isFinite(n)) neck = inToCm(n);
    if (Number.isFinite(wa)) waist = inToCm(wa);
    if (Number.isFinite(hp)) hip = inToCm(hp);
    if (Number.isFinite(lb)) weight = lb / 2.2046226;
  }

  const isFemale = gender === "female";
  const unitLabel = units === "metric" ? "kg" : "lb";
  const toDisplayWeight = (kg: number) =>
    units === "metric" ? kg : kg * 2.2046226;

  let bf = NaN;
  const inputsFinite =
    height > 0 &&
    neck > 0 &&
    waist > 0 &&
    weight > 0 &&
    (!isFemale || hip > 0);

  if (inputsFinite) {
    if (isFemale) {
      const arg = waist + hip - neck;
      if (arg > 0) {
        bf =
          495 /
            (1.29579 -
              0.35004 * Math.log10(arg) +
              0.221 * Math.log10(height)) -
          450;
      }
    } else {
      const arg = waist - neck;
      if (arg > 0) {
        bf =
          495 /
            (1.0324 -
              0.19077 * Math.log10(arg) +
              0.15456 * Math.log10(height)) -
          450;
      }
    }
  }

  const valid = Number.isFinite(bf) && bf > 0;
  const cat = valid ? category(gender, bf) : null;
  const fatMass = valid ? (weight * bf) / 100 : NaN;
  const lean = valid ? weight - fatMass : NaN;

  const mass = (kg: number) =>
    valid ? `${formatNumber(toDisplayWeight(kg), 1)} ${unitLabel}` : "—";

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

      {units === "metric" ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Height (cm)">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={heightM}
              onChange={(e) => setHeightM(e.target.value)}
            />
          </Field>
          <Field label="Weight (kg)">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={weightM}
              onChange={(e) => setWeightM(e.target.value)}
            />
          </Field>
          <Field label="Neck (cm)">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={neckM}
              onChange={(e) => setNeckM(e.target.value)}
            />
          </Field>
          <Field label="Waist (cm)">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={waistM}
              onChange={(e) => setWaistM(e.target.value)}
            />
          </Field>
          {isFemale ? (
            <Field label="Hip (cm)">
              <input
                className="field"
                type="number"
                inputMode="decimal"
                value={hipM}
                onChange={(e) => setHipM(e.target.value)}
              />
            </Field>
          ) : null}
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Height (in)">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={heightI}
              onChange={(e) => setHeightI(e.target.value)}
            />
          </Field>
          <Field label="Weight (lb)">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={weightI}
              onChange={(e) => setWeightI(e.target.value)}
            />
          </Field>
          <Field label="Neck (in)">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={neckI}
              onChange={(e) => setNeckI(e.target.value)}
            />
          </Field>
          <Field label="Waist (in)">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={waistI}
              onChange={(e) => setWaistI(e.target.value)}
            />
          </Field>
          {isFemale ? (
            <Field label="Hip (in)">
              <input
                className="field"
                type="number"
                inputMode="decimal"
                value={hipI}
                onChange={(e) => setHipI(e.target.value)}
              />
            </Field>
          ) : null}
        </div>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Body fat"
          accent
          value={valid ? `${formatNumber(bf, 1)}%` : "—"}
        />
        <Stat
          label="Category"
          value={
            cat ? <span style={{ color: cat.color }}>{cat.label}</span> : "—"
          }
        />
        <Stat label="Fat mass" value={mass(fatMass)} />
        <Stat label="Lean mass" value={mass(lean)} />
      </div>
    </ToolCard>
  );
}
