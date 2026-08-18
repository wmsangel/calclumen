"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Sun = "shaded" | "normal" | "sunny";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const SUN_FACTOR: Record<Sun, number> = {
  shaded: 0.9,
  normal: 1.0,
  sunny: 1.1,
};

export function BtuCalculator() {
  const [length, setLength] = useState("12");
  const [width, setWidth] = useState("12");
  const [sun, setSun] = useState<Sun>("normal");
  const [occupants, setOccupants] = useState("2");
  const [kitchen, setKitchen] = useState(false);

  const l = num(length);
  const w = num(width);
  const occ = num(occupants);

  const valid = l > 0 && w > 0 && Number.isFinite(occ) && occ >= 0;

  const area = valid ? l * w : NaN;
  let base = NaN;
  let tons = NaN;
  if (valid) {
    base = area * 20;
    base *= SUN_FACTOR[sun];
    base += Math.max(0, occ - 2) * 600;
    if (kitchen) base += 4000;
    tons = base / 12000;
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Room length (ft)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
        </Field>
        <Field label="Room width (ft)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-4">
        <span className="label">Sun exposure</span>
        <div className="mt-1">
          <Segmented<Sun>
            value={sun}
            onChange={setSun}
            options={[
              { value: "shaded", label: "Shaded" },
              { value: "normal", label: "Normal" },
              { value: "sunny", label: "Sunny" },
            ]}
          />
        </div>
      </div>

      <div className="mt-4">
        <Field label="Occupants">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={occupants}
            onChange={(e) => setOccupants(e.target.value)}
          />
        </Field>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-[var(--ink-soft)]">
        <input
          type="checkbox"
          checked={kitchen}
          onChange={(e) => setKitchen(e.target.checked)}
        />
        Kitchen (adds 4,000 BTU)
      </label>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="BTU needed"
          accent
          value={valid ? `${formatNumber(base, 0)} BTU` : "—"}
        />
        <Stat
          label="Room area"
          value={valid ? `${formatNumber(area, 0)} sq ft` : "—"}
        />
        <Stat
          label="AC size"
          value={valid ? `${formatNumber(tons, 1)} tons` : "—"}
        />
      </div>
    </ToolCard>
  );
}
