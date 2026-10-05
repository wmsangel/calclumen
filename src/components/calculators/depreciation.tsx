"use client";

import { useState } from "react";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { Field, Segmented, Stat, ToolCard } from "@/components/ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

type Method = "sl" | "ddb" | "macrs";

// IRS MACRS GDS percentage tables, half-year convention (Pub. 946, Table A-1):
// 200% declining balance for 3/5/7/10-year, 150% for 15/20-year, switching to
// straight-line. Each list is the % of the original basis taken in that year.
const MACRS: Record<string, number[]> = {
  "3": [33.33, 44.45, 14.81, 7.41],
  "5": [20.0, 32.0, 19.2, 11.52, 11.52, 5.76],
  "7": [14.29, 24.49, 17.49, 12.49, 8.93, 8.92, 8.93, 4.46],
  "10": [10.0, 18.0, 14.4, 11.52, 9.22, 7.37, 6.55, 6.55, 6.56, 6.55, 3.28],
  "15": [5.0, 9.5, 8.55, 7.7, 6.93, 6.23, 5.9, 5.9, 5.91, 5.9, 5.91, 5.9, 5.91, 5.9, 5.91, 2.95],
  "20": [3.75, 7.219, 6.677, 6.177, 5.713, 5.285, 4.888, 4.522, 4.462, 4.461, 4.462, 4.461, 4.462, 4.461, 4.462, 4.461, 4.462, 4.461, 4.462, 4.461, 2.231],
};

const MACRS_CLASSES: { value: string; label: string }[] = [
  { value: "3", label: "3-year (tools, tractors)" },
  { value: "5", label: "5-year (vehicles, computers)" },
  { value: "7", label: "7-year (office furniture, equipment)" },
  { value: "10", label: "10-year (water transport, ag.)" },
  { value: "15", label: "15-year (land improvements)" },
  { value: "20", label: "20-year (farm buildings)" },
];

interface Row {
  year: number;
  dep: number;
  accum: number;
  book: number;
}

function schedule(method: Method, cost: number, salvage: number, life: number, cls: string): Row[] {
  const rows: Row[] = [];
  if (method === "macrs") {
    const pcts = MACRS[cls] ?? [];
    let accum = 0;
    pcts.forEach((p, i) => {
      const dep = (cost * p) / 100;
      accum += dep;
      rows.push({ year: i + 1, dep, accum, book: cost - accum });
    });
    return rows;
  }
  // straight-line and double-declining share a depreciable base above salvage.
  const n = Math.max(1, Math.round(life));
  let book = cost;
  let accum = 0;
  const rate = method === "ddb" ? 2 / n : 0;
  for (let y = 1; y <= n; y++) {
    const remaining = n - y + 1;
    let dep: number;
    if (method === "ddb") {
      const slRem = (book - salvage) / remaining; // switch to SL when it's larger
      dep = Math.max(book * rate, slRem);
    } else {
      dep = (cost - salvage) / n;
    }
    dep = Math.min(dep, Math.max(0, book - salvage)); // never below salvage
    accum += dep;
    book -= dep;
    rows.push({ year: y, dep, accum, book });
  }
  return rows;
}

export function DepreciationCalculator() {
  const [method, setMethod] = useState<Method>("sl");
  const [cost, setCost] = useState("50000");
  const [salvage, setSalvage] = useState("5000");
  const [life, setLife] = useState("7");
  const [cls, setCls] = useState("7");
  const [currency, setCurrency] = useState("USD");

  const C = num(cost);
  const S = num(salvage);
  const L = num(life);

  const usesLife = method !== "macrs";
  const valid =
    Number.isFinite(C) && C > 0 &&
    (!usesLife || (Number.isFinite(S) && S >= 0 && S <= C)) &&
    (!usesLife || (Number.isFinite(L) && L >= 1));

  const rows = valid ? schedule(method, C, usesLife ? S : 0, usesLife ? L : 1, cls) : [];
  const firstYear = rows[0]?.dep ?? NaN;
  const totalDep = rows.reduce((s, r) => s + r.dep, 0);
  const base = method === "macrs" ? C : C - S;

  const money = (v: number) => (valid ? formatMoney(v, currency) : "—");

  return (
    <ToolCard>
      <Segmented<Method>
        value={method}
        onChange={setMethod}
        options={[
          { value: "sl", label: "Straight-line" },
          { value: "ddb", label: "Declining balance" },
          { value: "macrs", label: "MACRS (US tax)" },
        ]}
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Asset cost (basis)">
          <div className="flex gap-2">
            <input
              className="field"
              type="number"
              inputMode="decimal"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
            <select
              className="field w-24"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              aria-label="Currency"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </Field>

        {method === "macrs" ? (
          <Field label="Property class" hint="IRS recovery period under GDS">
            <select
              className="field"
              value={cls}
              onChange={(e) => setCls(e.target.value)}
              aria-label="MACRS property class"
            >
              {MACRS_CLASSES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
        ) : (
          <>
            <Field label="Salvage value" hint="Estimated resale value at end of life">
              <input
                className="field"
                type="number"
                inputMode="decimal"
                value={salvage}
                onChange={(e) => setSalvage(e.target.value)}
              />
            </Field>
            <Field label="Useful life (years)">
              <input
                className="field"
                type="number"
                inputMode="numeric"
                value={life}
                onChange={(e) => setLife(e.target.value)}
              />
            </Field>
          </>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="First-year depreciation"
          accent
          value={money(firstYear)}
          sub={
            method === "sl"
              ? "Equal every year"
              : method === "ddb"
              ? "Highest early, then tapers"
              : `MACRS ${cls}-year, half-year convention`
          }
        />
        <Stat
          label="Depreciable base"
          value={money(base)}
          sub={method === "macrs" ? "full cost (salvage ignored)" : "cost − salvage"}
        />
        <Stat
          label="Total depreciation"
          value={money(totalDep)}
          sub={valid ? `over ${rows.length} year${rows.length === 1 ? "" : "s"}` : undefined}
        />
        <Stat
          label="Recovery period"
          value={valid ? `${rows.length} yr` : "—"}
          sub={method === "macrs" ? "life + 1 (half-year)" : undefined}
        />
      </div>

      {valid && rows.length > 0 ? (
        <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--rule)]">
          <table className="w-full text-sm tabular-nums">
            <thead>
              <tr className="text-left text-[var(--ink-soft)] border-b border-[var(--rule)]">
                <th className="px-3 py-2 font-medium">Year</th>
                <th className="px-3 py-2 font-medium">Depreciation</th>
                <th className="px-3 py-2 font-medium">Accumulated</th>
                <th className="px-3 py-2 font-medium">Book value</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.year} className="border-b border-[var(--rule)] last:border-0">
                  <td className="px-3 py-1.5">{r.year}</td>
                  <td className="px-3 py-1.5">{formatMoney(r.dep, currency)}</td>
                  <td className="px-3 py-1.5">{formatMoney(r.accum, currency)}</td>
                  <td className="px-3 py-1.5">{formatMoney(r.book, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <p className="mt-4 text-sm text-[var(--ink-soft)]">
        Straight-line spreads the cost evenly; declining balance (200%) front-loads
        it and switches to straight-line once that gives a bigger deduction, never
        dropping below salvage. MACRS is the system US businesses use on their tax
        return — it ignores salvage, uses IRS percentage tables, and the half-year
        convention adds a final part-year, so a 7-year asset depreciates over 8 rows.
        This is an estimate; bonus depreciation, Section 179 and the mid-quarter
        convention can change the result — confirm with a tax professional.
      </p>
    </ToolCard>
  );
}
