"use client";

import { useState } from "react";
import { Field, Segmented, ToolCard } from "@/components/ui";

type Mode = "wake" | "bed";

const FALL_ASLEEP_MIN = 15;
const CYCLE_MIN = 90;

/** "HH:MM" -> minutes since midnight, or NaN. */
function parseTime(s: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
  if (!m) return NaN;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return NaN;
  return h * 60 + min;
}

/** minutes (any integer) -> 12-hour "h:MM AM/PM". */
function formatTime(mins: number): string {
  const t = ((mins % 1440) + 1440) % 1440;
  const h24 = Math.floor(t / 60);
  const m = t % 60;
  const ampm = h24 < 12 ? "AM" : "PM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

interface Row {
  cycles: number;
  minutes: number;
}

export function SleepCalculator() {
  const [mode, setMode] = useState<Mode>("wake");
  const [time, setTime] = useState("07:00");

  const base = parseTime(time);
  const valid = Number.isFinite(base);

  let rows: Row[] = [];
  if (valid) {
    if (mode === "wake") {
      rows = [6, 5, 4, 3].map((cycles) => ({
        cycles,
        minutes: ((base - (cycles * CYCLE_MIN + FALL_ASLEEP_MIN)) % 1440 + 1440) % 1440,
      }));
    } else {
      rows = [3, 4, 5, 6].map((cycles) => ({
        cycles,
        minutes: (base + FALL_ASLEEP_MIN + cycles * CYCLE_MIN) % 1440,
      }));
    }
  }

  return (
    <ToolCard>
      <div className="flex flex-wrap gap-3">
        <Segmented<Mode>
          value={mode}
          onChange={setMode}
          options={[
            { value: "wake", label: "Wake up at" },
            { value: "bed", label: "Go to bed at" },
          ]}
        />
      </div>

      <div className="mt-5">
        <Field
          label={mode === "wake" ? "I want to wake up at" : "I plan to go to bed at"}
          hint="Allows about 15 minutes to fall asleep."
        >
          <input
            className="field"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)] mb-2">
          {mode === "wake" ? "Best times to fall asleep" : "Best times to wake up"}
        </div>
        {valid ? (
          <ul className="rounded-xl border border-[var(--rule)] overflow-hidden">
            {rows.map((row) => {
              const recommended = row.cycles === 5 || row.cycles === 6;
              return (
                <li
                  key={row.cycles}
                  className="flex items-center justify-between gap-4 px-4 py-3 border-b border-[var(--rule)] last:border-0"
                  style={
                    recommended
                      ? { background: "var(--accent-soft)" }
                      : undefined
                  }
                >
                  <span
                    className="text-lg font-semibold numeral"
                    style={recommended ? { color: "var(--accent)" } : undefined}
                  >
                    {formatTime(row.minutes)}
                  </span>
                  <span className="text-sm text-[var(--ink-soft)]">
                    {row.cycles} cycles · {row.cycles * 1.5} h sleep
                    {recommended ? " · recommended" : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-[var(--ink-soft)]">
            Enter a time to see your recommended sleep schedule.
          </p>
        )}
      </div>
    </ToolCard>
  );
}
