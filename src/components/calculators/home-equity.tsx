"use client";

import { useEffect, useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { SplitBar } from "@/components/chart";
import { ResultActions } from "@/components/result-actions";
import { NumberInput } from "@/components/number-input";
import { readParam, syncParams } from "@/lib/share";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

function pmt(principal: number, aprPct: number, years: number): number {
  const n = Math.round(years * 12);
  const r = aprPct / 100 / 12;
  if (principal <= 0 || n <= 0) return 0;
  return r === 0
    ? principal / n
    : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function HomeEquityCalculator() {
  const [value, setValue] = useState("400000");
  const [balance, setBalance] = useState("250000");
  const [cltv, setCltv] = useState("85");
  const [borrow, setBorrow] = useState("50000");
  const [rate, setRate] = useState("8.5");
  const [years, setYears] = useState("10");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const map: Record<string, (v: string) => void> = {
      value: setValue, bal: setBalance, cltv: setCltv, borrow: setBorrow,
      rate: setRate, years: setYears,
    };
    for (const [k, set] of Object.entries(map)) {
      const v = readParam(k);
      if (v) set(v);
    }
    const c = readParam("cur");
    if (c && (CURRENCIES as readonly string[]).includes(c)) setCurrency(c);
  }, []);

  useEffect(() => {
    syncParams({ value, bal: balance, cltv, borrow, rate, years, cur: currency });
  }, [value, balance, cltv, borrow, rate, years, currency]);

  const v = num(value);
  const b = num(balance);
  const cl = num(cltv);
  const bor = num(borrow);
  const r = num(rate);
  const y = num(years);

  const valid =
    v > 0 && b >= 0 && b <= v && Number.isFinite(cl) && cl > 0 && cl <= 100;

  const equity = valid ? v - b : NaN;
  const equityPct = valid ? (equity / v) * 100 : NaN;
  const maxDebt = valid ? (v * cl) / 100 : NaN;
  const available = valid ? Math.max(0, maxDebt - b) : NaN;

  const canPay =
    valid && bor > 0 && Number.isFinite(r) && r >= 0 && y > 0 && y <= 40;
  const n = canPay ? Math.round(y * 12) : 0;
  const payment = canPay ? pmt(bor, r, y) : NaN;
  const totalInterest = canPay ? payment * n - bor : NaN;
  const overLimit = valid && bor > available;

  const money = (x: number) => formatMoney(x, currency);

  const summary = canPay
    ? `Home equity: on a ${money(v)} home with a ${money(
        b,
      )} mortgage, up to ${money(available)} is available at ${cl}% CLTV. Borrowing ${money(
        bor,
      )} at ${r}% over ${y} years is ${money(payment)}/mo. via CalcLumen`
    : "";

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Home value">
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
        <Field label="Current mortgage balance">
          <NumberInput value={balance} onChange={setBalance} />
        </Field>
        <Field label="Max combined loan-to-value (CLTV %)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={cltv}
            onChange={(e) => setCltv(e.target.value)}
          />
        </Field>
        <Field label="Amount to borrow">
          <NumberInput value={borrow} onChange={setBorrow} />
        </Field>
        <Field label="Interest rate (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </Field>
        <Field label="Repayment term (years)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label="Available to borrow" accent value={valid ? money(available) : "—"} />
        <Stat label="Your home equity" value={valid ? money(equity) : "—"} />
        <Stat
          label="Equity in your home"
          value={Number.isFinite(equityPct) ? `${formatNumber(equityPct, 0)}%` : "—"}
        />
      </div>

      {canPay ? (
        <>
          <div className="mt-5 grid gap-2 text-sm">
            <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
              <span className="text-[var(--ink-soft)]">Monthly payment on {money(bor)}</span>
              <span className="tabular-nums font-semibold text-[var(--accent)]">
                {money(payment)}
              </span>
            </div>
            <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
              <span className="text-[var(--ink-soft)]">Total interest over {y} years</span>
              <span className="tabular-nums font-medium">{money(totalInterest)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[var(--ink-soft)]">Max total debt at {cl}% CLTV</span>
              <span className="tabular-nums font-medium">{money(maxDebt)}</span>
            </div>
          </div>

          <div className="mt-5">
            <SplitBar
              a={bor}
              b={Math.max(0, totalInterest)}
              aLabel={`Principal ${money(bor)}`}
              bLabel={`Interest ${money(totalInterest)}`}
            />
          </div>

          {overLimit ? (
            <p className="mt-3 text-xs text-[var(--ink-soft)] leading-relaxed">
              Heads up: {money(bor)} is more than the {money(available)} available at
              a {cl}% CLTV limit. Most lenders won't lend past that — lower the amount
              or check whether your lender allows a higher CLTV.
            </p>
          ) : null}

          <p className="mt-3 text-xs text-[var(--ink-soft)] leading-relaxed">
            Lenders usually cap your total mortgage debt at 80–90% of the home's value
            (the CLTV). Available credit here is that cap minus your current balance.
            HELOC rates are often variable; this is an estimate, not financial advice.
          </p>

          <div className="mt-4">
            <ResultActions summary={summary} />
          </div>
        </>
      ) : null}
    </ToolCard>
  );
}
