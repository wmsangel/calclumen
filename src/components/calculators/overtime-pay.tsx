"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function OvertimePayCalculator() {
  const [rate, setRate] = useState("20");
  const [regularHours, setRegularHours] = useState("40");
  const [overtimeHours, setOvertimeHours] = useState("5");
  const [multiplier, setMultiplier] = useState("1.5");
  const [currency, setCurrency] = useState("USD");

  const rt = num(rate);
  const rh = num(regularHours);
  const oh = num(overtimeHours);
  const mult = num(multiplier);
  const valid =
    rt >= 0 &&
    rh >= 0 &&
    oh >= 0 &&
    mult >= 0 &&
    Number.isFinite(rt) &&
    Number.isFinite(rh) &&
    Number.isFinite(oh) &&
    Number.isFinite(mult);

  const money = (v: number) => formatMoney(v, currency);

  const regularPay = valid ? rt * rh : null;
  const otRate = valid ? rt * mult : null;
  const otPay = valid && otRate !== null ? otRate * oh : null;
  const total =
    valid && regularPay !== null && otPay !== null ? regularPay + otPay : null;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Hourly rate">
          <div className="flex gap-2">
            <NumberInput value={rate} onChange={setRate} />
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
        <Field label="Overtime multiplier">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={multiplier}
            onChange={(e) => setMultiplier(e.target.value)}
          />
        </Field>
        <Field label="Regular hours">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={regularHours}
            onChange={(e) => setRegularHours(e.target.value)}
          />
        </Field>
        <Field label="Overtime hours">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={overtimeHours}
            onChange={(e) => setOvertimeHours(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat label="Total pay" accent value={total !== null ? money(total) : "—"} />
        <Stat label="Regular pay" value={regularPay !== null ? money(regularPay) : "—"} />
        <Stat label="Overtime pay" value={otPay !== null ? money(otPay) : "—"} />
        <Stat
          label="Overtime rate"
          value={otRate !== null ? money(otRate) : "—"}
          sub={otRate !== null ? "per hour" : undefined}
        />
      </div>
    </ToolCard>
  );
}
