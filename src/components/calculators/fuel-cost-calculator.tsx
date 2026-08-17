"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

type DistUnit = "mi" | "km";
const EFF_UNITS = ["MPG (US)", "L/100km", "km/L"] as const;
type EffUnit = (typeof EFF_UNITS)[number];

const DIST_OPTIONS: { value: DistUnit; label: string }[] = [
  { value: "mi", label: "mi" },
  { value: "km", label: "km" },
];

interface Result {
  cost: number;
  fuelUsed: number;
  fuelLabel: string;
  costPerDist: number;
}

function compute(
  distance: number,
  distUnit: DistUnit,
  effUnit: EffUnit,
  effValue: number,
  price: number,
): Result {
  let fuelUsed: number;
  let fuelLabel: string;

  if (effUnit === "MPG (US)") {
    const distMi = distUnit === "km" ? distance / 1.609344 : distance;
    fuelUsed = distMi / effValue;
    fuelLabel = "gal";
  } else if (effUnit === "L/100km") {
    const distKm = distUnit === "mi" ? distance * 1.609344 : distance;
    fuelUsed = (distKm / 100) * effValue;
    fuelLabel = "L";
  } else {
    const distKm = distUnit === "mi" ? distance * 1.609344 : distance;
    fuelUsed = distKm / effValue;
    fuelLabel = "L";
  }

  const cost = fuelUsed * price;
  const costPerDist = cost / distance;
  return { cost, fuelUsed, fuelLabel, costPerDist };
}

export function FuelCostCalculator() {
  const [distance, setDistance] = useState("300");
  const [distUnit, setDistUnit] = useState<DistUnit>("mi");
  const [effValue, setEffValue] = useState("30");
  const [effUnit, setEffUnit] = useState<EffUnit>("MPG (US)");
  const [price, setPrice] = useState("3.50");
  const [currency, setCurrency] = useState("USD");

  const d = num(distance);
  const e = num(effValue);
  const p = num(price);
  const valid =
    d > 0 && Number.isFinite(e) && e > 0 && Number.isFinite(p) && p >= 0;

  const calc = valid ? compute(d, distUnit, effUnit, e, p) : null;
  const money = (v: number) => formatMoney(v, currency);
  const priceLabel =
    effUnit === "MPG (US)" ? "Price per gallon" : "Price per litre";

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Distance">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
        </Field>
        <Field label="Distance unit">
          <Segmented<DistUnit>
            value={distUnit}
            onChange={setDistUnit}
            options={DIST_OPTIONS}
          />
        </Field>
        <Field label="Fuel efficiency">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={effValue}
            onChange={(e) => setEffValue(e.target.value)}
          />
        </Field>
        <Field label="Efficiency unit">
          <select
            className="field"
            value={effUnit}
            onChange={(e) => setEffUnit(e.target.value as EffUnit)}
            aria-label="Efficiency unit"
          >
            {EFF_UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </Field>
        <Field label={priceLabel}>
          <div className="flex gap-2">
            <NumberInput value={price} onChange={setPrice} />
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
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Total fuel cost"
          accent
          value={calc ? money(calc.cost) : "—"}
        />
        <Stat
          label="Fuel needed"
          value={calc ? `${formatNumber(calc.fuelUsed, 2)} ${calc.fuelLabel}` : "—"}
        />
        <Stat
          label={`Cost per ${distUnit}`}
          value={calc ? money(calc.costPerDist) : "—"}
        />
      </div>
    </ToolCard>
  );
}
