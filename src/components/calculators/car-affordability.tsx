"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";
import { SplitBar } from "@/components/chart";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function CarAffordabilityCalculator() {
  const [monthlyBudget, setMonthlyBudget] = useState("400");
  const [downPayment, setDownPayment] = useState("3000");
  const [tradeInValue, setTradeInValue] = useState("0");
  const [loanTermMonths, setLoanTermMonths] = useState("60");
  const [apr, setApr] = useState("6.5");
  const [salesTaxRate, setSalesTaxRate] = useState("7");
  const [currency, setCurrency] = useState("USD");

  const pmt = num(monthlyBudget);
  const dp = num(downPayment);
  const ti = num(tradeInValue);
  const n = num(loanTermMonths);
  const a = num(apr);
  const tax = num(salesTaxRate);

  const valid =
    pmt > 0 &&
    Number.isFinite(dp) &&
    dp >= 0 &&
    Number.isFinite(ti) &&
    ti >= 0 &&
    n > 0 &&
    Number.isFinite(a) &&
    a >= 0 &&
    Number.isFinite(tax) &&
    tax >= 0;

  let principal = NaN;
  let price = NaN;
  let salesTax = NaN;
  let totalInterest = NaN;

  if (valid) {
    const r = a / 100 / 12;
    principal = r === 0 ? pmt * n : (pmt * (1 - Math.pow(1 + r, -n))) / r;
    const t = tax / 100;
    // principal + down = (price - tradeIn) * (1 + t)  →  solve for price
    price = ti + (principal + dp) / (1 + t);
    salesTax = Math.max(0, (price - ti)) * t;
    totalInterest = pmt * n - principal;
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Monthly payment budget">
          <div className="flex gap-2">
            <NumberInput value={monthlyBudget} onChange={setMonthlyBudget} />
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

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Car price you can afford"
          accent
          value={valid ? formatMoney(price, currency) : "—"}
        />
        <Stat
          label="Loan amount"
          value={valid ? formatMoney(principal, currency) : "—"}
        />
        <Stat
          label="Estimated sales tax"
          value={valid ? formatMoney(salesTax, currency) : "—"}
        />
        <Stat
          label="Total interest"
          value={valid ? formatMoney(totalInterest, currency) : "—"}
        />
      </div>

      {valid ? (
        <div className="mt-6">
          <SplitBar
            a={dp + ti}
            b={principal}
            aLabel={`Cash down + trade-in ${formatMoney(dp + ti, currency)}`}
            bLabel={`Financed ${formatMoney(principal, currency)}`}
          />
        </div>
      ) : null}
    </ToolCard>
  );
}
