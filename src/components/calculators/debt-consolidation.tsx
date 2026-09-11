"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { SplitBar } from "@/components/chart";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

interface DebtRow {
  balance: string;
  apr: string;
}

function pmt(principal: number, aprPct: number, years: number): number {
  const n = Math.round(years * 12);
  const r = aprPct / 100 / 12;
  if (principal <= 0 || n <= 0) return 0;
  return r === 0
    ? principal / n
    : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function DebtConsolidationCalculator() {
  const [rows, setRows] = useState<DebtRow[]>([
    { balance: "8000", apr: "22" },
    { balance: "5000", apr: "19.5" },
    { balance: "3000", apr: "24" },
  ]);
  const [newApr, setNewApr] = useState("12");
  const [years, setYears] = useState("3");
  const [currency, setCurrency] = useState("USD");

  const money = (v: number) => formatMoney(v, currency);

  const setRow = (i: number, key: keyof DebtRow, val: string) =>
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [key]: val } : r)));
  const addRow = () => setRows((rs) => [...rs, { balance: "", apr: "" }]);
  const removeRow = (i: number) =>
    setRows((rs) => (rs.length > 1 ? rs.filter((_, j) => j !== i) : rs));

  const valid = rows
    .map((r) => ({ b: num(r.balance), a: num(r.apr) }))
    .filter((r) => r.b > 0 && Number.isFinite(r.a) && r.a >= 0);

  const total = valid.reduce((s, r) => s + r.b, 0);
  const weightedApr =
    total > 0 ? valid.reduce((s, r) => s + r.b * r.a, 0) / total : NaN;

  const na = num(newApr);
  const y = num(years);
  const ok = total > 0 && Number.isFinite(na) && na >= 0 && y > 0 && y <= 40;
  const n = ok ? Math.round(y * 12) : 0;

  const newPmt = ok ? pmt(total, na, y) : NaN;
  const newInterest = ok ? newPmt * n - total : NaN;
  const basePmt = ok ? pmt(total, weightedApr, y) : NaN;
  const baseInterest = ok ? basePmt * n - total : NaN;
  const interestSaved = ok ? baseInterest - newInterest : NaN;
  const monthlyChange = ok ? newPmt - basePmt : NaN;

  return (
    <ToolCard>
      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
          Your current debts
        </div>
        {rows.map((r, i) => (
          <div key={i} className="flex items-end gap-2">
            <Field label={i === 0 ? "Balance" : ""}>
              <div className="flex gap-2">
                {i === 0 ? (
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
                ) : null}
                <NumberInput value={r.balance} onChange={(v) => setRow(i, "balance", v)} />
              </div>
            </Field>
            <Field label={i === 0 ? "APR %" : ""}>
              <input
                className="field w-24"
                type="number"
                inputMode="decimal"
                value={r.apr}
                onChange={(e) => setRow(i, "apr", e.target.value)}
              />
            </Field>
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="field w-10 shrink-0 text-[var(--ink-soft)] hover:text-[var(--accent)]"
              aria-label="Remove debt"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addRow}
          className="text-sm font-medium text-[var(--accent)]"
        >
          + Add another debt
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="New consolidation loan APR %">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={newApr}
            onChange={(e) => setNewApr(e.target.value)}
          />
        </Field>
        <Field label="New loan term (years)">
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
        <Stat label="New monthly payment" accent value={ok ? money(newPmt) : "—"} />
        <Stat label="Total debt" value={total > 0 ? money(total) : "—"} />
        <Stat
          label="Current average APR"
          value={Number.isFinite(weightedApr) ? `${formatNumber(weightedApr, 1)}%` : "—"}
        />
      </div>

      {ok ? (
        <>
          <div className="mt-5 grid gap-2 text-sm">
            <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
              <span className="text-[var(--ink-soft)]">Total interest on the new loan</span>
              <span className="tabular-nums font-medium">{money(newInterest)}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
              <span className="text-[var(--ink-soft)]">
                Interest at your current {formatNumber(weightedApr, 1)}% (same term)
              </span>
              <span className="tabular-nums font-medium">{money(baseInterest)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="font-semibold">
                {interestSaved >= 0 ? "Interest saved by consolidating" : "Extra interest"}
              </span>
              <span
                className={`tabular-nums font-semibold ${
                  interestSaved >= 0 ? "text-[var(--good)]" : "text-[var(--ink)]"
                }`}
              >
                {money(Math.abs(interestSaved))}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <SplitBar
              a={total}
              b={Math.max(0, newInterest)}
              aLabel={`Principal ${money(total)}`}
              bLabel={`Interest ${money(newInterest)}`}
            />
          </div>

          <p className="mt-4 text-xs text-[var(--ink-soft)] leading-relaxed">
            Comparison assumes the same {y}-year term. Consolidating {valid.length}{" "}
            debt{valid.length === 1 ? "" : "s"} at {formatNumber(na, 1)}% instead of
            your current {formatNumber(weightedApr, 1)}% average{" "}
            {interestSaved >= 0
              ? `saves about ${money(interestSaved)} in interest`
              : `costs about ${money(-interestSaved)} more in interest`}
            {monthlyChange <= 0
              ? ` and lowers the monthly payment by ${money(-monthlyChange)}`
              : ` but raises the monthly payment by ${money(monthlyChange)}`}
            . Actual offers depend on your credit and lender fees — this is an
            estimate, not financial advice.
          </p>
        </>
      ) : null}
    </ToolCard>
  );
}
