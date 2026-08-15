"use client";

import { useState } from "react";
import { Field, Stat, ToolCard } from "@/components/ui";

const today = () => new Date().toISOString().slice(0, 10);
const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const addDays = (d: Date, days: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
};

const fmt = (d: Date) =>
  d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export function OvulationCalculator() {
  const [lastPeriodStart, setLastPeriodStart] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [lutealPhase, setLutealPhase] = useState("14");

  const cycle = num(cycleLength);
  const luteal = num(lutealPhase);
  const valid =
    lastPeriodStart !== "" &&
    Number.isFinite(cycle) &&
    cycle > 0 &&
    Number.isFinite(luteal) &&
    luteal > 0;

  let ovulation: Date | null = null;
  let fertileStart: Date | null = null;
  let fertileEnd: Date | null = null;
  let nextPeriod: Date | null = null;

  if (valid) {
    const base = new Date(lastPeriodStart + "T00:00:00");
    if (Number.isFinite(base.getTime())) {
      ovulation = addDays(base, cycle - luteal);
      fertileStart = addDays(ovulation, -5);
      fertileEnd = addDays(ovulation, 1);
      nextPeriod = addDays(base, cycle);
    }
  }

  const ok = ovulation !== null;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Last period start">
          <div className="flex gap-2">
            <input
              className="field"
              type="date"
              value={lastPeriodStart}
              onChange={(e) => setLastPeriodStart(e.target.value)}
            />
            <button
              type="button"
              className="px-3 btn-primary font-semibold text-sm"
              onClick={() => setLastPeriodStart(today())}
            >
              Today
            </button>
          </div>
        </Field>
        <Field label="Cycle length (days)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={cycleLength}
            onChange={(e) => setCycleLength(e.target.value)}
          />
        </Field>
        <Field label="Luteal phase (days)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={lutealPhase}
            onChange={(e) => setLutealPhase(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Estimated ovulation"
          accent
          value={ok ? fmt(ovulation!) : "—"}
          sub={ok ? undefined : "Pick your last period date"}
        />
        <Stat
          label="Fertile window"
          value={ok ? `${fmt(fertileStart!)} – ${fmt(fertileEnd!)}` : "—"}
        />
        <Stat label="Next period" value={ok ? fmt(nextPeriod!) : "—"} />
      </div>
    </ToolCard>
  );
}
