"use client";

import { useEffect, useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { ResultActions } from "@/components/result-actions";
import { NumberInput } from "@/components/number-input";
import { readParam, syncParams } from "@/lib/share";
import { propertyTax } from "@/lib/math/property-tax";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function PropertyTaxCalculator() {
  const [value, setValue] = useState("350000");
  const [ratio, setRatio] = useState("100");
  const [rate, setRate] = useState("1.1");
  const [exemption, setExemption] = useState("0");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const map: Record<string, (v: string) => void> = {
      value: setValue, ratio: setRatio, rate: setRate, exempt: setExemption,
    };
    for (const [k, set] of Object.entries(map)) {
      const v = readParam(k);
      if (v) set(v);
    }
    const c = readParam("cur");
    if (c && (CURRENCIES as readonly string[]).includes(c)) setCurrency(c);
  }, []);

  useEffect(() => {
    syncParams({ value, ratio, rate, exempt: exemption, cur: currency });
  }, [value, ratio, rate, exemption, currency]);

  const v = num(value);
  const ra = num(ratio);
  const rt = num(rate);
  const ex = num(exemption);

  const valid =
    v > 0 &&
    Number.isFinite(ra) && ra > 0 && ra <= 100 &&
    Number.isFinite(rt) && rt >= 0 &&
    Number.isFinite(ex) && ex >= 0;

  const res = valid ? propertyTax(v, ra, rt, ex) : null;
  const money = (x: number) => formatMoney(x, currency);

  const summary = res
    ? `Property tax: a ${money(v)} home at ${rt}% is ${money(
        res.annual,
      )}/year (${money(res.monthly)}/mo), an effective rate of ${formatNumber(
        res.effectiveRatePct,
        2,
      )}%. via CalcLumen`
    : "";

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Home market value">
          <div className="flex gap-2">
            <NumberInput value={value} onChange={setValue} />
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
        <Field label="Property tax rate (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </Field>
        <Field label="Assessment ratio (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={ratio}
            onChange={(e) => setRatio(e.target.value)}
          />
        </Field>
        <Field label="Exemptions (e.g. homestead)">
          <NumberInput value={exemption} onChange={setExemption} />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label="Annual property tax" accent value={res ? money(res.annual) : "—"} />
        <Stat label="Monthly (for escrow)" value={res ? money(res.monthly) : "—"} />
        <Stat
          label="Effective tax rate"
          value={res ? `${formatNumber(res.effectiveRatePct, 2)}%` : "—"}
        />
      </div>

      {res ? (
        <>
          <div className="mt-5 grid gap-2 text-sm">
            <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
              <span className="text-[var(--ink-soft)]">Assessed value ({ratio}% of market)</span>
              <span className="tabular-nums font-medium">{money(res.assessed)}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
              <span className="text-[var(--ink-soft)]">Taxable value (after exemptions)</span>
              <span className="tabular-nums font-medium">{money(res.taxable)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[var(--ink-soft)]">Annual tax</span>
              <span className="tabular-nums font-semibold text-[var(--accent)]">
                {money(res.annual)}
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs text-[var(--ink-soft)] leading-relaxed">
            Rates are often quoted in mills — 1 mill is $1 per $1,000 of value, i.e. 0.1%.
            A 10-mill rate equals 1% here. Many areas also assess below market value and
            offer exemptions (homestead, senior, veteran), which lower the taxable amount.
            This is an estimate, not tax advice — check your local assessor for exact figures.
          </p>

          <div className="mt-4">
            <ResultActions summary={summary} />
          </div>
        </>
      ) : null}
    </ToolCard>
  );
}
