"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function AutoLeaseCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState("35000");
  const [capCost, setCapCost] = useState("35000");
  const [downPayment, setDownPayment] = useState("2000");
  const [residualPercent, setResidualPercent] = useState("57");
  const [leaseTermMonths, setLeaseTermMonths] = useState("36");
  const [moneyFactor, setMoneyFactor] = useState("0.00125");
  const [salesTaxRate, setSalesTaxRate] = useState("7");
  const [currency, setCurrency] = useState("USD");

  const vp = num(vehiclePrice);
  const cap = num(capCost);
  const dp = num(downPayment);
  const rp = num(residualPercent);
  const n = num(leaseTermMonths);
  const mf = num(moneyFactor);
  const tax = num(salesTaxRate);

  const valid =
    vp > 0 &&
    Number.isFinite(cap) &&
    Number.isFinite(dp) &&
    Number.isFinite(rp) &&
    n > 0 &&
    Number.isFinite(mf) &&
    Number.isFinite(tax);

  let monthlyPayment = NaN;
  let depreciationFee = NaN;
  let financeFee = NaN;
  let residualValue = NaN;
  let apr = NaN;

  if (valid) {
    const adjustedCap = cap - dp;
    residualValue = (vp * rp) / 100;
    depreciationFee = (adjustedCap - residualValue) / n;
    financeFee = (adjustedCap + residualValue) * mf;
    const basePayment = depreciationFee + financeFee;
    monthlyPayment = basePayment * (1 + tax / 100);
    apr = mf * 2400;
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Vehicle price (MSRP)">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(e.target.value)}
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
        <Field label="Capitalized cost (negotiated)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={capCost}
            onChange={(e) => setCapCost(e.target.value)}
          />
        </Field>
        <Field label="Down payment">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
          />
        </Field>
        <Field label="Residual (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={residualPercent}
            onChange={(e) => setResidualPercent(e.target.value)}
          />
        </Field>
        <Field label="Lease term (months)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={leaseTermMonths}
            onChange={(e) => setLeaseTermMonths(e.target.value)}
          />
        </Field>
        <Field label="Money factor" hint="e.g. 0.00125">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={moneyFactor}
            onChange={(e) => setMoneyFactor(e.target.value)}
          />
        </Field>
        <Field label="Sales tax rate (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={salesTaxRate}
            onChange={(e) => setSalesTaxRate(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Monthly lease payment"
          accent
          value={valid ? formatMoney(monthlyPayment, currency) : "—"}
        />
        <Stat
          label="Depreciation fee"
          value={valid ? formatMoney(depreciationFee, currency) : "—"}
        />
        <Stat
          label="Finance fee"
          value={valid ? formatMoney(financeFee, currency) : "—"}
        />
        <Stat
          label="Residual value"
          value={valid ? formatMoney(residualValue, currency) : "—"}
        />
        <Stat
          label="Equivalent APR"
          value={valid ? `${formatNumber(apr, 2)}%` : "—"}
        />
      </div>
    </ToolCard>
  );
}
