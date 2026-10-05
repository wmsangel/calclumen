"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

/** Monthly principal & interest for a fully amortizing loan. */
function monthlyPI(loan: number, annualRatePct: number, years: number): number {
  if (loan <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (n <= 0) return 0;
  if (r === 0) return loan / n;
  const f = Math.pow(1 + r, n);
  return (loan * r * f) / (f - 1);
}

export function RentalPropertyCalculator() {
  const [price, setPrice] = useState("300000");
  const [downPct, setDownPct] = useState("20");
  const [rate, setRate] = useState("7");
  const [term, setTerm] = useState("30");
  const [closing, setClosing] = useState("9000");
  const [rent, setRent] = useState("2600");
  const [expenses, setExpenses] = useState("780");
  const [currency, setCurrency] = useState("USD");

  const P = num(price);
  const d = num(downPct);
  const r = num(rate);
  const t = num(term);
  const c = num(closing);
  const R = num(rent);
  const E = num(expenses);

  const valid =
    Number.isFinite(P) && P > 0 &&
    Number.isFinite(d) && d >= 0 && d <= 100 &&
    Number.isFinite(r) && r >= 0 &&
    Number.isFinite(t) && t > 0 &&
    Number.isFinite(R) && R >= 0 &&
    Number.isFinite(E) && E >= 0 &&
    Number.isFinite(c) && c >= 0;

  let downPayment = NaN;
  let loan = NaN;
  let pi = NaN; // monthly principal & interest
  let cashFlow = NaN; // monthly
  let noiAnnual = NaN;
  let capRate = NaN;
  let cashInvested = NaN;
  let coc = NaN; // cash-on-cash %
  let dscr = NaN;
  let hasLoan = false;

  if (valid) {
    downPayment = (P * d) / 100;
    loan = P - downPayment;
    hasLoan = loan > 0;
    pi = monthlyPI(loan, r, t);
    const noiMonthly = R - E; // net operating income excludes debt service
    noiAnnual = noiMonthly * 12;
    cashFlow = noiMonthly - pi;
    capRate = (noiAnnual / P) * 100;
    cashInvested = downPayment + c;
    coc = cashInvested > 0 ? ((cashFlow * 12) / cashInvested) * 100 : NaN;
    const annualDebt = pi * 12;
    dscr = annualDebt > 0 ? noiAnnual / annualDebt : NaN;
  }

  const money = (v: number) => (valid ? formatMoney(v, currency) : "—");
  const pos = valid && cashFlow >= 0;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Purchase price">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <select
              className="field w-24"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              aria-label="Currency"
            >
              {CURRENCIES.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </div>
        </Field>
        <Field label="Down payment" hint="Percent of the purchase price">
          <div className="flex items-center gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={downPct}
              onChange={(e) => setDownPct(e.target.value)}
            />
            <span className="text-[var(--ink-soft)]">%</span>
          </div>
        </Field>
        <Field label="Interest rate (APR)">
          <div className="flex items-center gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
            <span className="text-[var(--ink-soft)]">%</span>
          </div>
        </Field>
        <Field label="Loan term (years)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </Field>
        <Field label="Closing & upfront costs" hint="Closing, rehab, fees — paid in cash">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={closing}
            onChange={(e) => setClosing(e.target.value)}
          />
        </Field>
        <Field label="Monthly rent" hint="Gross rental income">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
          />
        </Field>
        <Field
          label="Monthly operating expenses"
          hint="Tax, insurance, maintenance, management, vacancy — not the mortgage"
        >
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={expenses}
            onChange={(e) => setExpenses(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Monthly cash flow"
          accent
          value={money(cashFlow)}
          sub={valid ? (pos ? "Positive — income after the mortgage" : "Negative — property costs more than it earns") : undefined}
        />
        <Stat
          label="Cash-on-cash return"
          value={valid && Number.isFinite(coc) ? `${coc.toFixed(2)}%` : "—"}
          sub={valid ? `Annual cash flow ${money(cashFlow * 12)} ÷ cash invested` : undefined}
        />
        <Stat
          label="Cap rate"
          value={valid ? `${capRate.toFixed(2)}%` : "—"}
          sub={valid ? "NOI ÷ purchase price" : undefined}
        />
        <Stat
          label="DSCR"
          value={valid && hasLoan && Number.isFinite(dscr) ? dscr.toFixed(2) : valid && !hasLoan ? "No loan" : "—"}
          sub={valid && hasLoan ? "Lenders usually want ≥ 1.25" : undefined}
        />
        <Stat
          label="Net operating income (yr)"
          value={money(noiAnnual)}
          sub={valid ? "Rent − operating expenses, before debt" : undefined}
        />
        <Stat
          label="Total cash invested"
          value={money(cashInvested)}
          sub={valid ? `${money(downPayment)} down + ${money(c)} costs` : undefined}
        />
        <Stat label="Monthly mortgage (P&I)" value={money(pi)} />
        <Stat
          label="Loan amount"
          value={money(loan)}
          sub={valid ? `${d}% down` : undefined}
        />
      </div>

      <p className="mt-4 text-sm text-[var(--ink-soft)]">
        NOI deliberately excludes the mortgage — it measures the property itself,
        so cap rate and DSCR compare deals regardless of how they&apos;re financed.
        Cash flow and cash-on-cash then fold the loan back in to show what lands in
        your pocket. A realistic operating-expense figure should allow for vacancy
        and repairs, not just taxes and insurance; the common rule of thumb budgets
        40–50% of rent for a long-term rental. This is a pre-tax estimate and
        ignores appreciation, loan paydown and depreciation.
      </p>
    </ToolCard>
  );
}
