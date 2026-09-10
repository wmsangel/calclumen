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

/** Amortization schedule for the principal-and-interest part of the loan. */
function schedule(principal: number, annualRatePct: number, years: number) {
  const n = Math.round(years * 12);
  const r = annualRatePct / 100 / 12;
  const payment =
    principal <= 0
      ? 0
      : r === 0
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

export function MortgageCalculator() {
  const [price, setPrice] = useState("400000");
  const [down, setDown] = useState("80000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const [taxPct, setTaxPct] = useState("1.1");
  const [insAnnual, setInsAnnual] = useState("1500");
  const [pmiPct, setPmiPct] = useState("0.5");
  const [hoa, setHoa] = useState("0");
  const [currency, setCurrency] = useState("USD");
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const map: Record<string, (v: string) => void> = {
      price: setPrice, down: setDown, rate: setRate, years: setYears,
      tax: setTaxPct, ins: setInsAnnual, pmi: setPmiPct, hoa: setHoa,
    };
    for (const [k, set] of Object.entries(map)) {
      const v = readParam(k);
      if (v) set(v);
    }
    const c = readParam("cur");
    if (c && (CURRENCIES as readonly string[]).includes(c)) setCurrency(c);
  }, []);

  useEffect(() => {
    syncParams({
      price, down, rate, years, tax: taxPct, ins: insAnnual, pmi: pmiPct,
      hoa, cur: currency,
    });
  }, [price, down, rate, years, taxPct, insAnnual, pmiPct, hoa, currency]);

  const P = num(price);
  const D = num(down);
  const r = num(rate);
  const y = num(years);
  const tax = num(taxPct);
  const ins = num(insAnnual);
  const pmi = num(pmiPct);
  const hoaM = num(hoa);

  const valid =
    P > 0 && D >= 0 && D <= P && Number.isFinite(r) && r >= 0 && y > 0 && y <= 100;

  const loan = valid ? P - D : NaN;
  const downPct = valid && P > 0 ? (D / P) * 100 : NaN;
  const ltv = valid && P > 0 ? (loan / P) * 100 : NaN;
  const pmiApplies = valid && ltv > 80 && Number.isFinite(pmi) && pmi > 0;

  const calc = valid ? schedule(loan, r, y) : null;
  const taxMo = valid && Number.isFinite(tax) ? (P * tax) / 100 / 12 : 0;
  const insMo = valid && Number.isFinite(ins) ? ins / 12 : 0;
  const pmiMo = pmiApplies ? (loan * pmi) / 100 / 12 : 0;
  const hoaMo = valid && Number.isFinite(hoaM) ? hoaM : 0;
  const totalMo = calc ? calc.payment + taxMo + insMo + pmiMo + hoaMo : 0;

  const money = (v: number) => formatMoney(v, currency);

  const summary = calc
    ? `Mortgage on a ${money(P)} home, ${money(D)} down (${formatNumber(
        downPct,
        0,
      )}%) at ${r}% over ${y} years — total monthly payment ${money(
        totalMo,
      )} (P&I ${money(calc.payment)}), total interest ${money(
        calc.interest,
      )}. via CalcLumen`
    : "";

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Home price">
          <div className="flex gap-2">
            <NumberInput value={price} onChange={setPrice} />
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
        <Field label={`Down payment${valid ? ` (${formatNumber(downPct, 1)}%)` : ""}`}>
          <NumberInput value={down} onChange={setDown} />
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
        <Field label="Property tax (% / year)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={taxPct}
            onChange={(e) => setTaxPct(e.target.value)}
          />
        </Field>
        <Field label="Home insurance (/ year)">
          <NumberInput value={insAnnual} onChange={setInsAnnual} />
        </Field>
        <Field label="PMI (% / year, if <20% down)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={pmiPct}
            onChange={(e) => setPmiPct(e.target.value)}
          />
        </Field>
        <Field label="HOA (/ month)">
          <NumberInput value={hoa} onChange={setHoa} />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label="Monthly payment" accent value={calc ? money(totalMo) : "—"} />
        <Stat label="Loan amount" value={valid ? money(loan) : "—"} />
        <Stat label="Total interest" value={calc ? money(calc.interest) : "—"} />
      </div>

      {calc ? (
        <>
          <div className="mt-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)] mb-2">
              Monthly payment breakdown
            </div>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
                <span className="text-[var(--ink-soft)]">Principal &amp; interest</span>
                <span className="tabular-nums font-medium">{money(calc.payment)}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
                <span className="text-[var(--ink-soft)]">Property tax</span>
                <span className="tabular-nums font-medium">{money(taxMo)}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
                <span className="text-[var(--ink-soft)]">Home insurance</span>
                <span className="tabular-nums font-medium">{money(insMo)}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
                <span className="text-[var(--ink-soft)]">
                  PMI{pmiApplies ? "" : " (not required)"}
                </span>
                <span className="tabular-nums font-medium">{money(pmiMo)}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
                <span className="text-[var(--ink-soft)]">HOA</span>
                <span className="tabular-nums font-medium">{money(hoaMo)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-semibold">Total / month</span>
                <span className="tabular-nums font-semibold text-[var(--accent)]">
                  {money(totalMo)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)] mb-2">
              Loan balance over time
            </div>
            <AreaChart data={calc.balances} />
            <div className="mt-4">
              <SplitBar
                a={loan}
                b={calc.interest}
                aLabel={`Principal ${money(loan)}`}
                bLabel={`Interest ${money(calc.interest)}`}
              />
            </div>
          </div>

          <p className="mt-3 text-xs text-[var(--ink-soft)] leading-relaxed">
            {pmiApplies
              ? `With ${formatNumber(downPct, 0)}% down your loan-to-value is ${formatNumber(ltv, 0)}%, so PMI applies until you reach 20% equity.`
              : `With ${formatNumber(downPct, 0)}% down (loan-to-value ${formatNumber(ltv, 0)}%) no PMI is required.`}
          </p>

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
