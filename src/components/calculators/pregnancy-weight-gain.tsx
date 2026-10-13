"use client";

import { useState } from "react";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";
import {
  LB,
  TOTAL,
  bodyMassIndex,
  category,
  gainByWeek,
  heightMeters,
  prePregnancyKg,
  type Cat,
  type Preg,
} from "@/lib/math/pregnancy-weight-gain";

type Units = "metric" | "imperial";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const CAT_LABEL: Record<Cat, string> = {
  under: "Underweight", normal: "Normal weight", over: "Overweight", obese: "Obese",
};

export function PregnancyWeightGainCalculator() {
  const [units, setUnits] = useState<Units>("imperial");
  const [preg, setPreg] = useState<Preg>("single");
  const [cm, setCm] = useState("165");
  const [ft, setFt] = useState("5");
  const [inch, setInch] = useState("5");
  const [kg, setKg] = useState("60");
  const [lb, setLb] = useState("132");
  const [week, setWeek] = useState("20");
  const [nowW, setNowW] = useState(""); // current weight (optional)

  const metric = units === "metric";
  const heightM = heightMeters(metric, num(cm), num(ft), num(inch));
  const preKg = prePregnancyKg(metric, num(kg), num(lb));
  const nowKg = nowW.trim() === "" ? NaN : prePregnancyKg(metric, num(nowW), num(nowW));
  const w = num(week);

  const valid =
    Number.isFinite(heightM) && heightM > 0 &&
    Number.isFinite(preKg) && preKg > 0 &&
    Number.isFinite(w) && w >= 1 && w <= 42;

  const toDisp = (k: number) => (metric ? k : k * LB);
  const unit = metric ? "kg" : "lb";
  const fmt = (k: number) => `${toDisp(k).toFixed(1)} ${unit}`;
  const fmtRange = (r: [number, number]) => `${toDisp(r[0]).toFixed(0)}–${toDisp(r[1]).toFixed(0)} ${unit}`;

  let bmi = NaN;
  let cat: Cat = "normal";
  let total: [number, number] = [0, 0];
  let byWeek: [number, number] = [0, 0];
  let currentGain = NaN;
  let track = "";
  if (valid) {
    bmi = bodyMassIndex(preKg, heightM);
    cat = category(bmi);
    total = TOTAL[preg][cat];
    byWeek = gainByWeek(preg, cat, w);
    if (Number.isFinite(nowKg)) {
      currentGain = nowKg - preKg;
      track =
        currentGain < byWeek[0]
          ? "Below the recommended range for this week"
          : currentGain > byWeek[1]
          ? "Above the recommended range for this week"
          : "On track for this week";
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Units">
          <Segmented<Units>
            value={units}
            onChange={setUnits}
            options={[
              { value: "imperial", label: "ft / lb" },
              { value: "metric", label: "cm / kg" },
            ]}
          />
        </Field>
        <Field label="Pregnancy">
          <Segmented<Preg>
            value={preg}
            onChange={setPreg}
            options={[
              { value: "single", label: "One baby" },
              { value: "twins", label: "Twins" },
            ]}
          />
        </Field>

        {metric ? (
          <Field label="Height">
            <div className="flex items-center gap-2">
              <input className="field" type="number" inputMode="decimal" value={cm} onChange={(e) => setCm(e.target.value)} />
              <span className="text-[var(--ink-soft)]">cm</span>
            </div>
          </Field>
        ) : (
          <Field label="Height">
            <div className="flex items-center gap-2">
              <input className="field" type="number" inputMode="numeric" value={ft} onChange={(e) => setFt(e.target.value)} />
              <span className="text-[var(--ink-soft)]">ft</span>
              <input className="field" type="number" inputMode="numeric" value={inch} onChange={(e) => setInch(e.target.value)} />
              <span className="text-[var(--ink-soft)]">in</span>
            </div>
          </Field>
        )}

        <Field label="Pre-pregnancy weight">
          <div className="flex items-center gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={metric ? kg : lb}
              onChange={(e) => (metric ? setKg(e.target.value) : setLb(e.target.value))}
            />
            <span className="text-[var(--ink-soft)]">{unit}</span>
          </div>
        </Field>

        <Field label="Current week of pregnancy" hint="1 to 42">
          <input className="field" type="number" inputMode="numeric" value={week} onChange={(e) => setWeek(e.target.value)} />
        </Field>
        <Field label="Current weight (optional)" hint="To check if you're on track">
          <div className="flex items-center gap-2">
            <input className="field" type="number" inputMode="decimal" value={nowW} onChange={(e) => setNowW(e.target.value)} />
            <span className="text-[var(--ink-soft)]">{unit}</span>
          </div>
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Recommended total gain"
          accent
          value={valid ? fmtRange(total) : "—"}
          sub={valid ? `pre-pregnancy BMI ${bmi.toFixed(1)} — ${CAT_LABEL[cat]}` : undefined}
        />
        <Stat
          label={`Recommended by week ${valid ? Math.round(w) : ""}`}
          value={valid ? fmtRange(byWeek) : "—"}
          sub={valid ? "gain so far at this point" : undefined}
        />
        {Number.isFinite(currentGain) ? (
          <>
            <Stat label="Your gain so far" value={fmt(currentGain)} />
            <Stat
              label="Status"
              value={
                track.startsWith("On") ? "On track" : track.startsWith("Below") ? "Below range" : "Above range"
              }
              sub={track}
            />
          </>
        ) : null}
      </div>

      <p className="mt-4 text-sm text-[var(--ink-soft)]">
        Ranges follow the US Institute of Medicine (2009) guidelines, which base
        healthy pregnancy weight gain on your pre-pregnancy BMI. Most of the gain
        comes in the second and third trimesters; the first trimester adds only a
        little. Twin ranges are provisional. This is general information, not
        medical advice — your own target can differ, so follow the plan your
        doctor or midwife sets for you.
      </p>
    </ToolCard>
  );
}
