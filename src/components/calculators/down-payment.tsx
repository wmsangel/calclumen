"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function DownPaymentCalculator() {
  const [homePrice, setHomePrice] = useState("300000");
  const [percent, setPercent] = useState("20");
  const [currency, setCurrency] = useState("USD");

  const price = num(homePrice);
  const pct = num(percent);

  const valid = price > 0 && Number.isFinite(pct) && pct >= 0 && pct <= 100;

  const downAmount = price * pct / 100;
  const loanAmount = price - downAmount;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Home price">
          <div className="flex gap-2">
            <NumberInput value={homePrice} onChange={setHomePrice} />
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
        <Field label="Down payment (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Down payment"
          accent
          value={valid ? formatMoney(downAmount, currency) : "—"}
        />
        <Stat
          label="Loan amount"
          value={valid ? formatMoney(loanAmount, currency) : "—"}
        />
        <Stat
          label="Percent down"
          value={valid ? `${formatNumber(pct, 1)}%` : "—"}
        />
      </div>

      {valid && pct < 20 ? (
        <p className="mt-4 text-xs text-[var(--ink-soft)] leading-relaxed">
          Below 20% down usually means paying PMI (private mortgage insurance).
        </p>
      ) : null}
    </ToolCard>
  );
}
