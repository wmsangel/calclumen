"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

interface Item {
  label: string;
  amount: string;
}

const DEFAULT_ASSETS: Item[] = [
  { label: "Cash & savings", amount: "5000" },
  { label: "Investments", amount: "20000" },
  { label: "Home / property", amount: "300000" },
];

const DEFAULT_LIABILITIES: Item[] = [
  { label: "Mortgage", amount: "220000" },
  { label: "Loans", amount: "8000" },
];

const sum = (items: Item[]) =>
  items.reduce((s, it) => {
    const v = num(it.amount);
    return s + (Number.isFinite(v) ? v : 0);
  }, 0);

function List({
  title,
  addLabel,
  rows,
  setRows,
}: {
  title: string;
  addLabel: string;
  rows: Item[];
  setRows: React.Dispatch<React.SetStateAction<Item[]>>;
}) {
  const update = (i: number, key: keyof Item, value: string) => {
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)),
    );
  };

  const addRow = () => setRows((prev) => [...prev, { label: "", amount: "" }]);

  const removeRow = (i: number) =>
    setRows((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)] mb-2">
        {title}
      </div>
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <Field label={i === 0 ? "Label" : ""}>
              <input
                className="field"
                type="text"
                value={row.label}
                onChange={(e) => update(i, "label", e.target.value)}
              />
            </Field>
            <Field label={i === 0 ? "Amount" : ""}>
              <NumberInput
                value={row.amount}
                onChange={(v) => update(i, "amount", v)}
              />
            </Field>
            <div className={i === 0 ? "flex items-end" : "flex items-start"}>
              <button
                type="button"
                className="field w-full sm:w-11 grid place-items-center text-[var(--ink-soft)] hover:text-[var(--accent)]"
                onClick={() => removeRow(i)}
                aria-label="Remove row"
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
        {addLabel}
      </button>
    </div>
  );
}

export function NetWorthCalculator() {
  const [assets, setAssets] = useState<Item[]>(DEFAULT_ASSETS);
  const [liabilities, setLiabilities] = useState<Item[]>(DEFAULT_LIABILITIES);
  const [currency, setCurrency] = useState("USD");

  const totalAssets = sum(assets);
  const totalLiabilities = sum(liabilities);
  const netWorth = totalAssets - totalLiabilities;

  const money = (v: number) => formatMoney(v, currency);

  return (
    <ToolCard>
      <div className="flex justify-end">
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

      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <List
          title="Assets"
          addLabel="+ Add asset"
          rows={assets}
          setRows={setAssets}
        />
        <List
          title="Liabilities"
          addLabel="+ Add liability"
          rows={liabilities}
          setRows={setLiabilities}
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Net worth" accent value={money(netWorth)} />
        <Stat label="Total assets" value={money(totalAssets)} />
        <Stat label="Total liabilities" value={money(totalLiabilities)} />
      </div>
    </ToolCard>
  );
}
