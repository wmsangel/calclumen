"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

/** "HH:MM" → minutes since midnight, or NaN. */
function toMinutes(v: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(v);
  if (!m) return NaN;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return NaN;
  return h * 60 + min;
}

export function TimeDurationCalculator() {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:30");
  const [breakMinutes, setBreakMinutes] = useState("30");
  const [overnight, setOvernight] = useState<"no" | "yes">("no");

  const sMin = toMinutes(startTime);
  let eMin = toMinutes(endTime);
  const brk = Number(breakMinutes);

  const ok =
    Number.isFinite(sMin) && Number.isFinite(eMin) && Number.isFinite(brk);

  let duration = NaN;
  if (ok) {
    if (overnight === "yes" || eMin < sMin) {
      eMin += 1440;
    }
    duration = eMin - sMin - Math.max(0, brk);
  }

  const negative = ok && duration < 0;
  const showResult = ok && !negative;

  const hours = showResult ? Math.floor(duration / 60) : NaN;
  const minutes = showResult ? duration % 60 : NaN;
  const decimal = showResult ? duration / 60 : NaN;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start time">
          <input
            className="field"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </Field>
        <Field label="End time">
          <input
            className="field"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </Field>
        <Field label="Break (minutes)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            min={0}
            value={breakMinutes}
            onChange={(e) => setBreakMinutes(e.target.value)}
          />
        </Field>
        <Field label="Overnight shift">
          <Segmented
            value={overnight}
            onChange={setOvernight}
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Duration"
          accent
          value={showResult ? `${hours}h ${minutes}m` : "—"}
          sub={
            negative
              ? "End is before start"
              : ok
                ? undefined
                : "Enter valid times"
          }
        />
        <Stat
          label="Decimal hours"
          value={showResult ? formatNumber(decimal, 2) : "—"}
        />
        <Stat
          label="Total minutes"
          value={showResult ? formatNumber(duration, 0) : "—"}
        />
      </div>
    </ToolCard>
  );
}
