"use client";

import type { ReactNode } from "react";

/** A result cell: muted label above, big value below. */
export function Stat({
  label,
  value,
  accent = false,
  sub,
}: {
  label: string;
  value: ReactNode;
  accent?: boolean;
  sub?: ReactNode;
}) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div
        className="stat-value text-2xl sm:text-[1.7rem]"
        style={accent ? { color: "var(--accent)" } : undefined}
      >
        {value}
      </div>
      {sub ? (
        <div className="mt-1 text-xs text-[var(--ink-soft)] numeral">{sub}</div>
      ) : null}
    </div>
  );
}

/** Labeled input row. */
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint ? (
        <span className="mt-1 block text-xs text-[var(--ink-soft)]">{hint}</span>
      ) : null}
    </label>
  );
}

/** Segmented control for switching modes/units. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          data-on={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** White card that holds the interactive tool. */
export function ToolCard({ children }: { children: ReactNode }) {
  return <div className="card p-5 sm:p-6">{children}</div>;
}
