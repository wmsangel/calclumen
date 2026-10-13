export type Sex = "male" | "female";

// Widmark distribution ratio (fraction of body that is water-equivalent).
export const R: Record<Sex, number> = { male: 0.68, female: 0.55 };
// Average alcohol elimination rate, % BAC per hour.
export const ELIM = 0.015;
// Grams of pure alcohol in one US standard drink.
export const GRAMS_PER_DRINK = 14;
// US legal driving limit (BAC %).
export const LEGAL = 0.08;

const LB_PER_KG = 2.2046226;

export function weightKgFromInput(units: "kg" | "lb", weight: number): number {
  return units === "kg" ? weight : weight / LB_PER_KG;
}

/** Widmark BAC (%) plus hours until sober and until the US 0.08% limit. */
export function estimateBac(sex: Sex, weightKg: number, drinks: number, hours: number) {
  const grams = drinks * GRAMS_PER_DRINK;
  const peak = (grams / (weightKg * 1000 * R[sex])) * 100; // % before elimination
  const bac = Math.max(0, peak - ELIM * hours);
  const toSober = bac / ELIM;
  const toLegal = bac > LEGAL ? (bac - LEGAL) / ELIM : 0;
  return { peak, bac, toSober, toLegal };
}
