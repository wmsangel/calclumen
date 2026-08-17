"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

function affordability(
  annualIncome: number,
  monthlyDebts: number,
  downPayment: number,
  mortgageRate: number,
  loanTermYears: number,
  propertyTaxRate: number,
  annualInsurance: number,
  frontEndRatio: number,
  backEndRatio: number,
) {
  const monthlyIncome = annualIncome / 12;
  const maxFront = (monthlyIncome * frontEndRatio) / 100;
  const maxBack = (monthlyIncome * backEndRatio) / 100 - monthlyDebts;
  const maxPITI = Math.min(maxFront, maxBack);
  const r = mortgageRate / 100 / 12;
  const n = Math.round(loanTermYears * 12);

  let homePrice = 0;
  for (let i = 0; i <= 5; i++) {
    const monthlyTax = (homePrice * propertyTaxRate) / 100 / 12;
    const monthlyIns = annualInsurance / 12;
    const maxPI = maxPITI - monthlyTax - monthlyIns;
    if (maxPI <= 0) {
      homePrice = downPayment;
      break;
    }
    const loanAmount =
      r === 0 ? maxPI * n : (maxPI * (1 - Math.pow(1 + r, -n))) / r;
    homePrice = loanAmount + downPayment;
  }
  const loanAmount = homePrice - downPayment;
  return { homePrice, maxPITI, loanAmount };
}

export function HomeAffordabilityCalculator() {
  const [annualIncome, setAnnualIncome] = useState("90000");
  const [monthlyDebts, setMonthlyDebts] = useState("500");
  const [downPayment, setDownPayment] = useState("40000");
  const [mortgageRate, setMortgageRate] = useState("6.5");
  const [loanTermYears, setLoanTermYears] = useState("30");
  const [propertyTaxRate, setPropertyTaxRate] = useState("1.1");
  const [annualInsurance, setAnnualInsurance] = useState("1500");
  const [frontEndRatio, setFrontEndRatio] = useState("28");
  const [backEndRatio, setBackEndRatio] = useState("36");
  const [currency, setCurrency] = useState("USD");

  const income = num(annualIncome);
  const debts = num(monthlyDebts);
  const down = num(downPayment);
  const rate = num(mortgageRate);
  const term = num(loanTermYears);
  const taxRate = num(propertyTaxRate);
  const insurance = num(annualInsurance);
  const front = num(frontEndRatio);
  const back = num(backEndRatio);

  const valid =
    income > 0 &&
    debts >= 0 &&
    down >= 0 &&
    Number.isFinite(rate) &&
    term > 0 &&
    Number.isFinite(taxRate) &&
    insurance >= 0 &&
    front > 0 &&
    back > 0;

  const { homePrice, maxPITI, loanAmount } = valid
    ? affordability(
        income,
        debts,
        down,
        rate,
        term,
        taxRate,
        insurance,
        front,
        back,
      )
    : { homePrice: NaN, maxPITI: NaN, loanAmount: NaN };

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Annual income">
          <div className="flex gap-2">
            <NumberInput value={annualIncome} onChange={setAnnualIncome} />
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
        <Field label="Monthly debts">
          <NumberInput value={monthlyDebts} onChange={setMonthlyDebts} />
        </Field>
        <Field label="Down payment">
          <NumberInput value={downPayment} onChange={setDownPayment} />
        </Field>
        <Field label="Mortgage rate (APR %)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={mortgageRate}
            onChange={(e) => setMortgageRate(e.target.value)}
          />
        </Field>
        <Field label="Loan term (years)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={loanTermYears}
            onChange={(e) => setLoanTermYears(e.target.value)}
          />
        </Field>
        <Field label="Property tax rate (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={propertyTaxRate}
            onChange={(e) => setPropertyTaxRate(e.target.value)}
          />
        </Field>
        <Field label="Annual insurance">
          <NumberInput value={annualInsurance} onChange={setAnnualInsurance} />
        </Field>
        <Field label="Front-end ratio (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={frontEndRatio}
            onChange={(e) => setFrontEndRatio(e.target.value)}
          />
        </Field>
        <Field label="Back-end ratio (%)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={backEndRatio}
            onChange={(e) => setBackEndRatio(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Affordable home price"
          accent
          value={valid ? formatMoney(homePrice, currency) : "—"}
        />
        <Stat
          label="Max monthly payment (PITI)"
          value={valid ? formatMoney(maxPITI, currency) : "—"}
        />
        <Stat
          label="Loan amount"
          value={valid ? formatMoney(loanAmount, currency) : "—"}
        />
        <Stat
          label="Down payment"
          value={valid ? formatMoney(down, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
