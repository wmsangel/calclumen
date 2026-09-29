"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

// Actual face widths (inches) of common deck boards.
const BOARD_WIDTHS = [
  { label: '5/4×6, 2×6 or composite (5.5")', value: "5.5" },
  { label: '2×4 or 5/4×4 (3.5")', value: "3.5" },
  { label: '2×8 (7.25")', value: "7.25" },
];
const BOARD_LENGTHS = [8, 10, 12, 16, 20];
const JOIST_SPACINGS = [12, 16, 24];

export function DeckCalculator() {
  const [length, setLength] = useState("16");
  const [width, setWidth] = useState("12");
  const [boardWidth, setBoardWidth] = useState("5.5");
  const [gap, setGap] = useState("0.1875");
  const [boardLength, setBoardLength] = useState("16");
  const [spacing, setSpacing] = useState("16");
  const [waste, setWaste] = useState("10");
  const [pricePerBoard, setPricePerBoard] = useState("0");
  const [currency, setCurrency] = useState("USD");

  const l = num(length);
  const w = num(width);
  const bw = num(boardWidth);
  const g = num(gap);
  const bl = num(boardLength);
  const sp = num(spacing);
  const wastePct = num(waste);
  const price = num(pricePerBoard);

  const valid = l > 0 && w > 0 && bw > 0 && g >= 0 && bl > 0 && sp > 0 && wastePct >= 0;

  // Decking runs along the length; rows of boards stack across the width.
  const area = l * w;
  const rows = Math.ceil((w * 12) / (bw + g));
  const linearFt = rows * l;
  const boards = Math.ceil((linearFt * (1 + wastePct / 100)) / bl);
  // Joists run across the width, spaced along the length, plus the end joist.
  const joists = Math.floor((l * 12) / sp) + 1;
  // Two screws per board at every joist it crosses.
  const screws = rows * joists * 2;
  const hasPrice = Number.isFinite(price) && price > 0;
  const cost = boards * price;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Deck length (ft)" hint="The direction the boards run">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
        </Field>
        <Field label="Deck width (ft)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
        </Field>
        <Field label="Board size">
          <select
            className="field"
            value={boardWidth}
            onChange={(e) => setBoardWidth(e.target.value)}
          >
            {BOARD_WIDTHS.map((b) => (
              <option key={b.label} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Gap between boards (in)" hint="3/16 in (0.1875) is typical">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={gap}
            onChange={(e) => setGap(e.target.value)}
          />
        </Field>
        <Field label="Board length (ft)">
          <select
            className="field"
            value={boardLength}
            onChange={(e) => setBoardLength(e.target.value)}
          >
            {BOARD_LENGTHS.map((b) => (
              <option key={b} value={b}>
                {b} ft
              </option>
            ))}
          </select>
        </Field>
        <Field label="Joist spacing (in on center)">
          <select
            className="field"
            value={spacing}
            onChange={(e) => setSpacing(e.target.value)}
          >
            {JOIST_SPACINGS.map((s) => (
              <option key={s} value={s}>
                {s} in
              </option>
            ))}
          </select>
        </Field>
        <Field label="Waste %" hint="10% for a straight lay, 15% for diagonal or picture-frame">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={waste}
            onChange={(e) => setWaste(e.target.value)}
          />
        </Field>
        <Field label="Price per board (optional)">
          <div className="flex gap-2">
            <NumberInput value={pricePerBoard} onChange={setPricePerBoard} />
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

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Deck boards needed"
          accent
          value={valid ? formatNumber(boards, 0) : "—"}
          sub={valid ? `${bl}-ft boards · ${formatNumber(linearFt, 0)} linear ft before waste` : undefined}
        />
        <Stat
          label="Deck area"
          value={valid ? `${formatNumber(area, 0)} sq ft` : "—"}
          sub={valid ? `${formatNumber(rows, 0)} rows of boards` : undefined}
        />
        <Stat
          label="Joists"
          value={valid ? formatNumber(joists, 0) : "—"}
          sub={valid ? `${formatNumber(w, 1)} ft long at ${sp} in on center` : undefined}
        />
        <Stat
          label="Deck screws"
          value={valid ? formatNumber(screws, 0) : "—"}
          sub="2 per board at every joist"
        />
        <Stat
          label="Estimated decking cost"
          value={valid && hasPrice ? formatMoney(cost, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
