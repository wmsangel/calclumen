"use client";

import { useMemo, useState } from "react";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const MAX_N = 200; // keeps the exact BigInt DP fast and results displayable

/** Group a digit string with thousands separators: "145750" -> "145,750". */
function groupDigits(s: string): string {
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Exact for modest sizes; scientific approximation once it gets huge. */
function fmtBig(x: bigint): string {
  const s = x.toString();
  if (s.length <= 21) return groupDigits(s);
  const exp = s.length - 1;
  const mant = `${s[0]}.${s.slice(1, 4)}`;
  return `≈ ${mant}×10^${exp} (${s.length} digits)`;
}

/** Row S(n, 0..n) of Stirling numbers of the second kind, exact. */
function stirlingSecond(n: number): bigint[] {
  let row: bigint[] = [BigInt(1)]; // S(0,0) = 1
  for (let i = 1; i <= n; i++) {
    const next: bigint[] = new Array(i + 1).fill(BigInt(0));
    for (let j = 1; j <= i; j++) {
      const prevSameK = j <= i - 1 ? row[j] : BigInt(0); // S(i-1, j)
      const prevPrevK = row[j - 1] ?? BigInt(0); // S(i-1, j-1)
      next[j] = BigInt(j) * prevSameK + prevPrevK;
    }
    row = next;
  }
  return row;
}

function factorialBig(k: number): bigint {
  let acc = BigInt(1);
  for (let i = 2; i <= k; i++) acc *= BigInt(i);
  return acc;
}

export function SetPartitionsCalculator() {
  const [nStr, setNStr] = useState("11");
  const [kStr, setKStr] = useState("4");

  const n = num(nStr);
  const k = num(kStr);

  const valid =
    Number.isInteger(n) &&
    Number.isInteger(k) &&
    n >= 0 &&
    n <= MAX_N &&
    k >= 0 &&
    k <= n;

  const { snk, labeled, bell } = useMemo(() => {
    if (!valid) return { snk: null, labeled: null, bell: null };
    const row = stirlingSecond(n); // S(n, 0..n)
    const s = row[k] ?? BigInt(0);
    const bellSum = row.reduce((acc, v) => acc + v, BigInt(0));
    const lab = factorialBig(k) * s; // k! · S(n,k) = onto functions
    return { snk: s, labeled: lab, bell: bellSum };
  }, [valid, n, k]);

  const tooBig =
    Number.isInteger(n) && Number.isInteger(k) && n > MAX_N;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="n (objects to split)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={nStr}
            onChange={(e) => setNStr(e.target.value)}
          />
        </Field>
        <Field label="k (number of groups)">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={kStr}
            onChange={(e) => setKStr(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label={
            valid ? `Into ${k} identical groups — S(n,k)` : "Into k groups — S(n,k)"
          }
          accent
          value={snk !== null ? fmtBig(snk) : "—"}
        />
        <Stat
          label={valid ? `Into ${k} labeled groups — k!·S(n,k)` : "Into k labeled groups"}
          value={labeled !== null ? fmtBig(labeled) : "—"}
        />
        <Stat
          label="Into any number of groups — Bell(n)"
          value={bell !== null ? fmtBig(bell) : "—"}
        />
        <Stat
          label="Groups must be non-empty"
          value={valid ? "each group ≥ 1" : "—"}
        />
      </div>

      {tooBig ? (
        <p className="mt-4 text-sm text-[var(--ink-soft)]">
          Enter n of {MAX_N} or fewer.
        </p>
      ) : !valid ? (
        <p className="mt-4 text-sm text-[var(--ink-soft)]">
          Enter whole numbers with 0 ≤ k ≤ n.
        </p>
      ) : null}
    </ToolCard>
  );
}
