"use client";

import { useState } from "react";
import { formatMoney, formatPercent } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";
import { BONUS_TAX_2026, bonusTax } from "@/lib/math/bonus-tax";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));
const usd = (n: number) => formatMoney(n, "USD");

export function BonusTaxCalculator() {
  const [bonus, setBonus] = useState("5000");
  const [ytdWages, setYtdWages] = useState("60000");
  const [ytdSupplemental, setYtdSupplemental] = useState("0");
  const [statePct, setStatePct] = useState("0");

  const b = num(bonus);
  const valid = b > 0;
  const r = valid
    ? bonusTax({
        bonus: b,
        ytdWages: num(ytdWages) || 0,
        ytdSupplemental: num(ytdSupplemental) || 0,
        statePct: num(statePct) || 0,
      })
    : null;

  const t = BONUS_TAX_2026;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Bonus amount">
          <NumberInput value={bonus} onChange={setBonus} />
        </Field>
        <Field
          label="Wages paid so far this year"
          hint="Before this bonus — sets Social Security and Medicare thresholds"
        >
          <NumberInput value={ytdWages} onChange={setYtdWages} />
        </Field>
        <Field
          label="Earlier bonuses this year"
          hint="Only matters once supplemental pay passes $1,000,000"
        >
          <NumberInput value={ytdSupplemental} onChange={setYtdSupplemental} />
        </Field>
        <Field label="State withholding rate (%)" hint="0 if your state has no income tax">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={statePct}
            onChange={(e) => setStatePct(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Bonus you take home" accent value={r ? usd(r.netBonus) : "—"} />
        <Stat
          label="Total withheld"
          value={r ? usd(r.totalWithheld) : "—"}
          sub={r ? `${formatPercent(r.effectivePct, 1)} of the bonus` : undefined}
        />
        <Stat
          label="Federal (22% flat)"
          value={r ? usd(r.federal) : "—"}
          sub={r && r.bonusAbove1M > 0 ? `${usd(r.bonusAbove1M)} withheld at 37%` : undefined}
        />
        <Stat label="Social Security (6.2%)" value={r ? usd(r.socialSecurity) : "—"} />
        <Stat
          label="Medicare (1.45%)"
          value={r ? usd(r.medicare + r.additionalMedicare) : "—"}
          sub={r && r.additionalMedicare > 0 ? `includes ${usd(r.additionalMedicare)} Additional Medicare Tax (0.9%)` : undefined}
        />
        <Stat label="State" value={r ? usd(r.state) : "—"} />
      </div>

      <p className="mt-4 text-xs text-[var(--ink-soft)] leading-relaxed">
        2026 federal rates per IRS Publication 15: supplemental wages withheld at{" "}
        {t.supplementalRate * 100}% up to {usd(t.supplementalHighThreshold)} per year and{" "}
        {t.supplementalHighRate * 100}% above; Social Security {t.socialSecurityRate * 100}% up to the{" "}
        {usd(t.socialSecurityWageBase)} wage base; Medicare {t.medicareRate * 100}% plus{" "}
        {t.additionalMedicareRate * 100}% on wages over {usd(t.additionalMedicareThreshold)}. This is
        withholding from the check, not your final tax.
      </p>
    </ToolCard>
  );
}
