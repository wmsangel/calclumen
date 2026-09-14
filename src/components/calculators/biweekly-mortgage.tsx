"use client";

import { useEffect, useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { SplitBar } from "@/components/chart";
import { ResultActions } from "@/components/result-actions";
import { NumberInput } from "@/components/number-input";
import { readParam, syncParams } from "@/lib/share";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

function monthlyPayment(principal: number, aprPct: number, years: number): number {
  const n = Math.round(years * 12);
  const r = aprPct / 100 / 12;
  if (principal <= 0 || n <= 0) return 0;
  return r === 0
    ? principal / n
    : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/** Simulate paying half the monthly payment every two weeks (26 payments/yr). */
function biweeklySim(principal: number, aprPct: number, monthlyPmt: number) {
  const bwRate = aprPct / 100 / 26;
  const bwPmt = monthlyPmt / 2;
  let bal = principal;
  let periods = 0;
  let interest = 0;
  // Guard: if the payment can't cover interest it never amortizes.
  if (bwPmt <= bal * bwRate) return { periods: Infinity, interest: Infinity };
  while (bal > 0.005 && periods < 100000) {
    const int = bal * bwRate;
    let prin = bwPmt - int;
    if (prin > bal) prin = bal;
    bal -= prin;
    interest += int;
    periods++;
  }
  return { periods, interest };
}

export function BiweeklyMortgageCalculator() {
  const [amount, setAmount] = useState("320000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const [currency, setCurrency] = useState("USD");

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

  useEffect(() => {
    syncParams({ amount, rate, years, cur: currency });
  }, [amount, rate, years, currency]);

  const P = num(amount);
  const r = num(rate);
  const y = num(years);
  const valid = P > 0 && Number.isFinite(r) && r >= 0 && y > 0 && y <= 40;

  const monthly = valid ? monthlyPayment(P, r, y) : NaN;
  const monthlyMonths = valid ? Math.round(y * 12) : 0;
  const monthlyInterest = valid ? monthly * monthlyMonths - P : NaN;

  const bw = valid ? biweeklySim(P, r, monthly) : null;
  const bwPayment = valid ? monthly / 2 : NaN;
  const bwYears = bw && Number.isFinite(bw.periods) ? bw.periods / 26 : NaN;
  const interestSaved =
    bw && Number.isFinite(bw.interest) ? monthlyInterest - bw.interest : NaN;
  const yearsSaved = Number.isFinite(bwYears) ? y - bwYears : NaN;

  const money = (v: number) => formatMoney(v, currency);
  const fmtYears = (yy: number) => {
    const whole = Math.floor(yy);
    const months = Math.round((yy - whole) * 12);
    return months > 0 ? `${whole} yr ${months} mo` : `${whole} yr`;
  };

  const summary =
    bw && Number.isFinite(interestSaved)
      ? `Biweekly on a ${money(P)} mortgage at ${r}% over ${y} years: pay ${money(
          bwPayment,
        )} every 2 weeks instead of ${money(monthly)}/month, pay it off in about ${fmtYears(
          bwYears,
        )} and save ${money(interestSaved)} in interest. via CalcLumen`
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
        <Field label="Interest rate (%)">
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
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label="Biweekly payment" accent value={valid ? money(bwPayment) : "—"} />
        <Stat label="Interest saved" value={Number.isFinite(interestSaved) ? money(interestSaved) : "—"} />
        <Stat
          label="Paid off sooner"
          value={Number.isFinite(yearsSaved) ? fmtYears(yearsSaved) : "—"}
        />
      </div>

      {bw && Number.isFinite(interestSaved) ? (
        <>
          <div className="mt-5 grid gap-2 text-sm">
            <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
              <span className="text-[var(--ink-soft)]">Monthly plan — payment</span>
              <span className="tabular-nums font-medium">{money(monthly)}/mo</span>
            </div>
            <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
              <span className="text-[var(--ink-soft)]">Monthly plan — total interest</span>
              <span className="tabular-nums font-medium">{money(monthlyInterest)}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
              <span className="text-[var(--ink-soft)]">Biweekly plan — payoff time</span>
              <span className="tabular-nums font-medium">{fmtYears(bwYears)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="font-semibold">Biweekly plan — total interest</span>
              <span className="tabular-nums font-semibold text-[var(--accent)]">
                {money(bw.interest)}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <SplitBar
              a={Math.max(0, bw.interest)}
              b={Math.max(0, interestSaved)}
              aLabel={`Interest you'd still pay ${money(bw.interest)}`}
              bLabel={`Interest saved ${money(interestSaved)}`}
            />
          </div>

          <p className="mt-3 text-xs text-[var(--ink-soft)] leading-relaxed">
            Paying half your monthly payment every two weeks means 26 half-payments a
            year — the equivalent of one extra monthly payment. That extra principal
            each year shortens the loan by about {formatNumber(yearsSaved, 1)} years and
            saves {money(interestSaved)} in interest. Confirm your lender applies
            biweekly payments to principal and charges no fee. This is an estimate, not
            financial advice.
          </p>

          <div className="mt-4">
            <ResultActions summary={summary} />
          </div>
        </>
      ) : null}
    </ToolCard>
  );
}
