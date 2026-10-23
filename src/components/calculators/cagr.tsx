"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { AreaChart } from "@/components/chart";
import { cagr } from "@/lib/math/cagr";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function CagrCalculator() {
  const [begin, setBegin] = useState("1000");
  const [end, setEnd] = useState("2600");
  const [years, setYears] = useState("5");
  const [currency, setCurrency] = useState("USD");

  const b = num(begin);
  const e = num(end);
  const y = num(years);

  const valid = b > 0 && Number.isFinite(e) && e >= 0 && y > 0;
  const res = valid ? cagr(b, e, y) : null;
  const money = (x: number) => formatMoney(x, currency);
  const pct = (x: number) => `${formatNumber(x, 2)}%`;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Beginning value">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={begin}
              onChange={(ev) => setBegin(ev.target.value)}
            />
            <select
              className="field w-24"
              value={currency}
              onChange={(ev) => setCurrency(ev.target.value)}
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
        <Field label="Ending value">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={end}
            onChange={(ev) => setEnd(ev.target.value)}
          />
        </Field>
        <Field label="Number of years">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={years}
            onChange={(ev) => setYears(ev.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label="CAGR (per year)" accent value={res ? pct(res.cagrPct) : "—"} />
        <Stat label="Total return" value={res ? pct(res.totalReturnPct) : "—"} />
        <Stat label="Total gain" value={res ? money(res.gain) : "—"} />
      </div>

      {res && res.path.length > 1 ? (
        <div className="mt-6">
          <div className="text-sm font-medium mb-2">Smooth growth at the CAGR</div>
          <AreaChart data={res.path} />
        </div>
      ) : null}

      <p className="mt-4 text-xs text-[var(--ink-soft)] leading-relaxed">
        CAGR is the single yearly rate that would turn the beginning value into the ending
        value over the period: (end ÷ begin)<sup>1/years</sup> − 1. It smooths out the ups and
        downs, so a volatile investment and a steady one with the same start, end and span
        show the same CAGR. Past performance doesn&rsquo;t guarantee future returns.
      </p>
    </ToolCard>
  );
}
