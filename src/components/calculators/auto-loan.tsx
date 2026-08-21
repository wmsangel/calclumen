"use client";

import { useEffect, useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";
import { SplitBar } from "@/components/chart";
import { ResultActions } from "@/components/result-actions";
import { readParam, syncParams } from "@/lib/share";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function AutoLoanCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState("30000");
  const [downPayment, setDownPayment] = useState("3000");
  const [tradeInValue, setTradeInValue] = useState("0");
  const [salesTaxRate, setSalesTaxRate] = useState("7");
  const [loanTermMonths, setLoanTermMonths] = useState("60");
  const [apr, setApr] = useState("6.5");
  const [fees, setFees] = useState("500");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const map: [string, (v: string) => void][] = [
      ["price", setVehiclePrice],
      ["down", setDownPayment],
      ["trade", setTradeInValue],
      ["tax", setSalesTaxRate],
      ["term", setLoanTermMonths],
      ["apr", setApr],
      ["fees", setFees],
    ];
    for (const [key, set] of map) {
      const v = readParam(key);
      if (v) set(v);
    }
    const c = readParam("cur");
    if (c && (CURRENCIES as readonly string[]).includes(c)) setCurrency(c);
  }, []);

  useEffect(() => {
    syncParams({
      price: vehiclePrice,
      down: downPayment,
      trade: tradeInValue,
      tax: salesTaxRate,
      term: loanTermMonths,
      apr,
      fees,
      cur: currency,
    });
  }, [vehiclePrice, downPayment, tradeInValue, salesTaxRate, loanTermMonths, apr, fees, currency]);

  const vp = num(vehiclePrice);
  const dp = num(downPayment);
  const ti = num(tradeInValue);
  const tax = num(salesTaxRate);
  const n = num(loanTermMonths);
  const a = num(apr);
  const f = num(fees);

  const valid =
    vp > 0 &&
    Number.isFinite(dp) &&
    Number.isFinite(ti) &&
    Number.isFinite(tax) &&
    n > 0 &&
    Number.isFinite(a) &&
    Number.isFinite(f);

  let monthly = NaN;
  let principal = NaN;
  let salesTax = NaN;
  let totalInterest = NaN;
  let totalCost = NaN;

  if (valid) {
    const taxable = Math.max(0, vp - ti);
    salesTax = (taxable * tax) / 100;
    principal = vp + salesTax + f - dp - ti;
    const r = a / 100 / 12;
    monthly = r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n));
    totalInterest = monthly * n - principal;
    totalCost = monthly * n + dp + ti;
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Vehicle price">
          <div className="flex gap-2">
            <NumberInput value={vehiclePrice} onChange={setVehiclePrice} />
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
        <Field label="Down payment">
          <NumberInput value={downPayment} onChange={setDownPayment} />
        </Field>
        <Field label="Trade-in value">
          <NumberInput value={tradeInValue} onChange={setTradeInValue} />
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
        <Field label="Loan term (months)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={loanTermMonths}
            onChange={(e) => setLoanTermMonths(e.target.value)}
          />
        </Field>
        <Field label="APR (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={apr}
            onChange={(e) => setApr(e.target.value)}
          />
        </Field>
        <Field label="Fees">
          <NumberInput value={fees} onChange={setFees} />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Monthly payment"
          accent
          value={valid ? formatMoney(monthly, currency) : "—"}
        />
        <Stat
          label="Loan amount"
          value={valid ? formatMoney(principal, currency) : "—"}
        />
        <Stat
          label="Total interest"
          value={valid ? formatMoney(totalInterest, currency) : "—"}
        />
        <Stat
          label="Sales tax"
          value={valid ? formatMoney(salesTax, currency) : "—"}
        />
        <Stat
          label="Total cost"
          value={valid ? formatMoney(totalCost, currency) : "—"}
        />
      </div>

      {valid ? (
        <div className="mt-6">
          <SplitBar
            a={principal}
            b={totalInterest}
            aLabel={`Loan ${formatMoney(principal, currency)}`}
            bLabel={`Interest ${formatMoney(totalInterest, currency)}`}
          />
        </div>
      ) : null}

      {valid ? (
        <div className="mt-5 no-print">
          <ResultActions
            summary={`Car loan: ${formatMoney(monthly, currency)}/mo on a ${formatMoney(principal, currency)} loan (${apr}% APR, ${loanTermMonths} months). Total cost ${formatMoney(totalCost, currency)}. — via calclumen.com`}
          />
        </div>
      ) : null}
    </ToolCard>
  );
}
