"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

type Mode = "toHourly" | "toSalary";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function SalaryToHourly({
  defaultMode = "toHourly",
}: {
  defaultMode?: Mode;
} = {}) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [salary, setSalary] = useState("60000");
  const [hourly, setHourly] = useState("30");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [weeksPerYear, setWeeksPerYear] = useState("52");
  const [currency, setCurrency] = useState("USD");

  const hpw = num(hoursPerWeek);
  const wpy = num(weeksPerYear);
  const baseValid = hpw > 0 && wpy > 0;

  let annual = NaN;
  let hourlyRate = NaN;
  let weekly = NaN;
  let monthly = NaN;

  if (mode === "toHourly") {
    const a = num(salary);
    if (baseValid && a >= 0 && Number.isFinite(a)) {
      annual = a;
      hourlyRate = a / (hpw * wpy);
      weekly = a / wpy;
      monthly = a / 12;
    }
  } else {
    const h = num(hourly);
    if (baseValid && h >= 0 && Number.isFinite(h)) {
      hourlyRate = h;
      annual = h * hpw * wpy;
      weekly = h * hpw;
      monthly = annual / 12;
    }
  }

  const valid = Number.isFinite(annual) && Number.isFinite(hourlyRate);

  return (
    <ToolCard>
      <Segmented<Mode>
        value={mode}
        onChange={setMode}
        options={[
          { value: "toHourly", label: "Salary → hourly" },
          { value: "toSalary", label: "Hourly → salary" },
        ]}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {mode === "toHourly" ? (
          <Field label="Annual salary">
            <div className="flex gap-2">
              <NumberInput value={salary} onChange={setSalary} />
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
        ) : (
          <Field label="Hourly rate">
            <div className="flex gap-2">
              <NumberInput value={hourly} onChange={setHourly} />
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
        )}
        <Field label="Hours per week">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
          />
        </Field>
        <Field label="Weeks per year">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={weeksPerYear}
            onChange={(e) => setWeeksPerYear(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Hourly"
          accent={mode === "toHourly"}
          value={valid ? formatMoney(hourlyRate, currency) : "—"}
        />
        <Stat
          label="Weekly"
          value={valid ? formatMoney(weekly, currency) : "—"}
        />
        <Stat
          label="Monthly"
          value={valid ? formatMoney(monthly, currency) : "—"}
        />
        <Stat
          label="Annual"
          accent={mode === "toSalary"}
          value={valid ? formatMoney(annual, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
