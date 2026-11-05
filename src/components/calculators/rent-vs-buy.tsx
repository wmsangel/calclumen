"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";
import { rentVsBuy } from "@/lib/math/rent-vs-buy";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));
const usd = (n: number) => formatMoney(Math.round(n), "USD");

function Pct({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        className="field"
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function RentVsBuyCalculator() {
  const [homePrice, setHomePrice] = useState("300000");
  const [downPaymentPct, setDownPaymentPct] = useState("20");
  const [mortgageRatePct, setMortgageRatePct] = useState("6.5");
  const [loanTermYears, setLoanTermYears] = useState("30");
  const [monthlyRent, setMonthlyRent] = useState("1800");
  const [horizonYears, setHorizonYears] = useState("7");
  const [homeAppreciationPct, setHomeAppreciationPct] = useState("3");
  const [rentGrowthPct, setRentGrowthPct] = useState("3");
  const [investmentReturnPct, setInvestmentReturnPct] = useState("5");
  const [propertyTaxPct, setPropertyTaxPct] = useState("1.1");
  const [maintenanceInsurancePct, setMaintenanceInsurancePct] = useState("1.5");
  const [hoaMonthly, setHoaMonthly] = useState("0");
  const [buyingCostPct, setBuyingCostPct] = useState("2");
  const [sellingCostPct, setSellingCostPct] = useState("6");

  const price = num(homePrice);
  const rent = num(monthlyRent);
  const horizon = num(horizonYears);

  const valid = price > 0 && rent > 0 && horizon > 0;

  const r = valid
    ? rentVsBuy({
        homePrice: price,
        downPaymentPct: num(downPaymentPct) || 0,
        mortgageRatePct: num(mortgageRatePct) || 0,
        loanTermYears: num(loanTermYears) || 30,
        homeAppreciationPct: num(homeAppreciationPct) || 0,
        propertyTaxPct: num(propertyTaxPct) || 0,
        maintenanceInsurancePct: num(maintenanceInsurancePct) || 0,
        hoaMonthly: num(hoaMonthly) || 0,
        buyingCostPct: num(buyingCostPct) || 0,
        sellingCostPct: num(sellingCostPct) || 0,
        monthlyRent: rent,
        rentGrowthPct: num(rentGrowthPct) || 0,
        investmentReturnPct: num(investmentReturnPct) || 0,
        horizonYears: horizon,
      })
    : null;

  const verdictText = !r
    ? "—"
    : r.verdict === "buy"
      ? `Buying wins by ${usd(r.advantage)}`
      : r.verdict === "rent"
        ? `Renting wins by ${usd(r.advantage)}`
        : "Too close to call";

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Home price">
          <NumberInput value={homePrice} onChange={setHomePrice} />
        </Field>
        <Field label="Monthly rent">
          <NumberInput value={monthlyRent} onChange={setMonthlyRent} />
        </Field>
        <Pct label="Down payment (%)" value={downPaymentPct} onChange={setDownPaymentPct} />
        <Pct label="Mortgage rate (APR %)" value={mortgageRatePct} onChange={setMortgageRatePct} />
        <Pct label="Loan term (years)" value={loanTermYears} onChange={setLoanTermYears} />
        <Pct
          label="Time horizon (years)"
          value={horizonYears}
          onChange={setHorizonYears}
          hint="How long you'd stay in the home"
        />
        <Pct label="Home appreciation (%/yr)" value={homeAppreciationPct} onChange={setHomeAppreciationPct} />
        <Pct label="Rent growth (%/yr)" value={rentGrowthPct} onChange={setRentGrowthPct} />
        <Pct
          label="Investment return (%/yr)"
          value={investmentReturnPct}
          onChange={setInvestmentReturnPct}
          hint="What you'd earn investing instead"
        />
        <Pct label="Property tax (%/yr)" value={propertyTaxPct} onChange={setPropertyTaxPct} />
        <Pct
          label="Maintenance + insurance (%/yr)"
          value={maintenanceInsurancePct}
          onChange={setMaintenanceInsurancePct}
        />
        <Field label="HOA (monthly)">
          <NumberInput value={hoaMonthly} onChange={setHoaMonthly} />
        </Field>
        <Pct label="Buying closing cost (%)" value={buyingCostPct} onChange={setBuyingCostPct} />
        <Pct label="Selling cost (%)" value={sellingCostPct} onChange={setSellingCostPct} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat
          label={`After ${valid ? horizon : "—"} years`}
          accent
          value={verdictText}
        />
        <Stat
          label="Break-even"
          value={
            !r
              ? "—"
              : r.breakEvenYear === null
                ? `Not within ${horizon} yrs`
                : `Year ${r.breakEvenYear}`
          }
          sub="When buying catches up to renting"
        />
        <Stat label="Upfront cash to buy" value={r ? usd(r.upfrontCash) : "—"} />
        <Stat
          label="Buy — net worth"
          value={r ? usd(r.buyNetWorth) : "—"}
          sub="Investments + home equity"
        />
        <Stat
          label="Rent — net worth"
          value={r ? usd(r.rentNetWorth) : "—"}
          sub="Invested down payment + savings"
        />
        <Stat
          label="Monthly cost, year 1"
          value={r ? `${usd(r.firstYearBuyMonthly)} vs ${usd(r.firstYearRentMonthly)}` : "—"}
          sub="Own vs rent"
        />
      </div>

      {r ? (
        <div className="mt-6 overflow-x-auto">
          <h3 className="mb-2 text-sm font-medium text-[var(--ink)]">
            Net worth by year
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--ink-soft)]">
                <th className="py-2 font-medium">Year</th>
                <th className="py-2 font-medium text-right">Buy</th>
                <th className="py-2 font-medium text-right">Rent</th>
                <th className="py-2 font-medium text-right">Difference</th>
              </tr>
            </thead>
            <tbody>
              {r.years.map((y) => {
                const diff = y.buyNetWorth - y.rentNetWorth;
                return (
                  <tr key={y.year} className="border-t border-[var(--rule)]">
                    <td className="py-2">{y.year}</td>
                    <td className="py-2 text-right numeral">{usd(y.buyNetWorth)}</td>
                    <td className="py-2 text-right numeral">{usd(y.rentNetWorth)}</td>
                    <td
                      className="py-2 text-right numeral"
                      style={{ color: diff >= 0 ? "var(--good)" : "var(--bad)" }}
                    >
                      {diff >= 0 ? "+" : "−"}
                      {usd(Math.abs(diff))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </ToolCard>
  );
}
