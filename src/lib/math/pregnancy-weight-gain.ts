export type Preg = "single" | "twins";
export type Cat = "under" | "normal" | "over" | "obese";

export const LB = 2.2046226;

// IOM (2009) recommended TOTAL gain by pre-pregnancy BMI, in kg.
export const TOTAL: Record<Preg, Record<Cat, [number, number]>> = {
  single: { under: [12.5, 18], normal: [11.5, 16], over: [7, 11.5], obese: [5, 9] },
  // Provisional IOM ranges for twins (no firm underweight range → use normal).
  twins: { under: [16.8, 24.5], normal: [16.8, 24.5], over: [14.1, 22.7], obese: [11.3, 19.1] },
};
// Weekly rate for the 2nd/3rd trimester (singleton), kg/week.
export const RATE: Record<Cat, [number, number]> = {
  under: [0.44, 0.58], normal: [0.35, 0.5], over: [0.23, 0.33], obese: [0.17, 0.27],
};
// First-trimester total gain (kg), same for all.
export const FIRST: [number, number] = [0.5, 2.0];

export function category(bmi: number): Cat {
  if (bmi < 18.5) return "under";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "over";
  return "obese";
}

export function heightMeters(metric: boolean, cm: number, ft: number, inch: number): number {
  return metric ? cm / 100 : ((ft || 0) * 12 + (inch || 0)) * 0.0254;
}

export function prePregnancyKg(metric: boolean, kg: number, lb: number): number {
  return metric ? kg : lb / LB;
}

export function bodyMassIndex(preKg: number, heightM: number): number {
  return preKg / (heightM * heightM);
}

/** Recommended gain (kg) by the current week. Singleton uses IOM rates; twins scale to the total. */
export function gainByWeek(preg: Preg, cat: Cat, week: number): [number, number] {
  const total = TOTAL[preg][cat];
  if (preg === "single") {
    const extra = Math.max(0, week - 13);
    return [
      Math.min(total[0], FIRST[0] * Math.min(1, week / 13) + RATE[cat][0] * extra),
      Math.min(total[1], FIRST[1] * Math.min(1, week / 13) + RATE[cat][1] * extra),
    ];
  }
  // twins: smooth fraction of total across 40 weeks
  return [total[0] * Math.min(1, week / 40), total[1] * Math.min(1, week / 40)];
}
