"use client";

/**
 * Dependency-free SVG charts sized to the container width.
 * `preserveAspectRatio="none"` stretches the path horizontally; strokes keep
 * their width via `vectorEffect="non-scaling-stroke"`.
 */
export function AreaChart({
  data,
  color = "var(--accent)",
  height = 170,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  if (!data || data.length < 2 || data.some((v) => !Number.isFinite(v)))
    return null;

  const max = Math.max(...data);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const n = data.length;
  const x = (i: number) => (i / (n - 1)) * 100;
  const y = (v: number) => height - ((v - min) / range) * height;

  const line = data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = `0,${height} ${line} 100,${height}`;

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      role="img"
      aria-label="Chart"
      className="block"
    >
      <polygon points={area} fill={color} opacity="0.12" />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** A multi-segment proportion bar with a legend. */
export function MultiBar({
  segments,
}: {
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full">
        {segments.map((s, i) => (
          <div
            key={i}
            style={{
              width: `${Math.max(0, (s.value / total) * 100)}%`,
              background: s.color,
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--ink-soft)]">
        {segments.map((s, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm"
              style={{ background: s.color }}
            />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** A two-segment proportion bar with a small legend. */
export function SplitBar({
  a,
  b,
  aLabel,
  bLabel,
  aColor = "var(--accent)",
  bColor = "var(--rule-strong)",
}: {
  a: number;
  b: number;
  aLabel: string;
  bLabel: string;
  aColor?: string;
  bColor?: string;
}) {
  const total = a + b || 1;
  const ap = Math.max(0, Math.min(100, (a / total) * 100));
  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full">
        <div style={{ width: `${ap}%`, background: aColor }} />
        <div style={{ width: `${100 - ap}%`, background: bColor }} />
      </div>
      <div className="mt-2 flex justify-between text-xs text-[var(--ink-soft)]">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm"
            style={{ background: aColor }}
          />
          {aLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm"
            style={{ background: bColor }}
          />
          {bLabel}
        </span>
      </div>
    </div>
  );
}
