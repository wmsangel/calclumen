"use client";

import { useState } from "react";
import { formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { AreaChart, SplitBar } from "@/components/chart";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

// IRS 2026 HSA limits (Rev. Proc. 2025-19). The limit covers employee +
// employer money combined; the 55+ catch-up is per account holder.
const LIMITS = { self: 4400, family: 8750 } as const;
const CATCH_UP = 1000;
const FICA = 7.65;

type Coverage = keyof typeof LIMITS;

export function HsaCalculator() {
  const [coverage, setCoverage] = useState<Coverage>("self");
  const [age, setAge] = useState("35");
  const [mine, setMine] = useState("3400");
  const [employer, setEmployer] = useState("1000");
  const [balance, setBalance] = useState("2000");
  const [fedRate, setFedRate] = useState("22");
  const [stateRate, setStateRate] = useState("5");
  const [payroll, setPayroll] = useState(true);
  const [years, setYears] = useState("20");
  const [ret, setRet] = useState("6");

  const money = (v: number) => formatMoney(v, "USD");

  const a = num(age);
  const you = num(mine);
  const emp = Number.isFinite(num(employer)) ? Math.max(0, num(employer)) : 0;
  const bal0 = Number.isFinite(num(balance)) ? Math.max(0, num(balance)) : 0;
  const fed = num(fedRate);
  const st = Number.isFinite(num(stateRate)) ? Math.max(0, num(stateRate)) : 0;
  const y = num(years);
  const r = num(ret);

  const catchUp = a >= 55 ? CATCH_UP : 0;
  const limit = LIMITS[coverage] + catchUp;

  const ok =
    you >= 0 &&
    Number.isFinite(fed) &&
    fed >= 0 &&
    fed < 60 &&
    st < 20 &&
    y > 0 &&
    y <= 60 &&
    Number.isFinite(r) &&
    r > -20 &&
    r < 30;

  // Money over the limit is an excess contribution (6% excise tax), so the
  // projection only counts the part that fits.
  const total = ok ? you + emp : NaN;
  const over = ok ? Math.max(0, total - limit) : 0;
  const yourAllowed = ok ? Math.max(0, Math.min(you, limit - Math.min(emp, limit))) : NaN;
  const annual = ok ? Math.min(total, limit) : NaN;
  const room = ok ? Math.max(0, limit - total) : NaN;

  // Your own contributions escape federal and state income tax; through
  // payroll (a cafeteria plan) they also skip Social Security + Medicare.
  const taxRate = ok ? fed + st + (payroll ? FICA : 0) : NaN;
  const taxSaved = ok ? (yourAllowed * taxRate) / 100 : NaN;
  const netCost = ok ? yourAllowed - taxSaved : NaN;

  const n = ok ? Math.round(y) : 0;
  const balances: number[] = [];
  let b = bal0;
  if (ok) {
    balances.push(b);
    for (let i = 0; i < n; i++) {
      b = (b + annual) * (1 + r / 100);
      balances.push(b);
    }
  }
  const finalBal = ok ? b : NaN;
  const contributed = ok ? bal0 + annual * n : NaN;
  const growth = ok ? finalBal - contributed : NaN;
  const lifetimeTax = ok ? taxSaved * n : NaN;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="HDHP coverage">
          <select
            className="field"
            value={coverage}
            onChange={(e) => setCoverage(e.target.value as Coverage)}
          >
            <option value="self">Self-only</option>
            <option value="family">Family</option>
          </select>
        </Field>
        <Field label="Your age" hint="55 or older adds a $1,000 catch-up.">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </Field>
        <Field label="Your annual contribution">
          <NumberInput value={mine} onChange={setMine} />
        </Field>
        <Field label="Employer contribution (per year)">
          <NumberInput value={employer} onChange={setEmployer} />
        </Field>
        <Field label="Federal tax bracket (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={fedRate}
            onChange={(e) => setFedRate(e.target.value)}
          />
        </Field>
        <Field
          label="State income tax rate (%)"
          hint="Use 0 in California and New Jersey — they tax HSA contributions."
        >
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={stateRate}
            onChange={(e) => setStateRate(e.target.value)}
          />
        </Field>
        <Field label="Current HSA balance">
          <NumberInput value={balance} onChange={setBalance} />
        </Field>
        <Field label="Years to grow">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </Field>
        <Field label="Expected annual return (%)" hint="If the HSA is invested; ~0–1% if it sits in cash.">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            step="0.1"
            value={ret}
            onChange={(e) => setRet(e.target.value)}
          />
        </Field>
        <Field label="Contribution method">
          <label className="flex items-center gap-2 py-2 text-sm">
            <input
              type="checkbox"
              checked={payroll}
              onChange={(e) => setPayroll(e.target.checked)}
            />
            Through payroll (also skips 7.65% FICA)
          </label>
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Tax saved this year"
          accent
          value={ok ? money(taxSaved) : "—"}
          sub={ok ? `${formatNumber(taxRate, 2)}% combined rate` : undefined}
        />
        <Stat
          label="2026 limit"
          value={money(limit)}
          sub={ok ? (over > 0 ? `${money(over)} over` : `${money(room)} left`) : undefined}
        />
        <Stat
          label={`Balance in ${ok ? n : "—"} years`}
          value={ok ? money(finalBal) : "—"}
        />
      </div>

      {ok ? (
        <>
          <div className="mt-5 grid gap-2 text-sm">
            <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
              <span className="text-[var(--ink-soft)]">
                Real cost of your {money(yourAllowed)} contribution after tax
              </span>
              <span className="tabular-nums font-medium">{money(netCost)}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
              <span className="text-[var(--ink-soft)]">Going in each year (you + employer)</span>
              <span className="tabular-nums font-medium">{money(annual)}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
              <span className="text-[var(--ink-soft)]">Total contributed incl. current balance</span>
              <span className="tabular-nums font-medium">{money(contributed)}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--rule)] py-1.5">
              <span className="text-[var(--ink-soft)]">Tax-free investment growth</span>
              <span className="tabular-nums font-medium">{money(growth)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="font-semibold">Income tax saved over {n} years</span>
              <span className="tabular-nums font-semibold text-[var(--good)]">
                {money(lifetimeTax)}
              </span>
            </div>
          </div>

          {over > 0 ? (
            <p className="mt-3 rounded-md border border-[var(--rule)] p-3 text-sm">
              You and your employer are putting in {money(total)}, which is {money(over)}{" "}
              over the {money(limit)} limit. Excess contributions are taxed 6% a year
              until withdrawn — the projection only counts the {money(annual)} that fits.
            </p>
          ) : null}

          {contributed > 0 && growth > 0 ? (
            <div className="mt-5">
              <SplitBar
                a={contributed}
                b={growth}
                aLabel={`Contributions ${money(contributed)}`}
                bLabel={`Growth ${money(growth)}`}
              />
            </div>
          ) : null}

          {balances.length > 2 ? (
            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
                HSA balance over time
              </div>
              <div className="mt-2">
                <AreaChart data={balances} />
              </div>
            </div>
          ) : null}

          <p className="mt-4 text-xs text-[var(--ink-soft)] leading-relaxed">
            Contributions go in pre-tax, growth is untaxed and withdrawals for
            qualified medical expenses are tax-free — the HSA&apos;s triple tax
            advantage. After 65, non-medical withdrawals are taxed as income like a
            traditional IRA. Assumes the same contribution every year and today&apos;s
            limit. Estimate only — not tax advice.
          </p>
        </>
      ) : null}
    </ToolCard>
  );
}
