"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function InsulationCalculator() {
  const [area, setArea] = useState("1000");
  const [target, setTarget] = useState("49");
  const [existing, setExisting] = useState("15");
  const [rPerInch, setRPerInch] = useState("3.5");
  const [coverage, setCoverage] = useState("40");
  const [price, setPrice] = useState("45");
  const [waste, setWaste] = useState("10");
  const [currency, setCurrency] = useState("USD");

  const A = num(area);
  const tR = num(target);
  const eR = num(existing);
  const rpi = num(rPerInch);
  const C = num(coverage);
  const P = num(price);
  const w = num(waste);

  const valid =
    Number.isFinite(A) && A > 0 &&
    Number.isFinite(tR) && tR >= 0 &&
    Number.isFinite(eR) && eR >= 0 &&
    Number.isFinite(rpi) && rpi > 0 &&
    Number.isFinite(C) && C > 0 &&
    Number.isFinite(P) && P >= 0 &&
    Number.isFinite(w) && w >= 0;

  let addR = NaN;
  let thickness = NaN;
  let effArea = NaN;
  let packages = NaN;
  let cost = NaN;
  let perSqFt = NaN;

  if (valid) {
    addR = Math.max(0, tR - eR);
    thickness = addR / rpi;
    effArea = A * (1 + w / 100);
    packages = Math.ceil(effArea / C);
    cost = packages * P;
    perSqFt = cost / A;
  }

  const money = (v: number) => (valid ? formatMoney(v, currency) : "—");
  const enough = valid && addR === 0;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Area to insulate (sq ft)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </Field>
        <Field label="Target R-value" hint="DOE attic: R-49 to R-60 in most US zones">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </Field>
        <Field label="Existing R-value" hint="0 if bare; estimate from current depth">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={existing}
            onChange={(e) => setExisting(e.target.value)}
          />
        </Field>
        <Field
          label="R-value per inch"
          hint="Batt ~3.1, blown fiberglass ~2.5, cellulose ~3.5, foam board ~5, spray foam ~6.5"
        >
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={rPerInch}
            onChange={(e) => setRPerInch(e.target.value)}
          />
        </Field>
        <Field
          label="Coverage per package (sq ft)"
          hint="From the bag/roll label, at your target depth"
        >
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={coverage}
            onChange={(e) => setCoverage(e.target.value)}
          />
        </Field>
        <Field label="Price per package">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
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
        <Field label="Waste / overlap" hint="Extra for trimming and gaps">
          <div className="flex items-center gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={waste}
              onChange={(e) => setWaste(e.target.value)}
            />
            <span className="text-[var(--ink-soft)]">%</span>
          </div>
        </Field>
      </div>

      {enough ? (
        <div className="mt-5">
          <Stat
            label="Insulation needed"
            accent
            value="None"
            sub={`Existing R-${eR} already meets the target of R-${tR}.`}
          />
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Stat
            label="Packages needed"
            accent
            value={valid ? `${packages}` : "—"}
            sub={valid ? "rolls / batts / bags, rounded up" : undefined}
          />
          <Stat
            label="Insulation to add"
            value={valid ? `R-${addR.toFixed(0)}` : "—"}
            sub={valid ? `target R-${tR.toFixed(0)} − existing R-${eR.toFixed(0)}` : undefined}
          />
          <Stat
            label="Added thickness"
            value={valid ? `${thickness.toFixed(1)} in` : "—"}
            sub={valid ? `at R-${rpi}/inch` : undefined}
          />
          <Stat
            label="Area incl. waste"
            value={valid ? `${Math.round(effArea).toLocaleString()} sq ft` : "—"}
            sub={valid ? `${w}% waste` : undefined}
          />
          <Stat label="Total material cost" value={money(cost)} />
          <Stat
            label="Cost per sq ft"
            value={money(perSqFt)}
            sub={valid ? "material only" : undefined}
          />
        </div>
      )}

      <p className="mt-4 text-sm text-[var(--ink-soft)]">
        R-value measures resistance to heat flow — higher is better, and it adds
        up, so topping up R-15 to R-49 means adding R-34, not R-49. The thickness
        shown is how deep the new layer must be for that added R with your chosen
        material. For blown-in insulation the coverage per bag <em>drops</em> as
        the target depth rises, so read the coverage straight off the bag&apos;s
        chart at your R-value rather than assuming a fixed number. Figures are an
        estimate; they exclude labor, vapor barriers and air sealing.
      </p>
    </ToolCard>
  );
}
