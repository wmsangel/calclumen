"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { convert, RATES_UPDATED } from "@/lib/programmatic/rates";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  const a = num(amount);
  const valid = Number.isFinite(a);

  const result = valid ? convert(a, from, to) : NaN;
  const rate = convert(1, from, to);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Amount">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Field>
        <Field label="From">
          <div className="flex gap-2">
            <select
              className="field"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              aria-label="From currency"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={swap}
              className="field w-12 flex-none grid place-items-center hover:text-[var(--accent)]"
              aria-label="Swap currencies"
              title="Swap currencies"
            >
              ⇄
            </button>
          </div>
        </Field>
        <Field label="To">
          <select
            className="field"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            aria-label="To currency"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Stat
          label="Converted amount"
          accent
          value={valid ? formatMoney(result, to) : "—"}
          sub={`1 ${from} = ${formatNumber(rate, 4)} ${to}`}
        />
      </div>

      <p className="mt-3 text-xs text-[var(--ink-soft)]">
        Indicative rates (updated {RATES_UPDATED}) for estimation only.
      </p>
    </ToolCard>
  );
}
