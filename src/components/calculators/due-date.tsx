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

export function DueDateCalculator() {
  const [lastPeriodStart, setLastPeriodStart] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [asOfDate, setAsOfDate] = useState("");

  const cycle = num(cycleLength);
  const valid =
    lastPeriodStart !== "" && Number.isFinite(cycle) && cycle > 0;

  let dueDate: Date | null = null;
  let conception: Date | null = null;
  let base: Date | null = null;

  if (valid) {
    base = new Date(lastPeriodStart + "T00:00:00");
    if (Number.isFinite(base.getTime())) {
      dueDate = addDays(base, 280 + (cycle - 28));
      conception = addDays(base, cycle - 14);
    } else {
      base = null;
    }
  }

  const ok = dueDate !== null;

  let gestational = "—";
  let trimester = "—";
  if (base && asOfDate !== "") {
    const asOf = new Date(asOfDate + "T00:00:00");
    if (Number.isFinite(asOf.getTime())) {
      const totalDays = Math.floor((asOf.getTime() - base.getTime()) / 86400000);
      if (totalDays >= 0) {
        const weeks = Math.floor(totalDays / 7);
        const days = totalDays % 7;
        gestational = `${weeks} weeks ${days} days`;
        trimester = String(weeks <= 13 ? 1 : weeks <= 27 ? 2 : 3);
      }
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Last period start">
          <div className="flex gap-2">
            <input
              className="field flex-1 min-w-0"
              type="date"
              value={lastPeriodStart}
              onChange={(e) => setLastPeriodStart(e.target.value)}
            />
            <button
              type="button"
              className="px-3 btn-primary font-semibold text-sm shrink-0"
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
        <Field label="As-of date (gestational age)">
          <div className="flex gap-2">
            <input
              className="field flex-1 min-w-0"
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
            />
            <button
              type="button"
              className="px-3 btn-primary font-semibold text-sm shrink-0"
              onClick={() => setAsOfDate(today())}
            >
              Today
            </button>
          </div>
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Estimated due date"
          accent
          value={ok ? fmt(dueDate!) : "—"}
          sub={ok ? undefined : "Pick your last period date"}
        />
        <Stat label="Gestational age" value={gestational} />
        <Stat label="Trimester" value={trimester} />
        <Stat
          label="Estimated conception"
          value={ok ? fmt(conception!) : "—"}
        />
      </div>
    </ToolCard>
  );
}
