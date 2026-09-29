"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

// Real-world losses (inverter, wiring, heat, soiling) — a standard ~20% derate.
const PERFORMANCE_RATIO = 0.8;
// US federal residential clean-energy credit (ITC) as of 2026.
const TAX_CREDIT = 0.3;

export function SolarPanelCalculator() {
  const [bill, setBill] = useState("180");
  const [rate, setRate] = useState("0.17");
  const [panelW, setPanelW] = useState("400");
  const [sun, setSun] = useState("4.5");
  const [costPerW, setCostPerW] = useState("2.75");
  const [offset, setOffset] = useState("100");
  const [currency, setCurrency] = useState("USD");

  const b = num(bill);
  const r = num(rate);
  const pw = num(panelW);
  const sh = num(sun);
  const cpw = num(costPerW);
  const off = num(offset);

  const valid =
    Number.isFinite(b) &&
    b >= 0 &&
    Number.isFinite(r) &&
    r > 0 &&
    Number.isFinite(pw) &&
    pw > 0 &&
    Number.isFinite(sh) &&
    sh > 0 &&
    Number.isFinite(cpw) &&
    cpw >= 0 &&
    Number.isFinite(off) &&
    off > 0;

  let panels = NaN;
  let systemKW = NaN;
  let cost = NaN;
  let costAfterCredit = NaN;
  let annualSavings = NaN;
  let payback = NaN;
  let monthlyKWh = NaN;

  if (valid) {
    monthlyKWh = b / r;
    const targetDailyKWh = ((monthlyKWh / 30) * off) / 100;
    const neededKW = targetDailyKWh / (sh * PERFORMANCE_RATIO);
    panels = Math.max(1, Math.ceil((neededKW * 1000) / pw));
    const actualW = panels * pw;
    systemKW = actualW / 1000;
    cost = actualW * cpw;
    costAfterCredit = cost * (1 - TAX_CREDIT);
    annualSavings = ((b * 12) * off) / 100;
    payback = annualSavings > 0 ? costAfterCredit / annualSavings : NaN;
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Average monthly electricity bill">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={bill}
              onChange={(e) => setBill(e.target.value)}
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
        <Field label="Electricity rate (per kWh)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </Field>
        <Field label="Panel wattage (W)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={panelW}
            onChange={(e) => setPanelW(e.target.value)}
          />
        </Field>
        <Field label="Peak sun hours per day">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={sun}
            onChange={(e) => setSun(e.target.value)}
          />
        </Field>
        <Field label="Installed cost per watt">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={costPerW}
            onChange={(e) => setCostPerW(e.target.value)}
          />
        </Field>
        <Field label="Bill offset target (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={offset}
            onChange={(e) => setOffset(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Panels needed"
          accent
          value={valid ? String(panels) : "—"}
          sub={valid ? `${systemKW.toFixed(2)} kW system` : undefined}
        />
        <Stat
          label="Estimated cost"
          value={valid ? formatMoney(cost, currency) : "—"}
        />
        <Stat
          label="Cost after 30% tax credit"
          value={valid ? formatMoney(costAfterCredit, currency) : "—"}
        />
        <Stat
          label="Annual bill savings"
          value={valid ? formatMoney(annualSavings, currency) : "—"}
        />
        <Stat
          label="Payback period"
          value={
            valid && Number.isFinite(payback) ? `${payback.toFixed(1)} yrs` : "—"
          }
          sub={valid ? "after the tax credit" : undefined}
        />
        <Stat
          label="Monthly usage"
          value={valid ? `${Math.round(monthlyKWh)} kWh` : "—"}
        />
      </div>

      <p className="mt-4 text-sm text-[var(--ink-soft)]">
        Estimates use a {Math.round((1 - PERFORMANCE_RATIO) * 100)}% loss factor
        for inverter, wiring and heat. Actual output depends on your roof, shade
        and local rates. The cost assumes the 30% US federal tax credit; check
        current incentives for your situation.
      </p>
    </ToolCard>
  );
}
