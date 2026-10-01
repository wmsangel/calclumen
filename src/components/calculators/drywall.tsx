"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

// Standard opening allowances (sq ft), same as the paint calculator.
const DOOR_SQFT = 21;
const WINDOW_SQFT = 15;
// Rules of thumb for finishing materials per sq ft of board hung.
const MUD_GAL_PER_SQFT = 0.01; // ~1 gallon of joint compound per 100 sq ft
const MUD_BUCKET_GAL = 4.5;
const TAPE_FT_PER_SQFT = 0.37; // ~370 ft of tape per 1,000 sq ft
const TAPE_ROLL_FT = 250;
const SCREWS_PER_SQFT = 1; // ~32 screws per 4×8 sheet at 16" stud spacing

const SHEETS = [
  { id: "4x8", label: "4 × 8 ft (32 sq ft)", sqft: 32 },
  { id: "4x10", label: "4 × 10 ft (40 sq ft)", sqft: 40 },
  { id: "4x12", label: "4 × 12 ft (48 sq ft)", sqft: 48 },
];

export function DrywallCalculator() {
  const [roomLength, setRoomLength] = useState("12");
  const [roomWidth, setRoomWidth] = useState("12");
  const [wallHeight, setWallHeight] = useState("8");
  const [ceiling, setCeiling] = useState("yes");
  const [doors, setDoors] = useState("1");
  const [windows, setWindows] = useState("2");
  const [sheet, setSheet] = useState("4x8");
  const [waste, setWaste] = useState("10");
  const [pricePerSheet, setPricePerSheet] = useState("15");
  const [currency, setCurrency] = useState("USD");

  const l = num(roomLength);
  const w = num(roomWidth);
  const h = num(wallHeight);
  const d = num(doors);
  const win = num(windows);
  const wastePct = num(waste);
  const price = num(pricePerSheet);
  const sheetSqFt = SHEETS.find((s) => s.id === sheet)!.sqft;

  const valid =
    l > 0 && w > 0 && h > 0 && d >= 0 && win >= 0 && wastePct >= 0;

  const wallArea = Math.max(
    0,
    2 * (l + w) * h - d * DOOR_SQFT - win * WINDOW_SQFT,
  );
  const ceilingArea = ceiling === "yes" ? l * w : 0;
  const area = wallArea + ceilingArea;
  const sheets = Math.ceil((area * (1 + wastePct / 100)) / sheetSqFt);
  const boardSqFt = sheets * sheetSqFt;
  const mudGal = area * MUD_GAL_PER_SQFT;
  const buckets = Math.max(1, Math.ceil(mudGal / MUD_BUCKET_GAL));
  const tapeFt = area * TAPE_FT_PER_SQFT;
  const tapeRolls = Math.max(1, Math.ceil(tapeFt / TAPE_ROLL_FT));
  const screws = Math.ceil(boardSqFt * SCREWS_PER_SQFT);
  const cost = sheets * price;
  const hasPrice = Number.isFinite(price) && price > 0;
  const ok = valid && area > 0;

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
        <Field label="Include ceiling">
          <select
            className="field"
            value={ceiling}
            onChange={(e) => setCeiling(e.target.value)}
          >
            <option value="yes">Yes — walls + ceiling</option>
            <option value="no">No — walls only</option>
          </select>
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
        <Field label="Sheet size">
          <select
            className="field"
            value={sheet}
            onChange={(e) => setSheet(e.target.value)}
          >
            {SHEETS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Waste %">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={waste}
            onChange={(e) => setWaste(e.target.value)}
          />
        </Field>
        <Field label="Price per sheet (optional)">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={pricePerSheet}
              onChange={(e) => setPricePerSheet(e.target.value)}
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
          label="Drywall sheets to buy"
          accent
          value={ok ? String(sheets) : "—"}
          sub={
            ok
              ? `${formatNumber(area, 0)} sq ft to cover (walls ${formatNumber(wallArea, 0)}${ceilingArea > 0 ? ` + ceiling ${formatNumber(ceilingArea, 0)}` : ""})`
              : undefined
          }
        />
        <Stat
          label="Estimated sheet cost"
          value={ok && hasPrice ? formatMoney(cost, currency) : "—"}
        />
        <Stat
          label="Joint compound"
          value={ok ? `${formatNumber(mudGal, 1)} gal` : "—"}
          sub={
            ok
              ? `${buckets} × ${MUD_BUCKET_GAL}-gallon bucket${buckets > 1 ? "s" : ""}`
              : undefined
          }
        />
        <Stat
          label="Joint tape"
          value={ok ? `${formatNumber(tapeFt, 0)} ft` : "—"}
          sub={
            ok
              ? `${tapeRolls} × ${TAPE_ROLL_FT} ft roll${tapeRolls > 1 ? "s" : ""}`
              : undefined
          }
        />
        <Stat
          label="Drywall screws"
          value={ok ? formatNumber(screws, 0) : "—"}
          sub={ok ? "About 32 per 4×8 sheet" : undefined}
        />
      </div>
    </ToolCard>
  );
}
