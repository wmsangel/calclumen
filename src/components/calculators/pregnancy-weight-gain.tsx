"use client";

import { useState } from "react";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Units = "metric" | "imperial";
type Preg = "single" | "twins";
type Cat = "under" | "normal" | "over" | "obese";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));
const LB = 2.2046226;

// IOM (2009) recommended TOTAL gain by pre-pregnancy BMI, in kg.
const TOTAL: Record<Preg, Record<Cat, [number, number]>> = {
  single: { under: [12.5, 18], normal: [11.5, 16], over: [7, 11.5], obese: [5, 9] },
  // Provisional IOM ranges for twins (no firm underweight range → use normal).
  twins: { under: [16.8, 24.5], normal: [16.8, 24.5], over: [14.1, 22.7], obese: [11.3, 19.1] },
};
// Weekly rate for the 2nd/3rd trimester (singleton), kg/week.
const RATE: Record<Cat, [number, number]> = {
  under: [0.44, 0.58], normal: [0.35, 0.5], over: [0.23, 0.33], obese: [0.17, 0.27],
};
// First-trimester total gain (kg), same for all.
const FIRST: [number, number] = [0.5, 2.0];

const CAT_LABEL: Record<Cat, string> = {
  under: "Underweight", normal: "Normal weight", over: "Overweight", obese: "Obese",
};

function category(bmi: number): Cat {
  if (bmi < 18.5) return "under";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "over";
  return "obese";
}

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
  const heightM =
    metric ? num(cm) / 100 : ((num(ft) || 0) * 12 + (num(inch) || 0)) * 0.0254;
  const preKg = metric ? num(kg) : num(lb) / LB;
  const nowKg = nowW.trim() === "" ? NaN : metric ? num(nowW) : num(nowW) / LB;
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
    bmi = preKg / (heightM * heightM);
    cat = category(bmi);
    total = TOTAL[preg][cat];
    // recommended gain by the current week (singleton rates; twins → scale to total)
    if (preg === "single") {
      const extra = Math.max(0, w - 13);
      byWeek = [
        Math.min(total[0], FIRST[0] * Math.min(1, w / 13) + RATE[cat][0] * extra),
        Math.min(total[1], FIRST[1] * Math.min(1, w / 13) + RATE[cat][1] * extra),
      ];
    } else {
      // twins: smooth fraction of total across 40 weeks
      byWeek = [total[0] * Math.min(1, w / 40), total[1] * Math.min(1, w / 40)];
    }
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
