"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const today = () => new Date().toISOString().slice(0, 10);

/** Full calendar breakdown between two dates (earlier→later), month-aware. */
function breakdown(earlier: Date, later: Date) {
  let years = later.getFullYear() - earlier.getFullYear();
  let months = later.getMonth() - earlier.getMonth();
  let days = later.getDate() - earlier.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(later.getFullYear(), later.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

export function CountdownCalculator() {
  const [eventName, setEventName] = useState("New Year");
  const [targetDate, setTargetDate] = useState("");
  const [fromDate, setFromDate] = useState("");

  const valid = targetDate !== "" && fromDate !== "";

  const target = valid ? new Date(targetDate + "T00:00:00") : null;
  const from = valid ? new Date(fromDate + "T00:00:00") : null;

  const ok =
    target !== null &&
    from !== null &&
    Number.isFinite(target.getTime()) &&
    Number.isFinite(from.getTime());

  const diffDays = ok
    ? Math.ceil((target!.getTime() - from!.getTime()) / 86400000)
    : NaN;
  const past = ok && diffDays < 0;
  const absDays = Math.abs(diffDays);
  const weeks = absDays / 7;

  const earlier = ok ? (past ? target! : from!) : null;
  const later = ok ? (past ? from! : target!) : null;
  const parts = ok ? breakdown(earlier!, later!) : null;
  const ymd = parts ? `${parts.years}y ${parts.months}m ${parts.days}d` : "—";

  const label = eventName.trim();

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Event name">
          <input
            className="field"
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="New Year"
          />
        </Field>
        <Field label="Target date">
          <div className="flex gap-2">
            <input
              className="field"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
            <button
              type="button"
              className="px-3 btn-primary font-semibold text-sm"
              onClick={() => setTargetDate(today())}
            >
              Today
            </button>
          </div>
        </Field>
        <Field label="Count from">
          <div className="flex gap-2">
            <input
              className="field"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <button
              type="button"
              className="px-3 btn-primary font-semibold text-sm"
              onClick={() => setFromDate(today())}
            >
              Today
            </button>
          </div>
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Days remaining"
          accent
          value={
            ok
              ? `${formatNumber(absDays, 0)} days${past ? " ago" : ""}`
              : "—"
          }
          sub={
            ok
              ? label
                ? past
                  ? `Since ${label}`
                  : `Until ${label}`
                : undefined
              : "Pick both dates"
          }
        />
        <Stat label="Weeks" value={ok ? formatNumber(weeks, 1) : "—"} />
        <Stat label="Years, months, days" value={ymd} />
      </div>
    </ToolCard>
  );
}
