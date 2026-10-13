import { describe, expect, it } from "vitest";
import { MACRS, schedule } from "@/lib/math/depreciation";

const sumDep = (rows: { dep: number }[]) => rows.reduce((s, row) => s + row.dep, 0);

describe("straight-line", () => {
  it("spreads cost minus salvage evenly over the life", () => {
    const rows = schedule("sl", 50_000, 5_000, 7, "7");
    expect(rows[0].dep.toFixed(2)).toBe("6428.57");
    expect(sumDep(rows)).toBe(45_000);
    expect(rows).toHaveLength(7);
    expect(rows.at(-1)?.book.toFixed(2)).toBe("5000.00");
  });

  it("depreciates nothing when salvage covers the whole cost", () => {
    const equal = schedule("sl", 50_000, 50_000, 7, "7");
    expect(equal.every((row) => row.dep === 0)).toBe(true);
    expect(equal.at(-1)?.book).toBe(50_000);

    expect(() => schedule("sl", 50_000, 60_000, 7, "7")).not.toThrow();
    const over = schedule("sl", 50_000, 60_000, 7, "7");
    expect(over).toHaveLength(7);
  });
});

describe("MACRS", () => {
  it("uses the 7-year half-year table on the full cost", () => {
    expect(MACRS["7"]).toHaveLength(8);
    expect(MACRS["7"][0]).toBe(14.29);
    const rows = schedule("macrs", 50_000, 5_000, 7, "7");
    expect(rows[0].dep.toFixed(2)).toBe("7145.00");
    expect(sumDep(rows).toFixed(2)).toBe("50000.00");
    expect(rows).toHaveLength(8);
  });

  it("returns no rows for an unknown property class", () => {
    expect(schedule("macrs", 50_000, 0, 7, "nope")).toEqual([]);
  });
});

describe("double-declining", () => {
  it("front-loads year 1 and stops at salvage", () => {
    const rows = schedule("ddb", 50_000, 5_000, 7, "7");
    expect(rows[0].dep.toFixed(2)).toBe("14285.71");
    expect(rows.at(-1)?.book.toFixed(2)).toBe("5000.00");
    expect(sumDep(rows).toFixed(2)).toBe("45000.00");
  });
});
