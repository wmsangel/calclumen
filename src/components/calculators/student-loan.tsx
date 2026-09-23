"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { AreaChart, SplitBar } from "@/components/chart";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

/** Level payment for `principal` at monthly rate `r` over `n` months. */
function pmt(principal: number, r: number, n: number): number {
  if (principal <= 0 || n <= 0) return 0;
  return r === 0
    ? principal / n
    : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

interface Payoff {
  months: number;
  interest: number;
  balances: number[];
}

/** Amortize until paid off, tracking the balance each month. */
function amortize(principal: number, r: number, payment: number, cap = 720): Payoff {
  let bal = principal;
  let interest = 0;
  const balances = [bal];
  let months = 0;
  while (bal > 0.005 && months < cap) {
    const i = bal * r;
    const principalPart = payment - i;
    if (principalPart <= 0) return { months: Infinity, interest: Infinity, balances };
    interest += i;
    bal = Math.max(0, bal - principalPart);
    balances.push(bal);
    months += 1;
  }
  return { months, interest, balances };
}

function monthsLabel(m: number): string {
  if (!Number.isFinite(m)) return "—";
  const y = Math.floor(m / 12);
  const r = m % 12;
  if (y === 0) return `${r} mo`;
  if (r === 0) return `${y} yr`;
  return `${y} yr ${r} mo`;
}

export function StudentLoanCalculator() {
  const [amount, setAmount] = useState("35000");
  const [rate, setRate] = useState("6.53");
  const [years, setYears] = useState("10");
  const [extra, setExtra] = useState("0");
  const [grace, setGrace] = useState("0");
  const [currency, setCurrency] = useState("USD");

  const money = (v: number) => formatMoney(v, currency);

  const amt = num(amount);
  const ratePct = num(rate);
  const y = num(years);
  const ex = num(extra);
  const g = num(grace);

  const r = ratePct / 100 / 12;
  const ok =
    amt > 0 &&
    Number.isFinite(ratePct) &&
    ratePct >= 0 &&
    ratePct < 60 &&
    y > 0 &&
    y <= 40;

  const graceMonths = Number.isFinite(g) && g > 0 ? Math.min(Math.round(g), 120) : 0;
  // Unsubsidized loans accrue simple interest while you're in school or in the
  // grace period; that interest is then capitalized into the balance.
  const accrued = ok ? amt * r * graceMonths : NaN;
  const principal = ok ? amt + accrued : NaN;

  const n = ok ? Math.round(y * 12) : 0;
  const payment = ok ? pmt(principal, r, n) : NaN;
  const base = ok ? amortize(principal, r, payment) : null;

  const extraAmt = Number.isFinite(ex) && ex > 0 ? ex : 0;
  const withExtra =
    ok && extraAmt > 0 ? amortize(principal, r, payment + extraAmt) : null;

  const interestSaved =
    base && withExtra ? base.interest - withExtra.interest : NaN;
  const monthsSaved = base && withExtra ? base.months - withExtra.months : NaN;

  const totalInterest = withExtra ? withExtra.interest : base ? base.interest : NaN;
  const totalPaid = ok ? principal + totalInterest : NaN;
  const chart = withExtra ? withExtra.balances : base ? base.balances : null;

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
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </Field>
        <Field label="Repayment term (years)" hint="Federal standard plan is 10 years.">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </Field>
        <Field label="Extra monthly payment">
          <NumberInput value={extra} onChange={setExtra} />
        </Field>
        <Field
          label="Months in school / grace before repayment"
          hint="Unsubsidized loans accrue interest during this time; leave 0 if repayment starts now."
        >
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={grace}
            onChange={(e) => setGrace(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Monthly payment"
          accent
          value={ok ? money(payment + extraAmt) : "—"}
          sub={
            ok && extraAmt > 0
              ? `${money(payment)} required + ${money(extraAmt)} extra`
              : undefined
          }
        />
        <Stat
          label="Total interest"
          value={ok && Number.isFinite(totalInterest) ? money(totalInterest) : "—"}
        />
        <Stat
          label="Paid off in"
          value={withExtra ? monthsLabel(withExtra.months) : base ? monthsLabel(base.months) : "—"}
        />
      </div>

      {ok && base ? (
        <>
          <div className="mt-5 grid gap-2 text-sm">
            {graceMonths > 0 ? (
              <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
                <span className="text-[var(--ink-soft)]">
                  Interest accrued over {graceMonths} month
                  {graceMonths === 1 ? "" : "s"} before repayment (capitalized)
                </span>
                <span className="tabular-nums font-medium">{money(accrued)}</span>
              </div>
            ) : null}
            <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
              <span className="text-[var(--ink-soft)]">Balance when repayment starts</span>
              <span className="tabular-nums font-medium">{money(principal)}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
              <span className="text-[var(--ink-soft)]">Total paid over the loan</span>
              <span className="tabular-nums font-medium">{money(totalPaid)}</span>
            </div>
            {withExtra ? (
              <>
                <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
                  <span className="text-[var(--ink-soft)]">
                    Interest without the extra payment
                  </span>
                  <span className="tabular-nums font-medium">{money(base.interest)}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="font-semibold">Interest saved by paying extra</span>
                  <span className="tabular-nums font-semibold text-[var(--good)]">
                    {money(interestSaved)} · {monthsLabel(monthsSaved)} sooner
                  </span>
                </div>
              </>
            ) : null}
          </div>

          <div className="mt-5">
            <SplitBar
              a={principal}
              b={Math.max(0, totalInterest)}
              aLabel={`Principal ${money(principal)}`}
              bLabel={`Interest ${money(totalInterest)}`}
            />
          </div>

          {chart && chart.length > 2 ? (
            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
                Balance over time
              </div>
              <div className="mt-2">
                <AreaChart data={chart} />
              </div>
            </div>
          ) : null}

          <p className="mt-4 text-xs text-[var(--ink-soft)] leading-relaxed">
            A {money(amt)} loan at {formatNumber(ratePct, 2)}% on a {y}-year term costs{" "}
            {money(payment)} a month
            {extraAmt > 0
              ? `; adding ${money(extraAmt)} clears it in ${monthsLabel(
                  withExtra ? withExtra.months : NaN,
                )} instead of ${monthsLabel(base.months)}`
              : ""}
            . Federal loans have no prepayment penalty, so every extra dollar goes
            straight to principal. Estimate only — not financial advice.
          </p>
        </>
      ) : null}
    </ToolCard>
  );
}
