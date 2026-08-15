"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

const today = () => new Date().toISOString().slice(0, 10);

export function BusinessDaysCalculator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [includeStart, setIncludeStart] = useState<"yes" | "no">("yes");

  const valid = startDate !== "" && endDate !== "";

  const start = valid ? new Date(startDate + "T00:00:00") : null;
  const end = valid ? new Date(endDate + "T00:00:00") : null;

  const ok =
    start !== null &&
    end !== null &&
    Number.isFinite(start.getTime()) &&
    Number.isFinite(end.getTime()) &&
    end.getTime() >= start.getTime();

  let businessDays = NaN;
  let weekendDays = NaN;
  let totalCalendarDays = NaN;

  if (ok && start && end) {
    totalCalendarDays =
      Math.round((end.getTime() - start.getTime()) / 86400000) + 1;

    const cursor = new Date(start.getTime());
    if (includeStart === "no") {
      cursor.setDate(cursor.getDate() + 1);
    }

    let count = 0;
    let guard = 0;
    while (cursor.getTime() <= end.getTime() && guard < 20000) {
      const dow = cursor.getDay();
      if (dow >= 1 && dow <= 5) count += 1;
      cursor.setDate(cursor.getDate() + 1);
      guard += 1;
    }
    businessDays = count;
    weekendDays = totalCalendarDays - businessDays;
  }

  const reversed =
    valid &&
    start !== null &&
    end !== null &&
    Number.isFinite(start.getTime()) &&
    Number.isFinite(end.getTime()) &&
    end.getTime() < start.getTime();

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start date">
          <div className="flex gap-2">
            <input
              className="field"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <button
              type="button"
              className="px-3 btn-primary font-semibold text-sm"
              onClick={() => setStartDate(today())}
            >
              Today
            </button>
          </div>
        </Field>
        <Field label="End date">
          <div className="flex gap-2">
            <input
              className="field"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button
              type="button"
              className="px-3 btn-primary font-semibold text-sm"
              onClick={() => setEndDate(today())}
            >
              Today
            </button>
          </div>
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Include start day">
          <Segmented
            value={includeStart}
            onChange={setIncludeStart}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Business days"
          accent
          value={ok ? formatNumber(businessDays, 0) : "—"}
          sub={
            ok
              ? "Weekends excluded (holidays not counted)"
              : reversed
                ? "End date is earlier"
                : "Pick both dates"
          }
        />
        <Stat
          label="Weekend days"
          value={ok ? formatNumber(weekendDays, 0) : "—"}
        />
        <Stat
          label="Total calendar days"
          value={ok ? formatNumber(totalCalendarDays, 0) : "—"}
        />
      </div>
    </ToolCard>
  );
}
