"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Op = "Add" | "Subtract";

const num = (s: string) => (s.trim() === "" ? 0 : Number(s));
const today = () => new Date().toISOString().slice(0, 10);

export function AddDaysCalculator() {
  const [startDate, setStartDate] = useState("");
  const [op, setOp] = useState<Op>("Add");
  const [days, setDays] = useState("30");
  const [weeks, setWeeks] = useState("0");
  const [months, setMonths] = useState("0");
  const [years, setYears] = useState("0");

  const valid = startDate !== "";
  const base = valid ? new Date(startDate + "T00:00:00") : null;
  const ok = base !== null && Number.isFinite(base.getTime());

  const d = num(days);
  const wk = num(weeks);
  const mo = num(months);
  const yr = num(years);

  let result: Date | null = null;
  let totalDays = NaN;

  if (ok) {
    const sign = op === "Subtract" ? -1 : 1;
    const next = new Date(base!);
    next.setFullYear(next.getFullYear() + sign * yr);
    next.setMonth(next.getMonth() + sign * mo);
    next.setDate(next.getDate() + sign * (d + wk * 7));
    result = next;
    totalDays = Math.round((result.getTime() - base!.getTime()) / 86400000);
  }

  return (
    <ToolCard>
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

      <div className="mt-5">
        <span className="label">Operation</span>
        <div className="mt-1">
          <Segmented<Op>
            value={op}
            onChange={setOp}
            options={[
              { value: "Add", label: "Add" },
              { value: "Subtract", label: "Subtract" },
            ]}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Field label="Days">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
        </Field>
        <Field label="Weeks">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={weeks}
            onChange={(e) => setWeeks(e.target.value)}
          />
        </Field>
        <Field label="Months">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
          />
        </Field>
        <Field label="Years">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Result date"
          accent
          value={
            ok && result
              ? result.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "—"
          }
          sub={ok ? undefined : "Pick a start date"}
        />
        <Stat
          label="Day of week"
          value={
            ok && result
              ? result.toLocaleDateString("en-US", { weekday: "long" })
              : "—"
          }
        />
        <Stat
          label="Total days shifted"
          value={ok ? formatNumber(Math.abs(totalDays), 0) : "—"}
        />
      </div>
    </ToolCard>
  );
}
