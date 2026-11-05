// Rent vs. Buy — opportunity-cost ("invest the difference") model.
//
// Both a buyer and a renter are assumed to have the same housing budget each
// month. The party with the cheaper housing cost invests the difference at the
// investment-return rate; the buyer also ties up the down payment + closing
// costs upfront, which the renter instead invests. At the end of the horizon we
// compare each side's net worth: the buyer's investments plus their home equity
// (sale price − selling costs − remaining mortgage) vs the renter's investments.
// This is the standard methodology used by well-known rent-vs-buy calculators
// (e.g. The New York Times "Is It Better to Rent or Buy?"). It is arithmetic on
// the user's own inputs and clearly-labelled assumptions — no external data.

export interface RentVsBuyInput {
  homePrice: number;
  downPaymentPct: number;
  mortgageRatePct: number;
  loanTermYears: number;
  /** Annual home-price appreciation, %. */
  homeAppreciationPct: number;
  /** Annual property tax as % of home value. */
  propertyTaxPct: number;
  /** Annual maintenance + home insurance as % of home value. */
  maintenanceInsurancePct: number;
  hoaMonthly: number;
  /** One-time closing cost when buying, % of price. */
  buyingCostPct: number;
  /** One-time cost when selling, % of sale price. */
  sellingCostPct: number;
  monthlyRent: number;
  /** Annual rent growth, %. */
  rentGrowthPct: number;
  /** Annual return you could earn by investing instead, %. */
  investmentReturnPct: number;
  horizonYears: number;
}

export interface RentVsBuyYear {
  year: number;
  buyNetWorth: number;
  rentNetWorth: number;
}

export interface RentVsBuyResult {
  verdict: "buy" | "rent" | "tie";
  /** Absolute net-worth gap at the horizon, in favour of `verdict`. */
  advantage: number;
  buyNetWorth: number;
  rentNetWorth: number;
  /** First year the buyer's net worth catches up to the renter's, or null. */
  breakEvenYear: number | null;
  /** Down payment + buying closing costs. */
  upfrontCash: number;
  /** Mortgage principal + interest, monthly. */
  monthlyPayment: number;
  /** Average total monthly owning cost in year 1. */
  firstYearBuyMonthly: number;
  /** Average monthly rent in year 1. */
  firstYearRentMonthly: number;
  years: RentVsBuyYear[];
}

const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function rentVsBuy(inp: RentVsBuyInput): RentVsBuyResult {
  const months = Math.max(1, Math.round(pos(inp.horizonYears) * 12));
  const price = pos(inp.homePrice);
  const down = (price * Math.min(100, Math.max(0, inp.downPaymentPct))) / 100;
  const loan = Math.max(0, price - down);
  const upfront = down + (price * pos(inp.buyingCostPct)) / 100;

  const mRate = inp.mortgageRatePct / 100 / 12;
  const n = Math.max(1, Math.round(pos(inp.loanTermYears) * 12));
  const monthlyPayment =
    loan <= 0
      ? 0
      : mRate === 0
        ? loan / n
        : (loan * mRate * Math.pow(1 + mRate, n)) / (Math.pow(1 + mRate, n) - 1);

  const invM = inp.investmentReturnPct / 100 / 12;
  const appM = inp.homeAppreciationPct / 100 / 12;

  let buyerInvest = 0;
  let renterInvest = upfront; // renter invests the cash the buyer tied up
  let balance = loan;
  let homeValue = price;
  let rent = pos(inp.monthlyRent);

  const years: RentVsBuyYear[] = [];
  let firstYearBuySum = 0;
  let firstYearRentSum = 0;
  let breakEvenYear: number | null = null;

  for (let m = 1; m <= months; m++) {
    // Owning cost this month.
    const interest = balance * mRate;
    let principal = monthlyPayment - interest;
    if (principal > balance) principal = balance;
    const mortgagePay = balance > 0 ? interest + principal : 0;
    balance = Math.max(0, balance - principal);
    const propTax = (homeValue * inp.propertyTaxPct) / 100 / 12;
    const upkeep = (homeValue * inp.maintenanceInsurancePct) / 100 / 12;
    const buyerCost = mortgagePay + propTax + upkeep + pos(inp.hoaMonthly);
    const renterCost = rent;

    // The cheaper side invests the difference (equal-budget assumption).
    const diff = buyerCost - renterCost;
    if (diff > 0) renterInvest += diff;
    else buyerInvest += -diff;

    // Grow investments and the home.
    buyerInvest *= 1 + invM;
    renterInvest *= 1 + invM;
    homeValue *= 1 + appM;

    if (m <= 12) {
      firstYearBuySum += buyerCost;
      firstYearRentSum += renterCost;
    }

    // Rent steps up once a year.
    if (m % 12 === 0) rent *= 1 + inp.rentGrowthPct / 100;

    if (m % 12 === 0 || m === months) {
      const sellingCost = (homeValue * pos(inp.sellingCostPct)) / 100;
      const equity = homeValue - sellingCost - balance;
      const buyNetWorth = buyerInvest + equity;
      const rentNetWorth = renterInvest;
      years.push({ year: Math.ceil(m / 12), buyNetWorth, rentNetWorth });
      if (breakEvenYear === null && buyNetWorth >= rentNetWorth) {
        breakEvenYear = Math.ceil(m / 12);
      }
    }
  }

  const last = years[years.length - 1];
  const gap = last.buyNetWorth - last.rentNetWorth;

  return {
    verdict: Math.abs(gap) < 1 ? "tie" : gap > 0 ? "buy" : "rent",
    advantage: Math.abs(gap),
    buyNetWorth: last.buyNetWorth,
    rentNetWorth: last.rentNetWorth,
    breakEvenYear,
    upfrontCash: upfront,
    monthlyPayment,
    firstYearBuyMonthly: firstYearBuySum / 12,
    firstYearRentMonthly: firstYearRentSum / 12,
    years,
  };
}
