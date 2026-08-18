"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function ElectricityCostCalculator() {
  const [power, setPower] = useState("1000");
  const [hoursPerDay, setHoursPerDay] = useState("4");
  const [quantity, setQuantity] = useState("1");
  const [rate, setRate] = useState("0.17");
  const [currency, setCurrency] = useState("USD");

  const w = num(power);
  const h = num(hoursPerDay);
  const q = num(quantity);
  const r = num(rate);

  const valid =
    w >= 0 &&
    Number.isFinite(w) &&
    h >= 0 &&
    h <= 24 &&
    q >= 1 &&
    Number.isFinite(r) &&
    r >= 0;

  const kwhDay = (w * h * q) / 1000;
  const kwhYear = kwhDay * 365;
  const costDay = kwhDay * r;
  const costMonth = costDay * (365 / 12);
  const costYear = costDay * 365;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Power (watts)">
          <NumberInput value={power} onChange={setPower} />
        </Field>
        <Field label="Hours used per day">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(e.target.value)}
          />
        </Field>
        <Field label="Number of devices">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Field>
        <Field label="Rate per kWh">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
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
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Cost per day"
          accent
          value={valid ? formatMoney(costDay, currency) : "—"}
        />
        <Stat
          label="Cost per month"
          value={valid ? formatMoney(costMonth, currency) : "—"}
        />
        <Stat
          label="Cost per year"
          value={valid ? formatMoney(costYear, currency) : "—"}
        />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Energy per day"
          value={valid ? `${formatNumber(kwhDay, 2)} kWh` : "—"}
        />
        <Stat
          label="Energy per year"
          value={valid ? `${formatNumber(kwhYear, 0)} kWh` : "—"}
        />
      </div>
    </ToolCard>
  );
}
