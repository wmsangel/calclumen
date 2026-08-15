"use client";

import { useState } from "react";
import { CURRENCIES, formatNumber, formatMoney } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function PaintCalculator() {
  const [roomLength, setRoomLength] = useState("12");
  const [roomWidth, setRoomWidth] = useState("12");
  const [wallHeight, setWallHeight] = useState("8");
  const [coats, setCoats] = useState("2");
  const [doors, setDoors] = useState("1");
  const [windows, setWindows] = useState("2");
  const [coveragePerGallon, setCoveragePerGallon] = useState("350");
  const [pricePerGallon, setPricePerGallon] = useState("35");
  const [currency, setCurrency] = useState("USD");

  const l = num(roomLength);
  const w = num(roomWidth);
  const h = num(wallHeight);
  const c = num(coats);
  const d = num(doors);
  const win = num(windows);
  const cov = num(coveragePerGallon);
  const price = num(pricePerGallon);

  const valid =
    l > 0 &&
    w > 0 &&
    h > 0 &&
    c > 0 &&
    d >= 0 &&
    win >= 0 &&
    cov > 0;

  const wallArea = 2 * (l + w) * h;
  const openings = d * 21 + win * 15;
  const paintable = Math.max(0, wallArea - openings) * c;
  const gallons = paintable / cov;
  const gallonsToBuy = Math.ceil(gallons);
  const cost = gallonsToBuy * price;
  const hasPrice = Number.isFinite(price) && price > 0;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Room length (ft)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={roomLength}
            onChange={(e) => setRoomLength(e.target.value)}
          />
        </Field>
        <Field label="Room width (ft)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={roomWidth}
            onChange={(e) => setRoomWidth(e.target.value)}
          />
        </Field>
        <Field label="Wall height (ft)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={wallHeight}
            onChange={(e) => setWallHeight(e.target.value)}
          />
        </Field>
        <Field label="Coats">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={coats}
            onChange={(e) => setCoats(e.target.value)}
          />
        </Field>
        <Field label="Doors">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={doors}
            onChange={(e) => setDoors(e.target.value)}
          />
        </Field>
        <Field label="Windows">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={windows}
            onChange={(e) => setWindows(e.target.value)}
          />
        </Field>
        <Field label="Coverage per gallon (sq ft)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={coveragePerGallon}
            onChange={(e) => setCoveragePerGallon(e.target.value)}
          />
        </Field>
        <Field label="Price per gallon (optional)">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={pricePerGallon}
              onChange={(e) => setPricePerGallon(e.target.value)}
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
          label="Paintable area"
          accent
          value={valid ? `${formatNumber(paintable, 0)} sq ft` : "—"}
        />
        <Stat
          label="Gallons needed"
          value={valid ? formatNumber(gallons, 1) : "—"}
        />
        <Stat
          label="Gallons to buy"
          value={valid ? String(gallonsToBuy) : "—"}
        />
        <Stat
          label="Estimated cost"
          value={valid && hasPrice ? formatMoney(cost, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
