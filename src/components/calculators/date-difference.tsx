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
    // Days in the month preceding the later date's month.
    const daysInPrevMonth = new Date(
      later.getFullYear(),
      later.getMonth(),
      0,
    ).getDate();
    days += daysInPrevMonth;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

export function DateDifferenceCalculator() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const valid = from !== "" && to !== "";

  const fromDate = valid ? new Date(from + "T00:00:00") : null;
  const toDate = valid ? new Date(to + "T00:00:00") : null;

  const ok =
    fromDate !== null &&
    toDate !== null &&
    Number.isFinite(fromDate.getTime()) &&
    Number.isFinite(toDate.getTime());

  const signedDays = ok
    ? Math.round((toDate!.getTime() - fromDate!.getTime()) / 86400000)
    : NaN;
  const totalDays = Math.abs(signedDays);
  const weeks = totalDays / 7;
  const reversed = ok && signedDays < 0;

  const earlier = ok ? (reversed ? toDate! : fromDate!) : null;
  const later = ok ? (reversed ? fromDate! : toDate!) : null;
  const parts = ok ? breakdown(earlier!, later!) : null;
  const ymd = parts ? `${parts.years}y ${parts.months}m ${parts.days}d` : "—";

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="From">
          <div className="flex gap-2">
            <input
              className="field"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <button
              type="button"
              className="px-3 btn-primary font-semibold text-sm"
              onClick={() => setFrom(today())}
            >
              Today
            </button>
          </div>
        </Field>
        <Field label="To">
          <div className="flex gap-2">
            <input
              className="field"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            <button
              type="button"
              className="px-3 btn-primary font-semibold text-sm"
              onClick={() => setTo(today())}
            >
              Today
            </button>
          </div>
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Total days"
          accent
          value={ok ? formatNumber(totalDays, 0) : "—"}
          sub={
            ok
              ? reversed
                ? "To date is earlier"
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
