"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { MultiBar } from "@/components/chart";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

// SECA rates: you pay on 92.35% of net profit; Social Security 12.4% up to the
// annual wage base, Medicare 2.9% with no cap. Wage base is editable (changes
// yearly; default is the 2025 figure).
const SE_BASE = 0.9235;
const SS_RATE = 0.124;
const MEDICARE_RATE = 0.029;

export function SelfEmploymentTaxCalculator() {
  const [profit, setProfit] = useState("80000");
  const [wageBase, setWageBase] = useState("176100");
  const [currency, setCurrency] = useState("USD");

  const p = num(profit);
  const wb = num(wageBase);

  const valid =
    Number.isFinite(p) && p >= 0 && Number.isFinite(wb) && wb >= 0;

  let taxable = NaN;
  let ss = NaN;
  let medicare = NaN;
  let seTax = NaN;
  let deductible = NaN;
  let effective = NaN;

  if (valid) {
    taxable = p * SE_BASE;
    ss = Math.min(taxable, wb) * SS_RATE;
    medicare = taxable * MEDICARE_RATE;
    seTax = ss + medicare;
    deductible = seTax / 2;
    effective = p > 0 ? seTax / p : 0;
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Net self-employment profit (yearly)">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={profit}
              onChange={(e) => setProfit(e.target.value)}
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
        <Field label="Social Security wage base">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={wageBase}
            onChange={(e) => setWageBase(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Self-employment tax"
          accent
          value={valid ? formatMoney(seTax, currency) : "—"}
          sub={valid ? `${(effective * 100).toFixed(1)}% of net profit` : undefined}
        />
        <Stat
          label="Deductible half (income-tax deduction)"
          value={valid ? formatMoney(deductible, currency) : "—"}
        />
        <Stat
          label="Social Security (12.4%)"
          value={valid ? formatMoney(ss, currency) : "—"}
        />
        <Stat
          label="Medicare (2.9%)"
          value={valid ? formatMoney(medicare, currency) : "—"}
        />
        <Stat
          label="Taxable SE earnings (92.35%)"
          value={valid ? formatMoney(taxable, currency) : "—"}
        />
        <Stat
          label="Effective SE-tax rate"
          value={valid ? `${(effective * 100).toFixed(2)}%` : "—"}
        />
      </div>

      {valid && seTax > 0 ? (
        <div className="mt-6">
          <MultiBar
            segments={[
              { label: "Social Security", value: Math.max(0, ss), color: "var(--accent)" },
              { label: "Medicare", value: Math.max(0, medicare), color: "var(--accent-2)" },
            ]}
          />
        </div>
      ) : null}

      <p className="mt-4 text-sm text-[var(--ink-soft)]">
        This is US self-employment (SECA) tax only — separate from income tax.
        You pay it on 92.35% of net profit; the 12.4% Social Security part stops
        at the wage base, Medicare&rsquo;s 2.9% has no cap. Half is deductible on
        your income taxes. High earners also owe an extra 0.9% Medicare tax above
        $200k (single) / $250k (married). Figures change yearly.
      </p>
    </ToolCard>
  );
}
