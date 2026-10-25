"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

type Scale = "C" | "F" | "gas";

const SCALE_OPTIONS: { value: Scale; label: string }[] = [
  { value: "C", label: "°C" },
  { value: "F", label: "°F" },
  { value: "gas", label: "Gas mark" },
];

/** Standard UK gas mark ↔ conventional oven temperatures. */
const GAS_MARKS: { mark: number; c: number; f: number }[] = [
  { mark: 0.25, c: 110, f: 225 },
  { mark: 0.5, c: 120, f: 250 },
  { mark: 1, c: 140, f: 275 },
  { mark: 2, c: 150, f: 300 },
  { mark: 3, c: 160, f: 325 },
  { mark: 4, c: 180, f: 350 },
  { mark: 5, c: 190, f: 375 },
  { mark: 6, c: 200, f: 400 },
  { mark: 7, c: 220, f: 425 },
  { mark: 8, c: 230, f: 450 },
  { mark: 9, c: 240, f: 475 },
];

function formatGasMark(mark: number): string {
  if (mark === 0.25) return "¼";
  if (mark === 0.5) return "½";
  return String(mark);
}

function cToF(c: number): number {
  return (c * 9) / 5 + 32;
}

function fToC(f: number): number {
  return ((f - 32) * 5) / 9;
}

/** Fan oven rule of thumb: conventional − 20 °C, rounded to nearest 10 °C. */
function fanFromConventional(c: number): number {
  return Math.round((c - 20) / 10) * 10;
}

function gasMarkByValue(mark: number) {
  return GAS_MARKS.find((row) => row.mark === mark);
}

function nearestGasMark(c: number): { mark: number; exact: boolean } {
  let best = GAS_MARKS[0];
  let bestDist = Math.abs(best.c - c);
  for (const row of GAS_MARKS) {
    const d = Math.abs(row.c - c);
    if (d < bestDist) {
      best = row;
      bestDist = d;
    }
  }
  return { mark: best.mark, exact: bestDist === 0 };
}

function toConventionalC(value: number, scale: Scale): number | null {
  if (scale === "C") return value;
  if (scale === "F") return fToC(value);
  const row = gasMarkByValue(value);
  return row ? row.c : null;
}

export function OvenTemperatureConverter() {
  const [value, setValue] = useState("180");
  const [scale, setScale] = useState<Scale>("C");

  const x = num(value);
  const conventionalC =
    Number.isFinite(x) ? toConventionalC(x, scale) : null;
  const valid = conventionalC !== null && Number.isFinite(conventionalC);

  const conventionalF = valid ? cToF(conventionalC) : NaN;
  const fanC = valid ? fanFromConventional(conventionalC) : NaN;
  const fanF = valid ? cToF(fanC) : NaN;
  const gas = valid ? nearestGasMark(conventionalC) : null;
  const gasLabel = gas
    ? `${gas.exact ? "" : "≈ "}Gas Mark ${formatGasMark(gas.mark)}`
    : "—";

  // When input is an exact gas-mark row, show the table's °F (not formula °F).
  const displayConventionalF =
    valid && scale === "gas"
      ? (gasMarkByValue(x)?.f ?? conventionalF)
      : conventionalF;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Oven setting"
          hint={
            scale === "gas"
              ? "Enter ¼ as 0.25, ½ as 0.5, or 1–9"
              : undefined
          }
        >
          <input
            className="field"
            type="number"
            inputMode="decimal"
            step={scale === "gas" ? "0.25" : "1"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Field>
        <Field label="Scale">
          <div className="mt-1">
            <Segmented<Scale>
              value={scale}
              onChange={setScale}
              options={SCALE_OPTIONS}
            />
          </div>
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat
          label="Conventional °C"
          accent
          value={valid ? `${formatNumber(conventionalC, 0)} °C` : "—"}
        />
        <Stat
          label="Conventional °F"
          value={
            valid ? `${formatNumber(displayConventionalF, 0)} °F` : "—"
          }
        />
        <Stat
          label="Fan / convection °C"
          value={valid ? `${formatNumber(fanC, 0)} °C` : "—"}
          sub="About 20 °C lower, rounded to 10 °C"
        />
        <Stat
          label="Fan / convection °F"
          value={valid ? `${formatNumber(fanF, 0)} °F` : "—"}
        />
        <Stat label="Gas mark" value={gasLabel} />
      </div>

      <div className="mt-6 overflow-x-auto">
        <h3 className="mb-2 text-sm font-medium text-[var(--ink)]">
          Gas mark reference
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--ink-soft)]">
              <th className="py-2 font-medium">Gas mark</th>
              <th className="py-2 font-medium text-right">°C</th>
              <th className="py-2 font-medium text-right">°F</th>
              <th className="py-2 font-medium text-right">Fan °C</th>
            </tr>
          </thead>
          <tbody>
            {GAS_MARKS.map((row) => (
              <tr key={row.mark} className="border-t border-[var(--rule)]">
                <td className="py-2">{formatGasMark(row.mark)}</td>
                <td className="py-2 text-right numeral">{row.c}</td>
                <td className="py-2 text-right numeral">{row.f}</td>
                <td className="py-2 text-right numeral">
                  {fanFromConventional(row.c)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolCard>
  );
}
