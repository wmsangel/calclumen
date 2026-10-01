"use client";

import { useState } from "react";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));
const r1 = (n: number) => Math.round(n * 10) / 10;

export function StairCalculator() {
  const [rise, setRise] = useState("108"); // total floor-to-floor rise, inches
  const [targetRiser, setTargetRiser] = useState("7.5");
  const [tread, setTread] = useState("10.5");

  const tr = num(rise);
  const target = num(targetRiser);
  const td = num(tread);

  const valid =
    Number.isFinite(tr) && tr > 0 &&
    Number.isFinite(target) && target > 0 &&
    Number.isFinite(td) && td > 0;

  let risers = NaN;
  let actualRiser = NaN;
  let treads = NaN;
  let totalRun = NaN;
  let stringer = NaN;
  let comfort = NaN;

  if (valid) {
    risers = Math.max(1, Math.round(tr / target));
    actualRiser = tr / risers;
    treads = risers - 1;
    totalRun = treads * td;
    stringer = Math.sqrt(tr * tr + totalRun * totalRun);
    comfort = 2 * actualRiser + td; // 2R + T comfort rule (~24-25 in)
  }

  // Code-ish checks (US IRC residential): riser ≤ 7.75", tread ≥ 10", 2R+T 24-25".
  const riserOk = valid && actualRiser <= 7.75;
  const treadOk = valid && td >= 10;
  const comfortOk = valid && comfort >= 24 && comfort <= 25;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Total rise — floor to floor (in)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={rise}
            onChange={(e) => setRise(e.target.value)}
          />
        </Field>
        <Field label="Target riser height (in)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={targetRiser}
            onChange={(e) => setTargetRiser(e.target.value)}
          />
        </Field>
        <Field label="Tread depth (in)">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            value={tread}
            onChange={(e) => setTread(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Number of steps (risers)"
          accent
          value={valid ? String(risers) : "—"}
          sub={valid ? `${treads} treads` : undefined}
        />
        <Stat
          label="Actual riser height"
          value={valid ? `${r1(actualRiser)}"` : "—"}
          sub={valid ? (riserOk ? "within 7.75\" max" : "over 7.75\" code max") : undefined}
        />
        <Stat
          label="Total run (horizontal)"
          value={valid ? `${r1(totalRun)}"` : "—"}
        />
        <Stat
          label="Stringer length"
          value={valid ? `${r1(stringer)}"` : "—"}
        />
        <Stat
          label="Tread depth"
          value={valid ? `${r1(td)}"` : "—"}
          sub={valid ? (treadOk ? "meets 10\" min" : "under 10\" min") : undefined}
        />
        <Stat
          label="Comfort (2×riser + tread)"
          value={valid ? `${r1(comfort)}"` : "—"}
          sub={valid ? (comfortOk ? "ideal 24–25\"" : "outside 24–25\"") : undefined}
        />
      </div>

      <p className="mt-4 text-sm text-[var(--ink-soft)]">
        Based on typical US residential code (IRC): max riser 7.75&quot;, min
        tread 10&quot;, and the comfort rule 2×riser + tread ≈ 24–25&quot;. Always
        confirm your local building code and headroom before cutting stringers.
      </p>
    </ToolCard>
  );
}
