"use client";

import { useState } from "react";
import { formatMoney, formatPercent } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";
import { ResultActions } from "@/components/result-actions";
import { DUE_DATES_2026, NO_PAYMENT_THRESHOLD, estimatedTax } from "@/lib/math/estimated-tax";
import { STANDARD_DEDUCTION, TAX_YEAR, type Filing } from "@/lib/math/federal-tax-2026";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));
const usd = (n: number) => formatMoney(Math.round(n), "USD");

function fmtDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function QuarterlyEstimatedTaxCalculator() {
  const [filing, setFiling] = useState<Filing>("single");
  const [profit, setProfit] = useState("80000");
  const [w2, setW2] = useState("0");
  const [other, setOther] = useState("0");
  const [withholding, setWithholding] = useState("0");
  const [priorTax, setPriorTax] = useState("0");
  const [over150, setOver150] = useState<"no" | "yes">("no");
  const [qbi, setQbi] = useState<"yes" | "no">("yes");
  const [statePct, setStatePct] = useState("0");
  const [paid, setPaid] = useState("0");

  const p = num(profit);
  const valid = Number.isFinite(p) && p >= 0;
  const r = valid
    ? estimatedTax({
        filing,
        netSelfEmployment: p,
        w2Wages: num(w2) || 0,
        otherIncome: num(other) || 0,
        federalWithholding: num(withholding) || 0,
        priorYearTax: num(priorTax) || 0,
        priorYearAgiOver150k: over150 === "yes",
        statePct: num(statePct) || 0,
        applyQbi: qbi === "yes",
        paymentsMade: num(paid) || 0,
      })
    : null;

  const summary = r
    ? `Quarterly estimated tax (${TAX_YEAR}): ${usd(r.quarterlyTotal)} per quarter (federal ${usd(r.quarterlyFederal)} + state ${usd(r.quarterlyState)}). Total federal tax ${usd(r.federalTotal)}: income tax ${usd(r.incomeTax)}, self-employment tax ${usd(r.seTax)}. Safe harbor: ${usd(r.requiredAnnual)} for the year.`
    : "";

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Filing status">
          <Segmented<Filing>
            value={filing}
            onChange={setFiling}
            options={[
              { value: "single", label: "Single" },
              { value: "mfj", label: "Married filing jointly" },
            ]}
          />
        </Field>
        <Field label="Net self-employment profit (year)" hint="Schedule C line 31: income minus business expenses">
          <NumberInput value={profit} onChange={setProfit} />
        </Field>
        <Field label="W-2 wages this year" hint="If you also have a job; shares the Social Security wage base">
          <NumberInput value={w2} onChange={setW2} />
        </Field>
        <Field label="Other taxable income" hint="Interest, dividends, rental, etc.">
          <NumberInput value={other} onChange={setOther} />
        </Field>
        <Field label="Federal tax withheld this year" hint="From W-2 paychecks or a spouse's job">
          <NumberInput value={withholding} onChange={setWithholding} />
        </Field>
        <Field label="Estimated payments already made" hint="This tax year">
          <NumberInput value={paid} onChange={setPaid} />
        </Field>
        <Field label="Last year's total tax" hint="Form 1040 line 24; 0 if you filed no return">
          <NumberInput value={priorTax} onChange={setPriorTax} />
        </Field>
        <Field label="Last year's AGI over $150,000?" hint="Then the prior-year safe harbor is 110%">
          <Segmented<"no" | "yes">
            value={over150}
            onChange={setOver150}
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
          />
        </Field>
        <Field label="Apply the 20% QBI deduction?" hint="Most sole proprietors below the income thresholds qualify">
          <Segmented<"yes" | "no">
            value={qbi}
            onChange={setQbi}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
          />
        </Field>
        <Field label="State income tax rate (%)" hint="Flat estimate; 0 for TX, FL, WA, NV, TN, SD, WY, AK">
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
        <Stat
          label="Pay each quarter"
          accent
          value={r ? usd(r.quarterlyTotal) : "—"}
          sub={
            r
              ? r.underThreshold
                ? `Balance due ${usd(r.balanceDue)} < ${usd(NO_PAYMENT_THRESHOLD)} — no estimated payments required`
                : `Federal ${usd(r.quarterlyFederal)} + state ${usd(r.quarterlyState)}`
              : undefined
          }
        />
        <Stat
          label={`Total ${TAX_YEAR} federal tax`}
          value={r ? usd(r.federalTotal) : "—"}
          sub={r ? `Income tax ${usd(r.incomeTax)} + SE tax ${usd(r.seTax)}${r.additionalMedicare > 0 ? ` + add'l Medicare ${usd(r.additionalMedicare)}` : ""}` : undefined}
        />
        <Stat
          label="Safe-harbor amount for the year"
          value={r ? usd(r.requiredAnnual) : "—"}
          sub={
            r
              ? r.priorYearSafeHarbor === null
                ? "90% of this year's tax (no prior-year return)"
                : r.requiredAnnual === r.ninetyPercent
                  ? `90% of this year (${usd(r.ninetyPercent)}) is lower than ${Math.round(r.priorYearFactor * 100)}% of last year (${usd(r.priorYearSafeHarbor)})`
                  : `${Math.round(r.priorYearFactor * 100)}% of last year's tax is lower than 90% of this year (${usd(r.ninetyPercent)})`
              : undefined
          }
        />
        <Stat label="Self-employment tax" value={r ? usd(r.seTax) : "—"} sub={r ? `On ${usd(r.seEarnings)} (92.35% of profit); half, ${usd(r.seDeduction)}, is deductible` : undefined} />
        <Stat
          label="Taxable income"
          value={r ? usd(r.taxable) : "—"}
          sub={r ? `AGI ${usd(r.agi)} − standard deduction ${usd(STANDARD_DEDUCTION[filing])}${r.qbiDeduction > 0 ? ` − QBI ${usd(r.qbiDeduction)}` : ""}` : undefined}
        />
        <Stat label="Effective rate" value={r ? formatPercent(r.effectiveRate * 100, 1) : "—"} sub={r ? `Marginal federal bracket ${Math.round(r.marginalRate * 100)}%` : undefined} />
      </div>

      {r ? (
        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)] mb-2">
            Payment schedule — tax year {TAX_YEAR}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--ink-soft)]">
                  <th className="py-1.5 pr-3 font-medium">Payment</th>
                  <th className="py-1.5 pr-3 font-medium">Income earned</th>
                  <th className="py-1.5 pr-3 font-medium">Due date</th>
                  <th className="py-1.5 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {DUE_DATES_2026.map((d) => (
                  <tr key={d.quarter} className="border-t border-[var(--rule)]">
                    <td className="py-1.5 pr-3 font-medium">{d.quarter}</td>
                    <td className="py-1.5 pr-3 text-[var(--ink-soft)]">{d.period}</td>
                    <td className="py-1.5 pr-3">
                      <time dateTime={d.due}>{fmtDate(d.due)}</time>
                    </td>
                    <td className="py-1.5 text-right">{usd(r.quarterlyTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-[var(--ink-soft)]">
            Equal instalments assume income is earned evenly through the year. If a due date falls on a weekend or
            holiday it moves to the next business day; the Q4 payment can be skipped if you file and pay in full by
            February 1, 2027.
          </p>
          <div className="mt-4">
            <ResultActions summary={summary} />
          </div>
        </div>
      ) : null}
    </ToolCard>
  );
}
