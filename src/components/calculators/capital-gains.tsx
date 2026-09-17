"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { MultiBar } from "@/components/chart";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

type Status = "single" | "mfj" | "hoh";

// 2025 federal brackets. Each entry is [income at which the rate starts, rate].
const LTCG: Record<Status, [number, number][]> = {
  single: [[0, 0], [48350, 0.15], [533400, 0.2]],
  mfj: [[0, 0], [96700, 0.15], [600050, 0.2]],
  hoh: [[0, 0], [64750, 0.15], [566700, 0.2]],
};
const ORDINARY: Record<Status, [number, number][]> = {
  single: [[0, 0.1], [11925, 0.12], [48475, 0.22], [103350, 0.24], [197300, 0.32], [250525, 0.35], [626350, 0.37]],
  mfj: [[0, 0.1], [23850, 0.12], [96950, 0.22], [206700, 0.24], [394600, 0.32], [501050, 0.35], [751600, 0.37]],
  hoh: [[0, 0.1], [17000, 0.12], [64850, 0.22], [103350, 0.24], [197300, 0.32], [250500, 0.35], [626350, 0.37]],
};

function rateFor(table: [number, number][], income: number): number {
  let r = table[0][1];
  for (const [threshold, rate] of table) if (income >= threshold) r = rate;
  return r;
}

export function CapitalGainsCalculator() {
  const [basis, setBasis] = useState("10000");
  const [sale, setSale] = useState("18000");
  const [holding, setHolding] = useState<"long" | "short">("long");
  const [status, setStatus] = useState<Status>("single");
  const [income, setIncome] = useState("80000");
  const [stateRate, setStateRate] = useState("0");
  const [currency, setCurrency] = useState("USD");

  const cb = num(basis);
  const sp = num(sale);
  const inc = num(income);
  const sr = num(stateRate);

  const valid =
    Number.isFinite(cb) &&
    cb >= 0 &&
    Number.isFinite(sp) &&
    sp >= 0 &&
    Number.isFinite(inc) &&
    inc >= 0 &&
    Number.isFinite(sr) &&
    sr >= 0 &&
    sr < 100;

  let gain = NaN;
  let fedRate = NaN;
  let fedTax = NaN;
  let stateTax = NaN;
  let totalTax = NaN;
  let netProfit = NaN;
  let effRate = NaN;

  if (valid) {
    gain = sp - cb;
    const gainPos = Math.max(0, gain);
    fedRate =
      holding === "long" ? rateFor(LTCG[status], inc) : rateFor(ORDINARY[status], inc);
    fedTax = gainPos * fedRate;
    stateTax = gainPos * (sr / 100);
    totalTax = fedTax + stateTax;
    netProfit = gain - totalTax;
    effRate = gainPos > 0 ? totalTax / gainPos : 0;
  }

  const isLoss = valid && gain < 0;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Purchase price (cost basis)">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={basis}
              onChange={(e) => setBasis(e.target.value)}
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
        <Field label="Sale price (proceeds)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={sale}
            onChange={(e) => setSale(e.target.value)}
          />
        </Field>
        <Field label="Holding period">
          <select
            className="field"
            value={holding}
            onChange={(e) => setHolding(e.target.value as "long" | "short")}
          >
            <option value="long">Long-term (held over 1 year)</option>
            <option value="short">Short-term (held 1 year or less)</option>
          </select>
        </Field>
        <Field label="Filing status">
          <select
            className="field"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            <option value="single">Single</option>
            <option value="mfj">Married filing jointly</option>
            <option value="hoh">Head of household</option>
          </select>
        </Field>
        <Field label="Annual taxable income">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
        </Field>
        <Field label="State tax rate (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={stateRate}
            onChange={(e) => setStateRate(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label={isLoss ? "Capital loss" : "Capital gain"}
          accent
          value={valid ? formatMoney(gain, currency) : "—"}
        />
        <Stat
          label={
            valid
              ? `Federal tax (${holding === "long" ? "long" : "short"}-term, ${Math.round(fedRate * 100)}%)`
              : "Federal tax"
          }
          value={valid ? formatMoney(fedTax, currency) : "—"}
        />
        <Stat label="State tax" value={valid ? formatMoney(stateTax, currency) : "—"} />
        <Stat label="Total tax" value={valid ? formatMoney(totalTax, currency) : "—"} />
        <Stat
          label="After-tax profit"
          value={valid ? formatMoney(netProfit, currency) : "—"}
        />
        <Stat
          label="Effective tax rate"
          value={valid ? `${(effRate * 100).toFixed(1)}%` : "—"}
        />
      </div>

      {isLoss ? (
        <p className="mt-4 text-sm text-[var(--ink-soft)]">
          You have a capital loss, so no capital-gains tax is due. Losses can
          offset other capital gains and up to $3,000 of ordinary income per
          year, with the rest carried forward.
        </p>
      ) : valid && gain > 0 ? (
        <div className="mt-6">
          <MultiBar
            segments={[
              { label: "After-tax profit", value: Math.max(0, netProfit), color: "var(--good)" },
              { label: "Federal tax", value: Math.max(0, fedTax), color: "var(--accent)" },
              { label: "State tax", value: Math.max(0, stateTax), color: "var(--ink-soft)" },
            ]}
          />
        </div>
      ) : null}
    </ToolCard>
  );
}
