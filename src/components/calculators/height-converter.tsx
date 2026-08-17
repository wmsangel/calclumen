"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

type Mode = "cmToFtIn" | "ftInToCm";

const MODE_OPTIONS: { value: Mode; label: string }[] = [
  { value: "cmToFtIn", label: "cm → ft/in" },
  { value: "ftInToCm", label: "ft/in → cm" },
];

export function HeightConverter() {
  const [mode, setMode] = useState<Mode>("cmToFtIn");
  const [cm, setCm] = useState("175");
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("9");

  if (mode === "cmToFtIn") {
    const c = num(cm);
    const valid = Number.isFinite(c) && c >= 0;
    const totalIn = c / 2.54;
    const ft = Math.floor(totalIn / 12);
    const inch = totalIn - ft * 12;
    const meters = c / 100;

    return (
      <ToolCard>
        <Segmented<Mode> value={mode} onChange={setMode} options={MODE_OPTIONS} />

        <div className="mt-5">
          <Field label="Centimeters">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={cm}
              onChange={(e) => setCm(e.target.value)}
            />
          </Field>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Stat
            label="Feet & inches"
            accent
            value={valid ? `${ft}' ${formatNumber(inch, 1)}"` : "—"}
          />
          <Stat
            label="Meters"
            value={valid ? `${formatNumber(meters, 2)} m` : "—"}
          />
          <Stat
            label="Total inches"
            value={valid ? `${formatNumber(totalIn, 1)} in` : "—"}
          />
        </div>
      </ToolCard>
    );
  }

  const f = num(feet);
  const i = num(inches);
  const valid =
    Number.isFinite(f) && Number.isFinite(i) && f >= 0 && i >= 0;
  const cmOut = (f * 12 + i) * 2.54;
  const meters = cmOut / 100;
  const totalIn = f * 12 + i;

  return (
    <ToolCard>
      <Segmented<Mode> value={mode} onChange={setMode} options={MODE_OPTIONS} />

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Feet">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={feet}
            onChange={(e) => setFeet(e.target.value)}
          />
        </Field>
        <Field label="Inches">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={inches}
            onChange={(e) => setInches(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Centimeters"
          accent
          value={valid ? `${formatNumber(cmOut, 1)} cm` : "—"}
        />
        <Stat
          label="Meters"
          value={valid ? `${formatNumber(meters, 2)} m` : "—"}
        />
        <Stat
          label="Total inches"
          value={valid ? `${formatNumber(totalIn, 1)} in` : "—"}
        />
      </div>
    </ToolCard>
  );
}
