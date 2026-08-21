"use client";

import { useEffect, useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";
import { ResultActions } from "@/components/result-actions";
import { readParam, syncParams } from "@/lib/share";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const PRESETS = [10, 15, 18, 20, 25];

export function TipCalculator() {
  const [bill, setBill] = useState("50");
  const [tip, setTip] = useState("18");
  const [people, setPeople] = useState("1");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const b = readParam("bill");
    const t = readParam("tip");
    const pp = readParam("people");
    const c = readParam("cur");
    if (b) setBill(b);
    if (t) setTip(t);
    if (pp) setPeople(pp);
    if (c && (CURRENCIES as readonly string[]).includes(c)) setCurrency(c);
  }, []);

  useEffect(() => {
    syncParams({ bill, tip, people, cur: currency });
  }, [bill, tip, people, currency]);

  const b = num(bill);
  const t = num(tip);
  const p = Math.floor(num(people));
  const validBill = b > 0 && Number.isFinite(b);
  const tipPct = Number.isFinite(t) ? t : 0;
  const heads = p >= 1 ? p : 1;

  const tipAmount = validBill ? (b * tipPct) / 100 : NaN;
  const total = validBill ? b + tipAmount : NaN;
  const perPerson = validBill ? total / heads : NaN;
  const tipPerPerson = validBill ? tipAmount / heads : NaN;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Bill amount">
          <div className="flex gap-2">
            <NumberInput value={bill} onChange={setBill} />
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
        <Field label="Number of people">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={people}
            onChange={(e) => setPeople(e.target.value)}
          />
        </Field>
        <Field label="Tip percentage" hint="Pick a preset or type your own.">
          <div className="flex flex-col gap-2">
            <div className="seg">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  data-on={num(tip) === preset}
                  onClick={() => setTip(String(preset))}
                >
                  {preset}%
                </button>
              ))}
            </div>
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              aria-label="Custom tip percentage"
            />
          </div>
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Tip amount"
          accent
          value={validBill ? formatMoney(tipAmount, currency) : "—"}
        />
        <Stat
          label="Total"
          value={validBill ? formatMoney(total, currency) : "—"}
        />
        <Stat
          label="Total per person"
          value={validBill ? formatMoney(perPerson, currency) : "—"}
        />
        <Stat
          label="Tip per person"
          value={validBill ? formatMoney(tipPerPerson, currency) : "—"}
        />
      </div>

      {validBill ? (
        <div className="mt-5 no-print">
          <ResultActions
            summary={`Bill ${formatMoney(b, currency)} + ${tipPct}% tip = ${formatMoney(total, currency)} total (${formatMoney(tipAmount, currency)} tip), split ${heads} = ${formatMoney(perPerson, currency)} each. — via calclumen.com`}
          />
        </div>
      ) : null}
    </ToolCard>
  );
}
