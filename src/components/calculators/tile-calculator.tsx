"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney, formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";
import { NumberInput } from "@/components/number-input";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function TileCalculator() {
  const [roomLength, setRoomLength] = useState("10");
  const [roomWidth, setRoomWidth] = useState("10");
  const [tileWidth, setTileWidth] = useState("12");
  const [tileHeight, setTileHeight] = useState("12");
  const [waste, setWaste] = useState("10");
  const [pricePerTile, setPricePerTile] = useState("0");
  const [currency, setCurrency] = useState("USD");

  const l = num(roomLength);
  const w = num(roomWidth);
  const tw = num(tileWidth);
  const th = num(tileHeight);
  const wastePct = num(waste);
  const price = num(pricePerTile);

  const valid = l > 0 && w > 0 && tw > 0 && th > 0 && wastePct >= 0;

  const areaSqFt = l * w;
  const tileSqFt = (tw / 12) * (th / 12);
  const tilesExact = tileSqFt > 0 ? areaSqFt / tileSqFt : 0;
  const tilesNeeded = Math.ceil(tilesExact * (1 + wastePct / 100));
  const cost = tilesNeeded * price;
  const hasPrice = Number.isFinite(price) && price > 0;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
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
        <Field label="Tile width (in)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={tileWidth}
            onChange={(e) => setTileWidth(e.target.value)}
          />
        </Field>
        <Field label="Tile height (in)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={tileHeight}
            onChange={(e) => setTileHeight(e.target.value)}
          />
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
        <Field label="Price per tile (optional)">
          <div className="flex gap-2">
            <NumberInput value={pricePerTile} onChange={setPricePerTile} />
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
          label="Tiles needed"
          accent
          value={valid ? formatNumber(tilesNeeded, 0) : "—"}
        />
        <Stat
          label="Floor area"
          value={valid ? `${formatNumber(areaSqFt, 1)} sq ft` : "—"}
        />
        <Stat
          label="Tiles before waste"
          value={valid ? formatNumber(Math.ceil(tilesExact), 0) : "—"}
        />
        <Stat
          label="Estimated cost"
          value={valid && hasPrice ? formatMoney(cost, currency) : "—"}
        />
      </div>
    </ToolCard>
  );
}
