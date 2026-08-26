"use client";

import { useMemo, useState } from "react";
import { formatNumber } from "@/lib/format";
import { Field, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

const MAX_N = 1_000_000_000_000; // 1e12 — trial division to √n stays fast

const SUP: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
};
const toSuper = (n: number) =>
  String(n).split("").map((d) => SUP[d] ?? d).join("");

/** Prime factorization as [prime, exponent] pairs, via trial division. */
function factorize(n: number): [number, number][] {
  const out: [number, number][] = [];
  let m = n;
  let e2 = 0;
  while (m % 2 === 0) {
    m /= 2;
    e2++;
  }
  if (e2 > 0) out.push([2, e2]);
  for (let p = 3; p * p <= m; p += 2) {
    if (m % p === 0) {
      let e = 0;
      while (m % p === 0) {
        m /= p;
        e++;
      }
      out.push([p, e]);
    }
  }
  if (m > 1) out.push([m, 1]);
  return out;
}

/** All positive divisors, generated from the factorization. */
function divisorsFrom(f: [number, number][]): number[] {
  let divs = [1];
  for (const [p, e] of f) {
    const base = [...divs];
    let pk = 1;
    for (let i = 1; i <= e; i++) {
      pk *= p;
      for (const d of base) divs.push(d * pk);
    }
  }
  return divs.sort((a, b) => a - b);
}

export function PrimeFactorizationCalculator() {
  const [nStr, setNStr] = useState("360");
  const n = num(nStr);

  const valid = Number.isInteger(n) && n >= 1 && n <= MAX_N;
  const tooBig = Number.isInteger(n) && n > MAX_N;

  const { factStr, primes, divisors, isPrime } = useMemo(() => {
    if (!valid || n === 1) {
      return {
        factStr: n === 1 ? "1 (no prime factors)" : "—",
        primes: "—",
        divisors: n === 1 ? [1] : [],
        isPrime: false,
      };
    }
    const f = factorize(n);
    const str = f
      .map(([p, e]) => (e === 1 ? `${p}` : `${p}${toSuper(e)}`))
      .join(" × ");
    const prime = f.length === 1 && f[0][1] === 1;
    return {
      factStr: str,
      primes: f.map(([p]) => p).join(", "),
      divisors: divisorsFrom(f),
      isPrime: prime,
    };
  }, [valid, n]);

  const divisorList =
    divisors.length === 0
      ? "—"
      : divisors.length <= 120
        ? divisors.map((d) => formatNumber(d, 0)).join(", ")
        : `${divisors
            .slice(0, 120)
            .map((d) => formatNumber(d, 0))
            .join(", ")} … (+${divisors.length - 120} more)`;

  return (
    <ToolCard>
      <div className="grid gap-4">
        <Field label="Number">
          <input
            className="field"
            type="number"
            inputMode="numeric"
            value={nStr}
            onChange={(e) => setNStr(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat label="Prime factorization" accent value={valid ? factStr : "—"} />
        <Stat label="Prime number?" value={valid ? (isPrime ? "Yes" : "No") : "—"} />
        <Stat label="Distinct prime factors" value={valid ? primes : "—"} />
        <Stat
          label="Number of divisors"
          value={valid ? formatNumber(divisors.length, 0) : "—"}
        />
      </div>

      {valid ? (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-wide text-[var(--ink-soft)]">
            All divisors
          </p>
          <p className="mt-1 text-sm text-[var(--ink)] leading-relaxed break-words">
            {divisorList}
          </p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-[var(--ink-soft)]">
          {tooBig
            ? `Enter a whole number of ${formatNumber(MAX_N, 0)} or less.`
            : "Enter a whole number of 1 or more."}
        </p>
      )}
    </ToolCard>
  );
}
