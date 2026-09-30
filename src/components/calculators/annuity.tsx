"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";
import { AreaChart, SplitBar } from "@/components/chart";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

type Timing = "end" | "begin";

// Standard annuity formulas with periodic rate r over n periods:
//   FV = PMT × ((1 + r)^n − 1) / r      PV = PMT × (1 − (1 + r)^−n) / r
// An annuity due (payments at the start of each period) multiplies both by (1 + r).
const PERIODS: { value: string; label: string; perYear: number }[] = [
  { value: "12", label: "Monthly", perYear: 12 },
  { value: "4", label: "Quarterly", perYear: 4 },
  { value: "1", label: "Yearly", perYear: 1 },
];

export function AnnuityCalculator() {
  const [payment, setPayment] = useState("500");
  const [rate, setRate] = useState("6");
  const [years, setYears] = useState("20");
  const [freq, setFreq] = useState("12");
  const [timing, setTiming] = useState<Timing>("end");
  const [currency, setCurrency] = useState("USD");

  const pmt = num(payment);
  const annual = num(rate);
  const y = num(years);
  const perYear = Number(freq);

  const valid =
    Number.isFinite(pmt) &&
    pmt >= 0 &&
    Number.isFinite(annual) &&
    annual >= 0 &&
    annual <= 100 &&
    Number.isFinite(y) &&
    y > 0 &&
    y <= 100;

  let fv = NaN;
  let pv = NaN;
  let totalPaid = NaN;
  let interest = NaN;
  let series: number[] = [];

  if (valid) {
    const r = annual / 100 / perYear;
    const n = Math.round(y * perYear);
    const due = timing === "begin" ? 1 + r : 1;
    if (r === 0) {
      fv = pmt * n;
      pv = pmt * n;
    } else {
      fv = (pmt * (Math.pow(1 + r, n) - 1)) / r * due;
      pv = (pmt * (1 - Math.pow(1 + r, -n))) / r * due;
    }
    totalPaid = pmt * n;
    interest = fv - totalPaid;

    // Balance at the end of each year, for the growth chart.
    series = [0];
    for (let yr = 1; yr <= Math.ceil(y); yr++) {
      const k = Math.min(n, yr * perYear);
      series.push(
        r === 0 ? pmt * k : ((pmt * (Math.pow(1 + r, k) - 1)) / r) * due,
      );
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Payment per period">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
            />
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
        <Field label="Annual interest rate (%)">
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
            inputMode="decimal"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </Field>
        <Field label="Payment frequency">
          <select
            className="field"
            value={freq}
            onChange={(e) => setFreq(e.target.value)}
          >
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-4">
        <Segmented<Timing>
          value={timing}
          onChange={setTiming}
          options={[
            { value: "end", label: "Ordinary annuity (end of period)" },
            { value: "begin", label: "Annuity due (start of period)" },
          ]}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Future value"
          accent
          value={valid ? formatMoney(fv, currency) : "—"}
          sub="What the payments grow to by the end"
        />
        <Stat
          label="Present value"
          value={valid ? formatMoney(pv, currency) : "—"}
          sub="Lump sum worth the same stream today"
        />
        <Stat
          label="Total payments"
          value={valid ? formatMoney(totalPaid, currency) : "—"}
        />
        <Stat
          label="Interest earned"
          value={valid ? formatMoney(interest, currency) : "—"}
        />
      </div>

      {valid && fv > 0 ? (
        <div className="mt-6 space-y-4">
          <AreaChart data={series} />
          <SplitBar
            a={Math.max(0, totalPaid)}
            b={Math.max(0, interest)}
            aLabel="Payments"
            bLabel="Interest"
            bColor="var(--accent-2)"
          />
        </div>
      ) : null}

      <p className="mt-4 text-sm text-[var(--ink-soft)]">
        Assumes a fixed payment and a constant rate compounded once per payment
        period. Real annuity contracts add fees, surrender charges and
        insurance costs, and payout annuities quote their own rates — use this
        to compare, not as a quote.
      </p>
    </ToolCard>
  );
}
