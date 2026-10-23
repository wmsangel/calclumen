"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { AreaChart } from "@/components/chart";
import { dividend } from "@/lib/math/dividend";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function DividendCalculator() {
  const [amount, setAmount] = useState("10000");
  const [yieldPct, setYieldPct] = useState("4");
  const [growth, setGrowth] = useState("5");
  const [years, setYears] = useState("10");
  const [reinvest, setReinvest] = useState(true);
  const [currency, setCurrency] = useState("USD");

  const a = num(amount);
  const yd = num(yieldPct);
  const g = num(growth);
  const y = num(years);

  const valid =
    a > 0 && Number.isFinite(yd) && yd >= 0 && Number.isFinite(g) && y > 0;
  const res = valid ? dividend(a, yd, g, y, reinvest) : null;
  const money = (x: number) => formatMoney(x, currency);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Amount invested">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
        <Field label="Dividend yield (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={yieldPct}
            onChange={(e) => setYieldPct(e.target.value)}
          />
        </Field>
        <Field label="Annual dividend growth (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={growth}
            onChange={(e) => setGrowth(e.target.value)}
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

      <label className="mt-4 flex items-center gap-2 text-sm cursor-pointer select-none">
        <input
          type="checkbox"
          checked={reinvest}
          onChange={(e) => setReinvest(e.target.checked)}
          className="h-4 w-4 accent-[var(--accent)]"
        />
        Reinvest dividends (DRIP)
      </label>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Annual dividend (year 1)"
          accent
          value={res ? money(res.firstYearIncome) : "—"}
        />
        <Stat label="Monthly (year 1)" value={res ? money(res.firstYearMonthly) : "—"} />
        <Stat
          label={`Annual dividend (year ${valid ? Math.round(y) : ""})`}
          value={res ? money(res.finalAnnualIncome) : "—"}
        />
      </div>

      {res ? (
        <div className="mt-4 grid gap-2 text-sm">
          <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
            <span className="text-[var(--ink-soft)]">
              Total dividends over {Math.round(y)} years
            </span>
            <span className="tabular-nums font-medium">{money(res.totalDividends)}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-[var(--ink-soft)]">
              {reinvest ? "Ending balance (with DRIP)" : "Balance (dividends taken as cash)"}
            </span>
            <span className="tabular-nums font-semibold text-[var(--accent)]">
              {money(res.endingBalance)}
            </span>
          </div>
        </div>
      ) : null}

      {res && reinvest && res.balances.length > 1 ? (
        <div className="mt-6">
          <div className="text-sm font-medium mb-2">Balance growth with reinvested dividends</div>
          <AreaChart data={[Math.max(0, a), ...res.balances]} />
        </div>
      ) : null}

      <p className="mt-4 text-xs text-[var(--ink-soft)] leading-relaxed">
        This projects dividend income from the yield and an optional annual growth rate, and
        can reinvest payouts (DRIP) to compound your balance. It assumes no change in share
        price, so real results vary with the market. An estimate, not investment advice.
      </p>
    </ToolCard>
  );
}
