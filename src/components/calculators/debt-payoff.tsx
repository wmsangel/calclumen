"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Strategy = "snowball" | "avalanche";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

interface DebtInput {
  balance: string;
  apr: string;
  minPayment: string;
}

const DEFAULT_DEBTS: DebtInput[] = [
  { balance: "5000", apr: "19.99", minPayment: "100" },
  { balance: "3000", apr: "24.99", minPayment: "75" },
  { balance: "8000", apr: "6.5", minPayment: "150" },
];

interface Debt {
  balance: number;
  apr: number;
  minPayment: number;
}

/** Simulate the debt payoff month by month. */
function simulate(debts: Debt[], extra: number, strategy: Strategy) {
  const startBalances = debts.reduce((s, d) => s + d.balance, 0);
  const bal = debts.map((d) => d.balance);
  const cleared = debts.map(() => false);
  let totalInterest = 0;
  let month = 0;
  let capped = false;

  const active = () => bal.map((_, i) => i).filter((i) => bal[i] > 0);

  while (active().length > 0) {
    month += 1;
    if (month > 1200) {
      capped = true;
      break;
    }

    // Add interest to each active debt.
    for (let i = 0; i < bal.length; i++) {
      if (bal[i] > 0) {
        const interest = (bal[i] * debts[i].apr) / 100 / 12;
        bal[i] += interest;
        totalInterest += interest;
      }
    }

    // Pool starts with extra + freed minimums from cleared debts.
    let pool = extra;
    for (let i = 0; i < bal.length; i++) {
      if (cleared[i]) pool += debts[i].minPayment;
    }

    // Pay each active debt its minimum (capped at balance).
    for (let i = 0; i < bal.length; i++) {
      if (bal[i] > 0) {
        const pay = Math.min(debts[i].minPayment, bal[i]);
        bal[i] -= pay;
        if (bal[i] <= 0) {
          bal[i] = 0;
          cleared[i] = true;
        }
      }
    }

    // Order the remaining active debts by strategy.
    const order = bal
      .map((_, i) => i)
      .filter((i) => bal[i] > 0)
      .sort((a, b) =>
        strategy === "snowball"
          ? bal[a] - bal[b]
          : debts[b].apr - debts[a].apr,
      );

    // Apply the pool to the first ordered debt, rolling overflow onward.
    for (const i of order) {
      if (pool <= 0) break;
      const pay = Math.min(pool, bal[i]);
      bal[i] -= pay;
      pool -= pay;
      if (bal[i] <= 0) {
        bal[i] = 0;
        cleared[i] = true;
      }
    }
  }

  return {
    months: month,
    totalInterest,
    totalPaid: startBalances + totalInterest,
    capped,
  };
}

export function DebtPayoffCalculator() {
  const [rows, setRows] = useState<DebtInput[]>(DEFAULT_DEBTS);
  const [extra, setExtra] = useState("200");
  const [strategy, setStrategy] = useState<Strategy>("snowball");
  const [currency, setCurrency] = useState("USD");

  const update = (i: number, key: keyof DebtInput, value: string) => {
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)),
    );
  };

  const addRow = () =>
    setRows((prev) => [...prev, { balance: "", apr: "", minPayment: "" }]);

  const removeRow = (i: number) =>
    setRows((prev) => prev.filter((_, idx) => idx !== i));

  const debts: Debt[] = rows
    .map((r) => ({
      balance: num(r.balance),
      apr: num(r.apr),
      minPayment: num(r.minPayment),
    }))
    .filter(
      (d) =>
        d.balance > 0 &&
        Number.isFinite(d.apr) &&
        d.apr >= 0 &&
        d.minPayment > 0,
    );

  const extraVal = num(extra);
  const valid = debts.length > 0 && Number.isFinite(extraVal) && extraVal >= 0;

  const result = valid
    ? simulate(debts, extraVal, strategy)
    : { months: NaN, totalInterest: NaN, totalPaid: NaN, capped: false };

  const payoffNote = !valid
    ? "Add at least one debt"
    : result.capped
      ? "Payments too low"
      : result.months < 12
        ? `${result.months} month${result.months === 1 ? "" : "s"}`
        : `${Math.floor(result.months / 12)}y ${result.months % 12}m`;

  return (
    <ToolCard>
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <Field label={i === 0 ? "Balance" : ""}>
              <input
                className="field"
                type="number"
                inputMode="decimal"
                value={row.balance}
                onChange={(e) => update(i, "balance", e.target.value)}
              />
            </Field>
            <Field label={i === 0 ? "APR %" : ""}>
              <input
                className="field"
                type="number"
                inputMode="decimal"
                value={row.apr}
                onChange={(e) => update(i, "apr", e.target.value)}
              />
            </Field>
            <Field label={i === 0 ? "Min payment" : ""}>
              <input
                className="field"
                type="number"
                inputMode="decimal"
                value={row.minPayment}
                onChange={(e) => update(i, "minPayment", e.target.value)}
              />
            </Field>
            <div className={i === 0 ? "flex items-end" : "flex items-start"}>
              <button
                type="button"
                className="field w-full sm:w-11 grid place-items-center text-[var(--ink-soft)] hover:text-[var(--accent)]"
                onClick={() => removeRow(i)}
                aria-label="Remove debt"
                disabled={rows.length === 1}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-3 text-sm font-semibold text-[var(--accent)] hover:underline"
        onClick={addRow}
      >
        + Add debt
      </button>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Extra monthly payment">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
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
        <Field label="Strategy">
          <Segmented<Strategy>
            value={strategy}
            onChange={setStrategy}
            options={[
              { value: "snowball", label: "Snowball" },
              { value: "avalanche", label: "Avalanche" },
            ]}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Months to debt-free"
          accent
          value={valid && !result.capped ? formatNumber(result.months, 0) : "—"}
          sub={payoffNote}
        />
        <Stat
          label="Total interest paid"
          value={valid && !result.capped ? formatMoney(result.totalInterest, currency) : "—"}
        />
        <Stat
          label="Total paid"
          value={valid && !result.capped ? formatMoney(result.totalPaid, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
