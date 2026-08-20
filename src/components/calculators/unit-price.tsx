"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

type Row = { label: string; price: string; size: string };

const DEFAULT_ROWS: Row[] = [
  { label: "Option A", price: "4.50", size: "500" },
  { label: "Option B", price: "7.20", size: "900" },
];

export function UnitPriceCalculator() {
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);
  const [unit, setUnit] = useState("g");
  const [currency, setCurrency] = useState("USD");

  const update = (i: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const addRow = () =>
    setRows((rs) => [...rs, { label: `Option ${String.fromCharCode(65 + rs.length)}`, price: "", size: "" }]);
  const removeRow = (i: number) =>
    setRows((rs) => (rs.length > 2 ? rs.filter((_, idx) => idx !== i) : rs));

  const computed = rows.map((r, i) => {
    const p = num(r.price);
    const s = num(r.size);
    const ok = p > 0 && s > 0;
    return {
      i,
      label: r.label.trim() || `Option ${String.fromCharCode(65 + i)}`,
      perUnit: ok ? p / s : NaN,
      ok,
    };
  });

  const valids = computed.filter((c) => c.ok);
  const best = valids.length ? Math.min(...valids.map((c) => c.perUnit)) : NaN;
  const worst = valids.length ? Math.max(...valids.map((c) => c.perUnit)) : NaN;
  const bestRow = valids.find((c) => c.perUnit === best);
  const savingsPct =
    valids.length >= 2 && worst > 0 ? (1 - best / worst) * 100 : 0;

  const fmtPerUnit = (v: number) =>
    `${formatMoney(v, currency)} / ${unit || "unit"}`;

  return (
    <ToolCard>
      <div className="flex flex-wrap gap-3 mb-4">
        <Field label="Unit label">
          <input
            className="field w-28"
            type="text"
            value={unit}
            placeholder="g, oz, L…"
            onChange={(e) => setUnit(e.target.value)}
            aria-label="Unit label"
          />
        </Field>
        <Field label="Currency">
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
        </Field>
      </div>

      <div className="space-y-3">
        {rows.map((r, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_6rem_6rem_auto] gap-2 items-end"
          >
            <Field label={i === 0 ? "Item" : ""}>
              <input
                className="field"
                type="text"
                value={r.label}
                onChange={(e) => update(i, { label: e.target.value })}
                aria-label={`Label for item ${i + 1}`}
              />
            </Field>
            <Field label={i === 0 ? "Price" : ""}>
              <NumberInput value={r.price} onChange={(v) => update(i, { price: v })} />
            </Field>
            <Field label={i === 0 ? `Size (${unit || "unit"})` : ""}>
              <NumberInput value={r.size} onChange={(v) => update(i, { size: v })} />
            </Field>
            <button
              type="button"
              className="field w-11 grid place-items-center text-[var(--ink-soft)] hover:text-[var(--accent)] disabled:opacity-40"
              onClick={() => removeRow(i)}
              aria-label={`Remove item ${i + 1}`}
              disabled={rows.length <= 2}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-3 text-sm font-medium text-[var(--accent)] hover:underline"
        onClick={addRow}
      >
        + Add item
      </button>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Best value"
          accent
          value={bestRow ? bestRow.label : "—"}
          sub={bestRow ? fmtPerUnit(best) : undefined}
        />
        <Stat
          label="You save vs the priciest"
          value={
            valids.length >= 2 && savingsPct > 0
              ? `${formatNumber(savingsPct, 1)}%`
              : valids.length >= 2
                ? "—"
                : "—"
          }
        />
      </div>

      {valids.length ? (
        <div className="mt-5 space-y-2">
          {computed.map((c) => (
            <div
              key={c.i}
              className="flex items-center justify-between gap-3 rounded-lg border border-[var(--rule)] bg-[var(--paper-2)] px-4 py-2.5 text-sm"
              style={
                c.ok && c.perUnit === best
                  ? { borderColor: "var(--accent)" }
                  : undefined
              }
            >
              <span className="font-medium">
                {c.label}
                {c.ok && c.perUnit === best ? (
                  <span className="ml-2 text-xs font-semibold text-[var(--accent-2)]">
                    Best
                  </span>
                ) : null}
              </span>
              <span className="text-[var(--ink-soft)] tabular-nums">
                {c.ok ? fmtPerUnit(c.perUnit) : "—"}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </ToolCard>
  );
}
