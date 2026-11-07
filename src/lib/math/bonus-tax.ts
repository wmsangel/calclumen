// Bonus (supplemental wage) withholding — US federal "percentage method".
//
// Sources (tax year 2026):
// - IRS Publication 15 (Circular E), "Supplemental Wages": flat 22% federal
//   withholding on supplemental wages up to $1,000,000 in the year; the amount
//   above $1,000,000 is withheld at 37%.
// - IRS Publication 15: Social Security 6.2% on wages up to the $184,500 wage
//   base (2026); Medicare 1.45% with no wage base; Additional Medicare Tax 0.9%
//   on wages above $200,000 (withholding threshold, regardless of filing status).
// State withholding is an optional flat % the user supplies (it varies by
// state and some states have no income tax), so no state table is baked in.
// This models what is WITHHELD from the bonus check, not the final tax due —
// the actual liability is settled on the annual return.

export const BONUS_TAX_2026 = {
  supplementalRate: 0.22,
  supplementalHighRate: 0.37,
  supplementalHighThreshold: 1_000_000,
  socialSecurityRate: 0.062,
  socialSecurityWageBase: 184_500,
  medicareRate: 0.0145,
  additionalMedicareRate: 0.009,
  additionalMedicareThreshold: 200_000,
} as const;

export interface BonusTaxInput {
  bonus: number;
  /** Regular wages already paid this year, before the bonus. */
  ytdWages: number;
  /** Supplemental wages already paid this year (earlier bonuses), before this one. */
  ytdSupplemental: number;
  /** Optional flat state withholding rate on supplemental wages, %. */
  statePct: number;
}

export interface BonusTaxResult {
  federal: number;
  socialSecurity: number;
  medicare: number;
  additionalMedicare: number;
  state: number;
  totalWithheld: number;
  netBonus: number;
  /** Total withholding as % of the bonus. */
  effectivePct: number;
  /** Portion of the bonus that fell into the 37% bracket. */
  bonusAbove1M: number;
}

const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function bonusTax(inp: BonusTaxInput): BonusTaxResult {
  const t = BONUS_TAX_2026;
  const bonus = pos(inp.bonus);
  const ytdWages = pos(inp.ytdWages);
  const ytdSupp = pos(inp.ytdSupplemental);

  // Federal: 22% up to the $1M supplemental threshold (counting earlier
  // supplemental wages this year), 37% on the excess.
  const roomAt22 = Math.max(0, t.supplementalHighThreshold - ytdSupp);
  const at22 = Math.min(bonus, roomAt22);
  const bonusAbove1M = bonus - at22;
  const federal = at22 * t.supplementalRate + bonusAbove1M * t.supplementalHighRate;

  // FICA is computed on all wages year-to-date (regular + supplemental).
  const ytdAll = ytdWages + ytdSupp;
  const ssRoom = Math.max(0, t.socialSecurityWageBase - ytdAll);
  const socialSecurity = Math.min(bonus, ssRoom) * t.socialSecurityRate;
  const medicare = bonus * t.medicareRate;
  const addlRoom = Math.max(0, t.additionalMedicareThreshold - ytdAll);
  const additionalMedicare = Math.max(0, bonus - addlRoom) * t.additionalMedicareRate;

  const state = bonus * (pos(inp.statePct) / 100);

  const totalWithheld = federal + socialSecurity + medicare + additionalMedicare + state;
  return {
    federal,
    socialSecurity,
    medicare,
    additionalMedicare,
    state,
    totalWithheld,
    netBonus: bonus - totalWithheld,
    effectivePct: bonus > 0 ? (totalWithheld / bonus) * 100 : 0,
    bonusAbove1M,
  };
}
