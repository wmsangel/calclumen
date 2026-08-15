"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function RoiCalculator() {
  const [amountInvested, setAmountInvested] = useState("10000");
  const [amountReturned, setAmountReturned] = useState("13000");
  const [investmentLengthYears, setInvestmentLengthYears] = useState("2");
  const [currency, setCurrency] = useState("USD");

  const invested = num(amountInvested);
  const returned = num(amountReturned);
  const years = num(investmentLengthYears);
  const valid =
    Number.isFinite(invested) &&
    Number.isFinite(returned) &&
    Number.isFinite(years);

  const netProfit = returned - invested;
  const roi = invested > 0 ? (netProfit / invested) * 100 : 0;
  const annualized =
    invested > 0 && years > 0
      ? (Math.pow(returned / invested, 1 / years) - 1) * 100
      : 0;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Amount invested">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={amountInvested}
              onChange={(e) => setAmountInvested(e.target.value)}
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
        <Field label="Amount returned">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={amountReturned}
            onChange={(e) => setAmountReturned(e.target.value)}
          />
        </Field>
        <Field label="Investment length (years)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={investmentLengthYears}
            onChange={(e) => setInvestmentLengthYears(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="ROI"
          accent
          value={valid ? `${formatNumber(roi, 2)}%` : "—"}
        />
        <Stat
          label="Net profit"
          value={valid ? formatMoney(netProfit, currency) : "—"}
        />
        <Stat
          label="Annualized ROI"
          value={valid ? `${formatNumber(annualized, 2)}%` : "—"}
        />
      </div>
    </ToolCard>
  );
}
