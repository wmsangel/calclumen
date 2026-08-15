"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const today = () => new Date().toISOString().slice(0, 10);

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [asOfDate, setAsOfDate] = useState("");

  const valid = birthDate !== "" && asOfDate !== "";

  const from = valid ? new Date(birthDate + "T00:00:00") : null;
  const to = valid ? new Date(asOfDate + "T00:00:00") : null;

  const ok =
    from !== null &&
    to !== null &&
    Number.isFinite(from.getTime()) &&
    Number.isFinite(to.getTime()) &&
    to.getTime() >= from.getTime();

  let years = NaN;
  let months = NaN;
  let days = NaN;
  let totalDays = NaN;
  let totalWeeks = NaN;
  let totalMonths = NaN;
  let dayOfWeekBorn = "—";
  let daysUntilNext = NaN;

  if (ok && from && to) {
    days = to.getDate() - from.getDate();
    months = to.getMonth() - from.getMonth();
    years = to.getFullYear() - from.getFullYear();
    if (days < 0) {
      months -= 1;
      days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    totalDays = Math.floor((to.getTime() - from.getTime()) / 86400000);
    totalWeeks = totalDays / 7;
    totalMonths = years * 12 + months;

    dayOfWeekBorn = from.toLocaleDateString("en-US", { weekday: "long" });

    let nextBirthday = new Date(
      to.getFullYear(),
      from.getMonth(),
      from.getDate(),
    );
    if (nextBirthday.getTime() < to.getTime()) {
      nextBirthday = new Date(
        to.getFullYear() + 1,
        from.getMonth(),
        from.getDate(),
      );
    }
    daysUntilNext = Math.ceil(
      (nextBirthday.getTime() - to.getTime()) / 86400000,
    );
  }

  const reversed =
    valid &&
    from !== null &&
    to !== null &&
    Number.isFinite(from.getTime()) &&
    Number.isFinite(to.getTime()) &&
    to.getTime() < from.getTime();

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date of birth">
          <div className="flex gap-2">
            <input
              className="field"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
            <button
              type="button"
              className="px-3 btn-primary font-semibold text-sm"
              onClick={() => setBirthDate(today())}
            >
              Today
            </button>
          </div>
        </Field>
        <Field label="Age at date">
          <div className="flex gap-2">
            <input
              className="field"
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
            />
            <button
              type="button"
              className="px-3 btn-primary font-semibold text-sm"
              onClick={() => setAsOfDate(today())}
            >
              Today
            </button>
          </div>
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Age"
          accent
          value={ok ? `${years}y ${months}m ${days}d` : "—"}
          sub={
            ok
              ? `Born on a ${dayOfWeekBorn}`
              : reversed
                ? "Birth date is later"
                : "Pick both dates"
          }
        />
        <Stat
          label="Total days"
          value={ok ? formatNumber(totalDays, 0) : "—"}
        />
        <Stat
          label="Total weeks"
          value={ok ? formatNumber(totalWeeks, 1) : "—"}
        />
        <Stat
          label="Total months"
          value={ok ? formatNumber(totalMonths, 0) : "—"}
        />
        <Stat label="Day born" value={ok ? dayOfWeekBorn : "—"} />
        <Stat
          label="Days to next birthday"
          value={ok ? formatNumber(daysUntilNext, 0) : "—"}
        />
      </div>
    </ToolCard>
  );
}
