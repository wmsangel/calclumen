"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";
import { ResultActions } from "@/components/result-actions";
import { extraPayment } from "@/lib/math/extra-payment";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));
const usd = (n: number) => formatMoney(Math.round(n), "USD");

function yrs(months: number): string {
  if (!Number.isFinite(months)) return "never";
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} mo`;
  return m ? `${y} yr ${m} mo` : `${y} yr`;
}

export function ExtraPaymentCalculator() {
  const [balance, setBalance] = useState("300000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const [extraMonthly, setExtraMonthly] = useState("200");
  const [extraYearly, setExtraYearly] = useState("0");
  const [yearlyMonth, setYearlyMonth] = useState("12");
  const [oneTime, setOneTime] = useState("0");
  const [oneTimeMonth, setOneTimeMonth] = useState("1");

  const bal = num(balance);
  const r = num(rate);
  const y = num(years);
  const valid = bal > 0 && Number.isFinite(r) && r >= 0 && y > 0;

  const res = valid
    ? extraPayment({
        balance: bal,
        annualRatePct: r,
        termMonths: Math.round(y * 12),
        extraMonthly: num(extraMonthly) || 0,
        extraYearly: num(extraYearly) || 0,
        extraYearlyMonth: num(yearlyMonth) || 12,
        oneTime: num(oneTime) || 0,
        oneTimeMonth: num(oneTimeMonth) || 1,
      })
    : null;

  const summary = res
    ? `Extra payments on ${usd(bal)} at ${r}%: paid off in ${yrs(res.withExtra.months)} instead of ${yrs(res.base.months)} (${yrs(res.monthsSaved)} sooner), interest ${usd(res.withExtra.totalInterest)} vs ${usd(res.base.totalInterest)} — ${usd(res.interestSaved)} saved. Scheduled payment ${usd(res.scheduledPayment)}/mo.`
    : "";

  const maxYears = res ? Math.max(res.base.yearEndBalances.length, res.withExtra.yearEndBalances.length) : 0;
  const rows = res
    ? Array.from({ length: maxYears }, (_, i) => ({
        year: i + 1,
        base: res.base.yearEndBalances[i] ?? 0,
        extra: res.withExtra.yearEndBalances[i] ?? 0,
      })).filter((row, i, arr) => i < 10 || i === arr.length - 1 || (i + 1) % 5 === 0)
    : [];

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Loan balance" hint="Current balance, or the amount for a new loan">
          <NumberInput value={balance} onChange={setBalance} />
        </Field>
        <Field label="Interest rate (%)">
          <input className="field" type="number" inputMode="decimal" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Remaining term (years)">
          <input className="field" type="number" inputMode="decimal" step="0.5" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
        <Field label="Extra payment every month" hint="Added to principal on top of the scheduled payment">
          <NumberInput value={extraMonthly} onChange={setExtraMonthly} />
        </Field>
        <Field label="Extra lump sum once a year" hint="e.g. a bonus or tax refund">
          <NumberInput value={extraYearly} onChange={setExtraYearly} />
        </Field>
        <Field label="…paid in month (1–12)" hint="Month of the year the yearly sum is paid">
          <input className="field" type="number" inputMode="numeric" min={1} max={12} value={yearlyMonth} onChange={(e) => setYearlyMonth(e.target.value)} />
        </Field>
        <Field label="One-time extra payment">
          <NumberInput value={oneTime} onChange={setOneTime} />
        </Field>
        <Field label="…paid in payment number" hint="1 = the first payment from today">
          <input className="field" type="number" inputMode="numeric" min={1} value={oneTimeMonth} onChange={(e) => setOneTimeMonth(e.target.value)} />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Interest saved" accent value={res ? usd(res.interestSaved) : "—"} sub={res ? `${usd(res.withExtra.totalInterest)} instead of ${usd(res.base.totalInterest)}` : undefined} />
        <Stat label="Paid off sooner by" value={res ? yrs(res.monthsSaved) : "—"} sub={res ? `${yrs(res.withExtra.months)} instead of ${yrs(res.base.months)}` : undefined} />
        <Stat label="Scheduled payment" value={res ? `${usd(res.scheduledPayment)}/mo` : "—"} sub={res && res.totalExtraPaid > 0 ? `Plus ${usd(res.totalExtraPaid)} of extra payments in total` : undefined} />
      </div>

      {res && rows.length ? (
        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)] mb-2">Balance at year end</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--ink-soft)]">
                  <th className="py-1.5 pr-3 font-medium">Year</th>
                  <th className="py-1.5 pr-3 text-right font-medium">Scheduled only</th>
                  <th className="py-1.5 text-right font-medium">With extra payments</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.year} className="border-t border-[var(--rule)]">
                    <td className="py-1.5 pr-3">{row.year}</td>
                    <td className="py-1.5 pr-3 text-right">{usd(row.base)}</td>
                    <td className="py-1.5 text-right font-medium">{usd(row.extra)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <ResultActions summary={summary} />
          </div>
        </div>
      ) : null}
    </ToolCard>
  );
}
