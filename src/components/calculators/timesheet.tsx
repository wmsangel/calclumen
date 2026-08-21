"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

type Row = { start: string; end: string; brk: string };

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const WEEKDAY: Row = { start: "09:00", end: "17:00", brk: "30" };
const WEEKEND: Row = { start: "", end: "", brk: "" };
const DEFAULT_ROWS: Row[] = [
  WEEKDAY,
  WEEKDAY,
  WEEKDAY,
  WEEKDAY,
  WEEKDAY,
  WEEKEND,
  WEEKEND,
];

/** Hours worked for one day, handling an overnight shift and a break. */
function dayHours(row: Row): number {
  if (!row.start || !row.end) return 0;
  const [sh, sm] = row.start.split(":").map(Number);
  const [eh, em] = row.end.split(":").map(Number);
  if ([sh, sm, eh, em].some((n) => !Number.isFinite(n))) return 0;
  let mins = eh * 60 + em - (sh * 60 + sm);
  if (mins < 0) mins += 24 * 60; // shift crosses midnight
  const brk = Number(row.brk);
  mins -= Number.isFinite(brk) ? brk : 0;
  return Math.max(0, mins / 60);
}

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function TimesheetCalculator() {
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);
  const [hourlyRate, setHourlyRate] = useState("20");
  const [currency, setCurrency] = useState("USD");
  const [overtime, setOvertime] = useState(true);

  const update = (i: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const daily = rows.map(dayHours);
  const total = daily.reduce((s, h) => s + h, 0);

  const regular = overtime ? Math.min(total, 40) : total;
  const ot = overtime ? Math.max(0, total - 40) : 0;

  const rate = num(hourlyRate);
  const rateValid = Number.isFinite(rate) && rate >= 0;
  const pay = rateValid ? regular * rate + ot * rate * 1.5 : NaN;

  return (
    <ToolCard>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--rule)] p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{DAYS[i]}</span>
              <span className="text-sm tabular-nums text-[var(--ink-soft)]">
                {formatNumber(daily[i], 2)} h
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <label className="block">
                <span className="block text-xs text-[var(--ink-soft)] mb-1">
                  Start
                </span>
                <input
                  className="field"
                  type="time"
                  value={row.start}
                  onChange={(e) => update(i, { start: e.target.value })}
                  aria-label={`${DAYS[i]} start time`}
                />
              </label>
              <label className="block">
                <span className="block text-xs text-[var(--ink-soft)] mb-1">
                  End
                </span>
                <input
                  className="field"
                  type="time"
                  value={row.end}
                  onChange={(e) => update(i, { end: e.target.value })}
                  aria-label={`${DAYS[i]} end time`}
                />
              </label>
              <label className="block">
                <span className="block text-xs text-[var(--ink-soft)] mb-1">
                  Break (min)
                </span>
                <input
                  className="field"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={row.brk}
                  onChange={(e) => update(i, { brk: e.target.value })}
                  aria-label={`${DAYS[i]} break minutes`}
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Hourly rate">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
            <select
              className="field w-24"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              aria-label="Currency"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </Field>
        <label className="flex items-center gap-2 text-sm text-[var(--ink-soft)] sm:pt-7">
          <input
            type="checkbox"
            checked={overtime}
            onChange={(e) => setOvertime(e.target.checked)}
          />
          Overtime over 40 h/week at 1.5×
        </label>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Total hours this week"
          accent
          value={`${formatNumber(total, 2)} h`}
        />
        <Stat
          label="Gross pay"
          value={rateValid ? formatMoney(pay, currency) : "—"}
        />
        {overtime ? (
          <>
            <Stat
              label="Regular hours"
              value={`${formatNumber(regular, 2)} h`}
            />
            <Stat
              label="Overtime hours (×1.5)"
              value={`${formatNumber(ot, 2)} h`}
            />
          </>
        ) : null}
      </div>
    </ToolCard>
  );
}
