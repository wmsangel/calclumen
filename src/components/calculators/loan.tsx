"use client";

import { useEffect, useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { AreaChart, SplitBar } from "@/components/chart";
import { ResultActions } from "@/components/result-actions";
import { NumberInput } from "@/components/number-input";
import { readParam, syncParams } from "@/lib/share";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

interface YearRow {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

function schedule(principal: number, annualRatePct: number, years: number) {
  const n = Math.round(years * 12);
  const r = annualRatePct / 100 / 12;
  const payment =
    r === 0
      ? principal / n
      : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  let bal = principal;
  const balances = [principal];
  const rows: YearRow[] = [];
  let yPrin = 0;
  let yInt = 0;

  for (let m = 1; m <= n; m++) {
    const int = bal * r;
    let prin = payment - int;
    if (prin > bal) prin = bal;
    bal -= prin;
    yInt += int;
    yPrin += prin;
    if (m % 12 === 0 || m === n) {
      rows.push({
        year: Math.ceil(m / 12),
        principal: yPrin,
        interest: yInt,
        balance: Math.max(0, bal),
      });
      balances.push(Math.max(0, bal));
      yPrin = 0;
      yInt = 0;
    }
  }

  const total = payment * n;
  return { payment, total, interest: total - principal, n, balances, rows };
}

export function LoanCalculator() {
  const [amount, setAmount] = useState("250000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const [currency, setCurrency] = useState("USD");
  const [showTable, setShowTable] = useState(false);

  // hydrate from the URL once on mount (shareable links)
  useEffect(() => {
    const a = readParam("amount");
    const r = readParam("rate");
    const y = readParam("years");
    const c = readParam("cur");
    if (a) setAmount(a);
    if (r) setRate(r);
    if (y) setYears(y);
    if (c && (CURRENCIES as readonly string[]).includes(c)) setCurrency(c);
  }, []);

  // keep the URL in sync so results are linkable
  useEffect(() => {
    syncParams({ amount, rate, years, cur: currency });
  }, [amount, rate, years, currency]);

  const p = num(amount);
  const r = num(rate);
  const y = num(years);
  const valid = p > 0 && Number.isFinite(r) && r >= 0 && y > 0 && y <= 100;

  const calc = valid ? schedule(p, r, y) : null;
  const money = (v: number) => formatMoney(v, currency);

  const summary = calc
    ? `Loan ${money(p)} at ${r}% APR over ${y} years — monthly payment ${money(
        calc.payment,
      )}, total interest ${money(calc.interest)}, total cost ${money(
        calc.total,
      )}. via CalcLumen`
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
        <Field label="Interest rate (APR %)">
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
        <Field label="Payments">
          <input className="field" value={calc ? `${calc.n} monthly` : "—"} readOnly />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label="Monthly payment" accent value={calc ? money(calc.payment) : "—"} />
        <Stat label="Total interest" value={calc ? money(calc.interest) : "—"} />
        <Stat label="Total cost" value={calc ? money(calc.total) : "—"} />
      </div>

      {calc ? (
        <>
          <div className="mt-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)] mb-2">
              Balance over time
            </div>
            <AreaChart data={calc.balances} />
            <div className="mt-4">
              <SplitBar
                a={p}
                b={calc.interest}
                aLabel={`Principal ${money(p)}`}
                bLabel={`Interest ${money(calc.interest)}`}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <ResultActions summary={summary} />
            <button
              type="button"
              className="text-sm font-medium text-[var(--accent)]"
              onClick={() => setShowTable((v) => !v)}
            >
              {showTable ? "Hide" : "Show"} amortization schedule
            </button>
          </div>

          {showTable ? (
            <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--rule)]">
              <table className="w-full text-sm tabular-nums">
                <thead>
                  <tr className="text-left text-[var(--ink-soft)] border-b border-[var(--rule)]">
                    <th className="px-3 py-2 font-medium">Year</th>
                    <th className="px-3 py-2 font-medium">Principal</th>
                    <th className="px-3 py-2 font-medium">Interest</th>
                    <th className="px-3 py-2 font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {calc.rows.map((row) => (
                    <tr key={row.year} className="border-b border-[var(--rule)] last:border-0">
                      <td className="px-3 py-1.5">{row.year}</td>
                      <td className="px-3 py-1.5">{formatNumber(row.principal, 0)}</td>
                      <td className="px-3 py-1.5">{formatNumber(row.interest, 0)}</td>
                      <td className="px-3 py-1.5">{formatNumber(row.balance, 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </>
      ) : null}
    </ToolCard>
  );
}
