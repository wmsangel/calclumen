"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";
import { SplitBar } from "@/components/chart";

type Mode = "fixed" | "target";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function CreditCardPayoffCalculator() {
  const [mode, setMode] = useState<Mode>("fixed");
  const [balance, setBalance] = useState("5000");
  const [apr, setApr] = useState("19.99");
  const [monthlyPayment, setMonthlyPayment] = useState("150");
  const [targetMonths, setTargetMonths] = useState("24");
  const [currency, setCurrency] = useState("USD");

  const bal = num(balance);
  const a = num(apr);
  const mp = num(monthlyPayment);
  const tm = num(targetMonths);
  const r = a / 100 / 12;

  const baseValid = bal > 0 && Number.isFinite(a) && a >= 0;

  let months = NaN;
  let payment = NaN;
  let totalInterest = NaN;
  let totalPaid = NaN;
  let payable = true;

  if (mode === "fixed") {
    const valid = baseValid && mp > 0;
    if (valid) {
      if (r === 0) {
        // 0% APR: no interest, straight division.
        months = Math.ceil(bal / mp);
        totalInterest = 0;
        totalPaid = bal;
      } else if (mp <= bal * r) {
        payable = false;
      } else {
        months = Math.ceil(-Math.log(1 - (r * bal) / mp) / Math.log(1 + r));
        totalInterest = mp * months - bal;
        totalPaid = mp * months;
      }
    } else {
      payable = true;
    }
  } else {
    const valid = baseValid && tm > 0;
    if (valid) {
      payment =
        r === 0 ? bal / tm : (bal * r) / (1 - Math.pow(1 + r, -tm));
      totalInterest = payment * tm - bal;
      totalPaid = payment * tm;
    }
  }

  const fixedValid = baseValid && mp > 0;
  const targetValid = baseValid && tm > 0;

  return (
    <ToolCard>
      <Segmented<Mode>
        value={mode}
        onChange={setMode}
        options={[
          { value: "fixed", label: "Fixed payment" },
          { value: "target", label: "Target months" },
        ]}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Balance">
          <div className="flex gap-2">
            <NumberInput value={balance} onChange={setBalance} />
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
        <Field label="APR (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={apr}
            onChange={(e) => setApr(e.target.value)}
          />
        </Field>
        {mode === "fixed" ? (
          <Field label="Monthly payment">
            <NumberInput value={monthlyPayment} onChange={setMonthlyPayment} />
          </Field>
        ) : (
          <Field label="Target months">
            <input
              className="field"
              type="number"
              inputMode="numeric"
              value={targetMonths}
              onChange={(e) => setTargetMonths(e.target.value)}
            />
          </Field>
        )}
      </div>

      {mode === "fixed" && fixedValid && !payable ? (
        <p className="mt-3 text-sm text-[var(--ink-soft)]">
          Payment too low to cover interest
        </p>
      ) : null}

      {mode === "fixed" ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Stat
            label="Months to payoff"
            accent
            value={
              fixedValid && payable ? formatNumber(months, 0) : "—"
            }
          />
          <Stat
            label="Total interest"
            value={
              fixedValid && payable
                ? formatMoney(totalInterest, currency)
                : "—"
            }
          />
          <Stat
            label="Total paid"
            value={
              fixedValid && payable
                ? formatMoney(totalPaid, currency)
                : "—"
            }
          />
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Stat
            label="Required monthly payment"
            accent
            value={targetValid ? formatMoney(payment, currency) : "—"}
          />
          <Stat
            label="Total interest"
            value={targetValid ? formatMoney(totalInterest, currency) : "—"}
          />
          <Stat
            label="Total paid"
            value={targetValid ? formatMoney(totalPaid, currency) : "—"}
          />
        </div>
      )}

      {((mode === "fixed" && fixedValid && payable) ||
        (mode === "target" && targetValid)) &&
      Number.isFinite(totalInterest) ? (
        <div className="mt-6">
          <SplitBar
            a={bal}
            b={totalInterest}
            aLabel={`Balance ${formatMoney(bal, currency)}`}
            bLabel={`Interest ${formatMoney(totalInterest, currency)}`}
            bColor="var(--bad)"
          />
        </div>
      ) : null}
    </ToolCard>
  );
}
