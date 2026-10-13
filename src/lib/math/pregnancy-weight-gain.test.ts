import { describe, expect, it } from "vitest";
import {
  LB,
  TOTAL,
  bodyMassIndex,
  category,
  gainByWeek,
  heightMeters,
  prePregnancyKg,
} from "@/lib/math/pregnancy-weight-gain";

describe("pregnancy weight gain", () => {
  it("reads 5'5\" and 132 lb as BMI 22.0 with a 25–35 lb total", () => {
    const heightM = heightMeters(false, 165, 5, 5);
    const preKg = prePregnancyKg(false, 60, 132);
    const bmi = bodyMassIndex(preKg, heightM);
    expect(bmi.toFixed(1)).toBe("22.0");
    expect(category(bmi)).toBe("normal");
    const total = TOTAL.single.normal;
    expect(total).toEqual([11.5, 16]);
    expect((total[0] * LB).toFixed(0)).toBe("25");
    expect((total[1] * LB).toFixed(0)).toBe("35");
  });

  it("reads 165 cm and 60 kg as the same BMI band and the kg range", () => {
    const heightM = heightMeters(true, 165, 5, 5);
    const preKg = prePregnancyKg(true, 60, 132);
    const bmi = bodyMassIndex(preKg, heightM);
    expect(bmi.toFixed(1)).toBe("22.0");
    expect(heightM).toBe(1.65);
    expect(preKg).toBe(60);
    expect(TOTAL.single[category(bmi)]).toEqual([11.5, 16]);
  });

  it("splits BMI into IOM categories on the published cutoffs", () => {
    expect(category(18.49)).toBe("under");
    expect(category(18.5)).toBe("normal");
    expect(category(24.99)).toBe("normal");
    expect(category(25)).toBe("over");
    expect(category(29.99)).toBe("over");
    expect(category(30)).toBe("obese");
    expect(TOTAL.twins.normal).toEqual([16.8, 24.5]);
    expect(TOTAL.single.obese).toEqual([5, 9]);
  });

  it("ramps singleton gain after week 13 and scales twins across 40 weeks", () => {
    const [lo, hi] = gainByWeek("single", "normal", 20);
    expect(lo).toBeCloseTo(2.95, 2);
    expect(hi).toBe(5.5);
    expect(gainByWeek("twins", "normal", 40)).toEqual([16.8, 24.5]);
    expect(gainByWeek("twins", "normal", 0)).toEqual([0, 0]);
    expect(gainByWeek("single", "normal", 1)[0]).toBeGreaterThan(0);
    expect(gainByWeek("single", "normal", 1)[1]).toBeLessThanOrEqual(16);
  });
});
