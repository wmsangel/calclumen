"use client";

import { useEffect, useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { ResultActions } from "@/components/result-actions";
import { NumberInput } from "@/components/number-input";
import { readParam, syncParams } from "@/lib/share";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

function amortized(principal: number, annualRatePct: number, n: number) {
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

function trueApr(
  loanAmount: number,
  nominalRatePct: number,
  years: number,
  fees: number,
) {
  const n = Math.round(years * 12);
  const monthlyPayment = amortized(loanAmount, nominalRatePct, n);
  const net = loanAmount - fees;

  if (fees === 0) {
    return { apr: nominalRatePct, monthlyPayment, n, total: monthlyPayment * n };
  }

  // Solve net = monthlyPayment * (1 - (1+x)^-n) / x  for the monthly rate x.
  let lo = 0;
  let hi = 1;
  let x = 0;
  for (let i = 0; i < 60; i++) {
    x = (lo + hi) / 2;
    const pv = x === 0 ? monthlyPayment * n : (monthlyPayment * (1 - Math.pow(1 + x, -n))) / x;
    if (pv > net) lo = x;
    else hi = x;
  }

  return { apr: x * 12 * 100, monthlyPayment, n, total: monthlyPayment * n };
}

export function AprCalculator() {
  const [amount, setAmount] = useState("20000");
  const [rate, setRate] = useState("6");
  const [years, setYears] = useState("5");
  const [fees, setFees] = useState("500");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const a = readParam("amount");
    const r = readParam("rate");
    const y = readParam("years");
    const f = readParam("fees");
    const c = readParam("cur");
    if (a) setAmount(a);
    if (r) setRate(r);
    if (y) setYears(y);
    if (f) setFees(f);
    if (c && (CURRENCIES as readonly string[]).includes(c)) setCurrency(c);
  }, []);

  useEffect(() => {
    syncParams({ amount, rate, years, fees, cur: currency });
  }, [amount, rate, years, fees, currency]);

  const p = num(amount);
  const r = num(rate);
  const y = num(years);
  const f = num(fees);
  const valid =
    p > 0 &&
    Number.isFinite(r) &&
    r >= 0 &&
    y > 0 &&
    y <= 100 &&
    Number.isFinite(f) &&
    f >= 0 &&
    f < p;

  const calc = valid ? trueApr(p, r, y, f) : null;
  const money = (v: number) => formatMoney(v, currency);

  const summary = calc
    ? `Loan ${money(p)} at ${r}% nominal with ${money(
        f,
      )} in fees over ${y} years — true APR ${formatNumber(
        calc.apr,
        2,
      )}%, monthly payment ${money(calc.monthlyPayment)}. via CalcLumen`
    : "";

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Loan amount">
          <div className="flex gap-2">
            <NumberInput value={amount} onChange={setAmount} />
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
        <Field label="Nominal interest rate (APR %)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </Field>
        <Field label="Term (years)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </Field>
        <Field label="Fees (upfront)">
          <NumberInput value={fees} onChange={setFees} />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="True APR"
          accent
          value={calc ? `${formatNumber(calc.apr, 2)}%` : "—"}
        />
        <Stat
          label="Monthly payment"
          value={calc ? money(calc.monthlyPayment) : "—"}
        />
        <Stat
          label="Nominal rate"
          value={calc ? `${formatNumber(r, 2)}%` : "—"}
        />
        <Stat label="Total paid" value={calc ? money(calc.total) : "—"} />
      </div>

      {calc ? (
        <div className="mt-5">
          <ResultActions summary={summary} />
        </div>
      ) : null}
    </ToolCard>
  );
}
