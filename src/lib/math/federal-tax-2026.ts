// US federal income-tax parameters for tax year 2026 (returns filed in 2027).
// Source: IRS Rev. Proc. 2025-32 (inflation adjustments, October 2025);
// FICA/SECA: IRS Publication 15, Topic 751, SSA contribution and benefit base.
export type Filing = "single" | "mfj";

export const TAX_YEAR = 2026;

export const STANDARD_DEDUCTION: Record<Filing, number> = {
  single: 16_100,
  mfj: 32_200,
};

/** [rate, upper bound of the band (taxable income)] */
export const BRACKETS: Record<Filing, [number, number][]> = {
  single: [
    [0.1, 12_400],
    [0.12, 50_400],
    [0.22, 105_700],
    [0.24, 201_775],
    [0.32, 256_225],
    [0.35, 640_600],
    [0.37, Infinity],
  ],
  mfj: [
    [0.1, 24_800],
    [0.12, 100_800],
    [0.22, 211_400],
    [0.24, 403_550],
    [0.32, 512_450],
    [0.35, 768_700],
    [0.37, Infinity],
  ],
};

export const SOCIAL_SECURITY_WAGE_BASE = 184_500;
export const SE_NET_EARNINGS_FACTOR = 0.9235; // Schedule SE line 4a
export const SE_SOCIAL_SECURITY_RATE = 0.124;
export const SE_MEDICARE_RATE = 0.029;
export const ADDITIONAL_MEDICARE_RATE = 0.009;
export const ADDITIONAL_MEDICARE_THRESHOLD: Record<Filing, number> = {
  single: 200_000,
  mfj: 250_000,
};

/** Progressive federal income tax on taxable income; marginal rate as a fraction. */
export function federalIncomeTax(taxable: number, filing: Filing): { tax: number; marginal: number } {
  const t = Math.max(0, taxable);
  let tax = 0;
  let prev = 0;
  let marginal = 0;
  for (const [rate, upTo] of BRACKETS[filing]) {
    if (t > prev) {
      tax += rate * (Math.min(t, upTo) - prev);
      marginal = rate;
    }
    prev = upTo;
  }
  return { tax, marginal };
}
