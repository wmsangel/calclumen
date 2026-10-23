// Property-tax math. Taxable value = assessed value × assessment ratio minus
// any exemptions; annual tax = taxable × rate. Kept pure and framework-free so
// it can be unit-tested and reused by the calculator component.

export interface PropertyTax {
  /** Value the tax is assessed on, after the assessment ratio. */
  assessed: number;
  /** Assessed value minus exemptions — what the rate is applied to. */
  taxable: number;
  /** Annual property tax. */
  annual: number;
  /** Monthly amount (e.g. for a mortgage escrow). */
  monthly: number;
  /** Tax as a share of the home's market value, in percent. */
  effectiveRatePct: number;
}

/**
 * @param marketValue  home's market value
 * @param ratioPct     assessment ratio — assessed value as a % of market value
 *                     (many US jurisdictions assess below market; default 100)
 * @param ratePct      annual property-tax rate, in percent (1 mill = 0.1%)
 * @param exemptions   value subtracted from the assessed value before the rate
 */
export function propertyTax(
  marketValue: number,
  ratioPct: number,
  ratePct: number,
  exemptions: number,
): PropertyTax {
  const assessed = Math.max(0, marketValue) * (Math.max(0, ratioPct) / 100);
  const taxable = Math.max(0, assessed - Math.max(0, exemptions));
  const annual = taxable * (Math.max(0, ratePct) / 100);
  const monthly = annual / 12;
  const effectiveRatePct = marketValue > 0 ? (annual / marketValue) * 100 : 0;
  return { assessed, taxable, annual, monthly, effectiveRatePct };
}
