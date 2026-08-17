"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState("10000");
  const [pricePerUnit, setPricePerUnit] = useState("25");
  const [variableCostPerUnit, setVariableCostPerUnit] = useState("10");
  const [currency, setCurrency] = useState("USD");

  const fc = num(fixedCosts);
  const price = num(pricePerUnit);
  const vc = num(variableCostPerUnit);

  const inputsValid =
    fc >= 0 && Number.isFinite(price) && Number.isFinite(vc);
  const cm = price - vc;
  const cmPositive = inputsValid && cm > 0;

  let breakEvenUnits = NaN;
  let breakEvenRevenue = NaN;
  let cmRatio = NaN;

  if (cmPositive) {
    breakEvenUnits = Math.ceil(fc / cm);
    breakEvenRevenue = breakEvenUnits * price;
    cmRatio = (cm / price) * 100;
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Fixed costs">
          <div className="flex gap-2">
            <NumberInput value={fixedCosts} onChange={setFixedCosts} />
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
        <Field label="Price per unit">
          <NumberInput value={pricePerUnit} onChange={setPricePerUnit} />
        </Field>
        <Field label="Variable cost per unit">
          <NumberInput
            value={variableCostPerUnit}
            onChange={setVariableCostPerUnit}
          />
        </Field>
      </div>

      {inputsValid && !cmPositive ? (
        <p className="mt-4 text-sm text-[var(--ink-soft)]">
          Price must exceed variable cost
        </p>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Break-even units"
          accent
          value={cmPositive ? formatNumber(breakEvenUnits, 0) : "—"}
        />
        <Stat
          label="Break-even revenue"
          value={cmPositive ? formatMoney(breakEvenRevenue, currency) : "—"}
        />
        <Stat
          label="Contribution margin"
          value={cmPositive ? formatMoney(cm, currency) : "—"}
        />
        <Stat
          label="CM ratio"
          value={cmPositive ? `${formatNumber(cmRatio)}%` : "—"}
        />
      </div>
    </ToolCard>
  );
}
