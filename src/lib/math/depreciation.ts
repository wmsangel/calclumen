export type Method = "sl" | "ddb" | "macrs";

// IRS MACRS GDS percentage tables, half-year convention (Pub. 946, Table A-1):
// 200% declining balance for 3/5/7/10-year, 150% for 15/20-year, switching to
// straight-line. Each list is the % of the original basis taken in that year.
export const MACRS: Record<string, number[]> = {
  "3": [33.33, 44.45, 14.81, 7.41],
  "5": [20.0, 32.0, 19.2, 11.52, 11.52, 5.76],
  "7": [14.29, 24.49, 17.49, 12.49, 8.93, 8.92, 8.93, 4.46],
  "10": [10.0, 18.0, 14.4, 11.52, 9.22, 7.37, 6.55, 6.55, 6.56, 6.55, 3.28],
  "15": [5.0, 9.5, 8.55, 7.7, 6.93, 6.23, 5.9, 5.9, 5.91, 5.9, 5.91, 5.9, 5.91, 5.9, 5.91, 2.95],
  "20": [3.75, 7.219, 6.677, 6.177, 5.713, 5.285, 4.888, 4.522, 4.462, 4.461, 4.462, 4.461, 4.462, 4.461, 4.462, 4.461, 4.462, 4.461, 4.462, 4.461, 2.231],
};

export interface Row {
  year: number;
  dep: number;
  accum: number;
  book: number;
}

export function schedule(method: Method, cost: number, salvage: number, life: number, cls: string): Row[] {
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
