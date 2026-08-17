"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

type Unit = "km" | "mi";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

/** Seconds -> "M:SS" (floor minutes, pad seconds). */
function formatPace(totalSec: number): string {
  const minutes = Math.floor(totalSec / 60);
  const seconds = Math.floor(totalSec - minutes * 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function PaceCalculator() {
  const [unit, setUnit] = useState<Unit>("km");
  const [distance, setDistance] = useState("10");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("50");
  const [seconds, setSeconds] = useState("0");

  const value = num(distance);
  const h = num(hours);
  const m = num(minutes);
  const s = num(seconds);

  const distKm = unit === "mi" ? value * 1.609344 : value;
  const distMi = unit === "km" ? value / 1.609344 : value;
  const totalSec = h * 3600 + m * 60 + s;

  const valid =
    Number.isFinite(distKm) &&
    distKm > 0 &&
    Number.isFinite(totalSec) &&
    totalSec > 0;

  const paceKmSec = valid ? totalSec / distKm : NaN;
  const paceMiSec = valid ? totalSec / distMi : NaN;
  const speedKmh = valid ? distKm / (totalSec / 3600) : NaN;
  const speedMph = valid ? distMi / (totalSec / 3600) : NaN;

  return (
    <ToolCard>
      <Field label="Distance">
        <div className="flex gap-2">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
          <Segmented<Unit>
            value={unit}
            onChange={setUnit}
            options={[
              { value: "km", label: "km" },
              { value: "mi", label: "mi" },
            ]}
          />
        </div>
      </Field>

      <div className="mt-5">
        <span className="label">Time</span>
        <div className="mt-1 grid gap-2 grid-cols-3">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            aria-label="Hours"
            placeholder="hh"
          />
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            aria-label="Minutes"
            placeholder="mm"
          />
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={seconds}
            onChange={(e) => setSeconds(e.target.value)}
            aria-label="Seconds"
            placeholder="ss"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Pace per km"
          accent
          value={valid ? `${formatPace(paceKmSec)} /km` : "—"}
        />
        <Stat
          label="Pace per mile"
          value={valid ? `${formatPace(paceMiSec)} /mi` : "—"}
        />
        <Stat
          label="Speed"
          value={valid ? `${formatNumber(speedKmh, 2)} km/h` : "—"}
        />
        <Stat
          label="Speed"
          value={valid ? `${formatNumber(speedMph, 2)} mph` : "—"}
        />
      </div>
    </ToolCard>
  );
}
