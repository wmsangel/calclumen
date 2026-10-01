"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

// RMDs start at age 73 under SECURE 2.0 (for those turning 72 after 2022).
const RMD_START_AGE = 73;

// IRS Uniform Lifetime Table (2022+) — distribution period by age.
const PERIOD: Record<number, number> = {
  73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1,
  80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2,
  87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1,
  94: 9.5, 95: 8.9, 96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8, 100: 6.4,
  101: 6.0, 102: 5.6, 103: 5.2, 104: 4.9, 105: 4.6, 106: 4.3, 107: 4.1,
  108: 3.9, 109: 3.7, 110: 3.5, 111: 3.4, 112: 3.3, 113: 3.1, 114: 3.0,
  115: 2.9, 116: 2.8, 117: 2.7, 118: 2.5, 119: 2.3, 120: 2.0,
};

export function RmdCalculator() {
  const [balance, setBalance] = useState("500000");
  const [age, setAge] = useState("73");
  const [currency, setCurrency] = useState("USD");

  const b = num(balance);
  const a = num(age);

  const valid = Number.isFinite(b) && b >= 0 && Number.isFinite(a) && a >= 0;
  const old = valid && a >= RMD_START_AGE;

  let period = NaN;
  let rmd = NaN;
  let pct = NaN;
  if (old) {
    const key = Math.min(120, Math.max(73, Math.floor(a)));
    period = PERIOD[key];
    rmd = b / period;
    pct = (1 / period) * 100;
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Account balance (prior Dec 31)">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
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
        <Field label="Your age this year">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </Field>
      </div>

      {valid && !old ? (
        <div className="mt-5">
          <Stat
            label="RMD required?"
            accent
            value="Not yet"
            sub={`Required minimum distributions begin at age ${RMD_START_AGE}. You have no RMD this year.`}
          />
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Stat
            label="This year's RMD"
            accent
            value={valid ? formatMoney(rmd, currency) : "—"}
          />
          <Stat
            label="Distribution period"
            value={valid ? `${period.toFixed(1)}` : "—"}
            sub={valid ? "IRS Uniform Lifetime Table" : undefined}
          />
          <Stat
            label="As % of balance"
            value={valid ? `${pct.toFixed(2)}%` : "—"}
          />
          <Stat
            label="Monthly equivalent"
            value={valid ? formatMoney(rmd / 12, currency) : "—"}
          />
        </div>
      )}

      <p className="mt-4 text-sm text-[var(--ink-soft)]">
        Uses the IRS Uniform Lifetime Table — the standard case. If your sole
        beneficiary is a spouse more than 10 years younger, a different (Joint
        Life) table applies. Your first RMD can be delayed to April 1 of the year
        after you turn {RMD_START_AGE}; missing an RMD triggers a penalty (25%,
        or 10% if corrected promptly). Inherited IRAs follow separate rules.
      </p>
    </ToolCard>
  );
}
