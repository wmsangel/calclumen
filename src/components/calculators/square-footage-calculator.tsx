"use client";

import { useState } from "react";
import { CURRENCIES, formatNumber, formatMoney } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

type Shape = "Rectangle" | "Circle" | "Triangle";

const SHAPE_OPTIONS: { value: Shape; label: string }[] = [
  { value: "Rectangle", label: "Rectangle" },
  { value: "Circle", label: "Circle" },
  { value: "Triangle", label: "Triangle" },
];

export function SquareFootageCalculator() {
  const [shape, setShape] = useState<Shape>("Rectangle");
  const [length, setLength] = useState("12");
  const [width, setWidth] = useState("10");
  const [radius, setRadius] = useState("6");
  const [base, setBase] = useState("10");
  const [height, setHeight] = useState("8");
  const [quantity, setQuantity] = useState("1");
  const [pricePerSqFt, setPricePerSqFt] = useState("0");
  const [currency, setCurrency] = useState("USD");

  const len = num(length);
  const wid = num(width);
  const rad = num(radius);
  const bas = num(base);
  const hgt = num(height);
  const qty = num(quantity);
  const price = num(pricePerSqFt);

  const shapeValid =
    shape === "Rectangle"
      ? len > 0 && wid > 0
      : shape === "Circle"
        ? rad > 0
        : bas > 0 && hgt > 0;

  const valid = shapeValid && qty > 0;

  const area =
    shape === "Rectangle"
      ? len * wid
      : shape === "Circle"
        ? Math.PI * rad * rad
        : 0.5 * bas * hgt;

  const total = area * qty;
  const sqYards = total / 9;
  const sqMeters = total * 0.092903;
  const cost = total * price;
  const hasPrice = Number.isFinite(price) && price > 0;

  return (
    <ToolCard>
      <Segmented<Shape>
        value={shape}
        onChange={setShape}
        options={SHAPE_OPTIONS}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {shape === "Rectangle" ? (
          <>
            <Field label="Length (ft)">
              <input
                className="field"
                type="number"
                inputMode="decimal"
                value={length}
                onChange={(e) => setLength(e.target.value)}
              />
            </Field>
            <Field label="Width (ft)">
              <input
                className="field"
                type="number"
                inputMode="decimal"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </Field>
          </>
        ) : null}

        {shape === "Circle" ? (
          <Field label="Radius (ft)">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
            />
          </Field>
        ) : null}

        {shape === "Triangle" ? (
          <>
            <Field label="Base (ft)">
              <input
                className="field"
                type="number"
                inputMode="decimal"
                value={base}
                onChange={(e) => setBase(e.target.value)}
              />
            </Field>
            <Field label="Height (ft)">
              <input
                className="field"
                type="number"
                inputMode="decimal"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </Field>
          </>
        ) : null}

        <Field label="Quantity">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Field>
        <Field label="Price per sq ft (optional)">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={pricePerSqFt}
              onChange={(e) => setPricePerSqFt(e.target.value)}
            />
            <select
              className="field w-24"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              aria-label="Currency"
            >
              {CURRENCIES.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </div>
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Total area"
          accent
          value={valid ? `${formatNumber(total, 2)} sq ft` : "—"}
        />
        <Stat
          label="Sq yards"
          value={valid ? formatNumber(sqYards, 2) : "—"}
        />
        <Stat
          label="Sq meters"
          value={valid ? formatNumber(sqMeters, 2) : "—"}
        />
        <Stat
          label="Estimated cost"
          value={valid && hasPrice ? formatMoney(cost, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
