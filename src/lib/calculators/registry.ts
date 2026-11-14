// Central catalog of every calculator. Pages, home hub, sitemap, and
// internal linking all read from here so a new calculator is one entry away.
import { clusterOfSlug } from "./clusters";

export type CategoryId =
  | "finance"
  | "auto"
  | "business"
  | "health"
  | "datetime"
  | "math"
  | "conversions"
  | "homediy";

export interface CategoryDef {
  id: CategoryId;
  slug: string;
  emoji: string;
  title: string;
  blurb: string;
  /** accent color used for the category chip / hub header */
  accent: string;
}

export interface CalcDef {
  /** URL slug — page lives at /[locale]/<slug> */
  slug: string;
  category: CategoryId;
  /** short label for cards & nav */
  title: string;
  /** page <h1> */
  heading: string;
  /** meta description + card blurb */
  description: string;
  keywords: string[];
  popular?: boolean;
  /** recently added — shows a "New" badge and a home "Recently added" row */
  isNew?: boolean;
}

export const categories: CategoryDef[] = [
  {
    id: "finance",
    slug: "finance",
    emoji: "💰",
    title: "Finance",
    blurb: "Loans, interest, pay and everyday money math.",
    accent: "#2563eb",
  },
  {
    id: "auto",
    slug: "auto",
    emoji: "🚗",
    title: "Auto",
    blurb: "Car loans, leases and payment math.",
    accent: "#0891b2",
  },
  {
    id: "business",
    slug: "business",
    emoji: "📊",
    title: "Business",
    blurb: "Pricing, margins and break-even.",
    accent: "#7c3aed",
  },
  {
    id: "health",
    slug: "health",
    emoji: "❤️",
    title: "Health",
    blurb: "Body metrics and daily energy needs.",
    accent: "#e11d48",
  },
  {
    id: "datetime",
    slug: "date-time",
    emoji: "📅",
    title: "Date & Time",
    blurb: "Count days, spans and deadlines.",
    accent: "#7c3aed",
  },
  {
    id: "math",
    slug: "math",
    emoji: "🧮",
    title: "Math",
    blurb: "Percentages and quick number tools.",
    accent: "#0d9488",
  },
  {
    id: "conversions",
    slug: "conversions",
    emoji: "🔁",
    title: "Conversions",
    blurb: "Units and currencies, converted instantly.",
    accent: "#ea580c",
  },
  {
    id: "homediy",
    slug: "home-diy",
    emoji: "🏠",
    title: "Home & DIY",
    blurb: "Room, paint and material estimates.",
    accent: "#ca8a04",
  },
];

export const calculators: CalcDef[] = [
  {
    slug: "loan-calculator",
    category: "finance",
    title: "Loan",
    heading: "Loan Payment Calculator",
    description:
      "Enter a loan amount, interest rate and term to get the monthly payment, total interest and total cost, with a full month-by-month amortization schedule.",
    keywords: [
      "loan calculator",
      "personal loan calculator",
      "monthly payment calculator",
      "amortization schedule",
    ],
    popular: true,
  },
  {
    slug: "mortgage-calculator",
    category: "finance",
    title: "Mortgage",
    heading: "Mortgage Calculator",
    description:
      "Full monthly mortgage payment with principal, interest, tax, insurance, PMI and HOA from price, down payment, rate and term, plus an amortization schedule.",
    keywords: [
      "mortgage calculator",
      "monthly mortgage payment",
      "mortgage payment calculator",
      "piti calculator",
      "home loan payment calculator",
    ],
    popular: true,
    isNew: true,
  },
  {
    slug: "property-tax-calculator",
    category: "finance",
    title: "Property tax",
    heading: "Property Tax Calculator",
    description:
      "Estimate your annual and monthly property tax from a home's value and your local rate, with assessment ratio, exemptions and your effective tax rate.",
    keywords: [
      "property tax calculator",
      "annual property tax",
      "millage rate calculator",
      "real estate tax calculator",
      "home property tax estimate",
    ],
    isNew: true,
  },
  {
    slug: "traditional-ira-calculator",
    category: "finance",
    title: "Traditional IRA",
    heading: "Traditional IRA Calculator",
    description:
      "Project a Traditional IRA to retirement: tax-deferred growth, your contributions, the tax saved by pre-tax deposits and the after-tax value at withdrawal.",
    keywords: [
      "traditional ira calculator",
      "ira retirement calculator",
      "tax deferred growth calculator",
      "traditional vs roth ira",
      "ira contribution growth",
    ],
    isNew: true,
  },
  {
    slug: "cagr-calculator",
    category: "finance",
    title: "CAGR",
    heading: "CAGR Calculator",
    description:
      "Find the compound annual growth rate between a beginning and ending value over a number of years, plus the total return and total gain.",
    keywords: [
      "cagr calculator",
      "compound annual growth rate",
      "annualized return calculator",
      "investment growth rate",
      "average annual growth rate",
    ],
    isNew: true,
  },
  {
    slug: "apy-calculator",
    category: "finance",
    title: "APY",
    heading: "APY Calculator",
    description:
      "Convert a nominal interest rate into its annual percentage yield (APY) for any compounding frequency, and see the interest earned on a balance over time.",
    keywords: [
      "apy calculator",
      "annual percentage yield",
      "apr to apy",
      "effective annual rate calculator",
      "savings yield calculator",
    ],
    isNew: true,
  },
  {
    slug: "dividend-calculator",
    category: "finance",
    title: "Dividend",
    heading: "Dividend Calculator",
    description:
      "Project dividend income from a balance, yield and growth rate: monthly and annual payouts, with a DRIP option that reinvests and compounds your shares.",
    keywords: [
      "dividend calculator",
      "dividend income calculator",
      "drip calculator",
      "dividend reinvestment calculator",
      "dividend yield calculator",
    ],
    isNew: true,
  },
  {
    slug: "fire-calculator",
    category: "finance",
    title: "FIRE",
    heading: "FIRE Calculator",
    description:
      "Find your FIRE number and how many years to financial independence from your expenses, savings, contributions, return and safe withdrawal rate.",
    keywords: [
      "fire calculator",
      "financial independence calculator",
      "retire early calculator",
      "fire number calculator",
      "4 percent rule calculator",
    ],
    isNew: true,
  },
  {
    slug: "home-equity-calculator",
    category: "finance",
    title: "Home equity / HELOC",
    heading: "Home Equity & HELOC Calculator",
    description:
      "Find how much you can borrow against your home — your equity, available credit at a given CLTV, and the monthly payment on a home equity loan or HELOC.",
    keywords: [
      "home equity calculator",
      "heloc calculator",
      "home equity loan calculator",
      "how much can i borrow against my house",
      "cltv calculator",
    ],
    popular: true,
    isNew: true,
  },
  {
    slug: "pmi-calculator",
    category: "finance",
    title: "PMI (mortgage insurance)",
    heading: "PMI Calculator",
    description:
      "Estimate your monthly private mortgage insurance, when it drops off, and the total PMI you'll pay before reaching 20% equity.",
    keywords: [
      "pmi calculator",
      "private mortgage insurance calculator",
      "how much is pmi",
      "when does pmi go away",
      "mortgage insurance calculator",
    ],
    isNew: true,
  },
  {
    slug: "biweekly-mortgage-calculator",
    category: "finance",
    title: "Biweekly mortgage",
    heading: "Biweekly Mortgage Calculator",
    description:
      "Compare monthly and biweekly mortgage payments from your balance, rate and term: the biweekly amount, interest saved and the years cut from your loan.",
    keywords: [
      "biweekly mortgage calculator",
      "biweekly mortgage payment calculator",
      "bi-weekly mortgage calculator",
      "pay mortgage biweekly savings",
      "extra mortgage payment calculator",
    ],
    popular: true,
    isNew: true,
  },
  {
    slug: "compound-interest-calculator",
    category: "finance",
    title: "Compound interest",
    heading: "Compound Interest Calculator",
    description:
      "See how a deposit grows with compound interest and regular contributions: set rate, compounding frequency and years for the balance and total interest.",
    keywords: [
      "compound interest calculator",
      "investment growth calculator",
      "savings calculator",
    ],
    popular: true,
  },
  {
    slug: "annuity-calculator",
    category: "finance",
    title: "Annuity",
    heading: "Annuity Calculator",
    description:
      "Find the present and future value of an annuity — regular payments at a fixed rate, ordinary or annuity due, with total interest and a growth chart.",
    keywords: [
      "annuity calculator",
      "future value of annuity calculator",
      "present value of annuity calculator",
      "annuity due calculator",
    ],
    isNew: true,
  },
  {
    slug: "rule-of-72-calculator",
    category: "finance",
    title: "Rule of 72",
    heading: "Rule of 72 Calculator",
    description:
      "Estimate how many years it takes to double your money at a given return, or the return needed to double in a set time, with the exact figure alongside.",
    keywords: [
      "rule of 72 calculator",
      "double your money calculator",
      "time to double investment",
      "rule of 72",
    ],
    isNew: true,
  },
  {
    slug: "salary-to-hourly-calculator",
    category: "finance",
    title: "Salary to hourly",
    heading: "Salary to Hourly Calculator",
    description:
      "Convert an annual salary to hourly, daily, weekly and monthly pay from your hours per week and weeks per year, or go the other way from an hourly rate.",
    keywords: [
      "salary to hourly",
      "hourly to salary",
      "annual salary calculator",
      "pay rate calculator",
    ],
  },
  {
    slug: "hourly-to-salary-calculator",
    category: "finance",
    title: "Hourly to salary",
    heading: "Hourly to Salary Calculator",
    description:
      "Convert an hourly wage to yearly, monthly, biweekly and weekly pay from the hours and weeks you work, so you can compare a job offer in any pay period.",
    keywords: [
      "hourly to salary calculator",
      "hourly wage to annual salary",
      "hourly to yearly",
      "annual income from hourly rate",
      "what is my salary",
    ],
    isNew: true,
  },
  {
    slug: "tip-calculator",
    category: "finance",
    title: "Tip & split",
    heading: "Tip Calculator & Bill Splitter",
    description:
      "Work out the tip and total for a restaurant bill at any percentage, then split the bill and tip evenly between any number of people, with rounding options.",
    keywords: [
      "tip calculator",
      "bill split calculator",
      "gratuity calculator",
      "split the bill",
    ],
    popular: true,
  },
  {
    slug: "bmi-calculator",
    category: "health",
    title: "BMI",
    heading: "BMI Calculator",
    description:
      "Calculate Body Mass Index from height and weight in metric or imperial units, see your WHO weight category and the healthy weight range for your height.",
    keywords: [
      "bmi calculator",
      "body mass index",
      "bmi chart",
      "healthy weight calculator",
    ],
    popular: true,
  },
  {
    slug: "calorie-calculator",
    category: "health",
    title: "Calorie / TDEE",
    heading: "Calorie & TDEE Calculator",
    description:
      "Estimate BMR and daily calories (TDEE) with the Mifflin-St Jeor equation from age, sex, height, weight and activity, plus targets to lose or gain weight.",
    keywords: [
      "calorie calculator",
      "tdee calculator",
      "bmr calculator",
      "maintenance calories",
    ],
  },
  {
    slug: "bac-calculator",
    category: "health",
    title: "BAC (blood alcohol)",
    heading: "Blood Alcohol Content (BAC) Calculator",
    description:
      "Estimate blood alcohol content with the Widmark formula from weight, sex, drinks and hours since drinking, with the time until you are back to zero.",
    keywords: [
      "bac calculator",
      "blood alcohol calculator",
      "blood alcohol content calculator",
      "how drunk am i calculator",
    ],
    isNew: true,
  },
  {
    slug: "pregnancy-weight-gain-calculator",
    category: "health",
    title: "Pregnancy weight gain",
    heading: "Pregnancy Weight Gain Calculator",
    description:
      "See your recommended pregnancy weight gain by pre-pregnancy BMI (IOM guidelines), with a healthy target for your current week.",
    keywords: [
      "pregnancy weight gain calculator",
      "how much weight should i gain during pregnancy",
      "pregnancy weight gain by week",
      "pregnancy bmi weight gain",
    ],
    isNew: true,
  },
  {
    slug: "date-difference-calculator",
    category: "datetime",
    title: "Date difference",
    heading: "Date Difference Calculator",
    description:
      "Count the exact days, weeks, months and years between two dates, or the time until a future date, with business days and the weekday of each date included.",
    keywords: [
      "date difference calculator",
      "days between dates",
      "days until calculator",
      "how many days",
    ],
  },
  {
    slug: "percentage-calculator",
    category: "math",
    title: "Percentage",
    heading: "Percentage Calculator",
    description:
      "Find X% of a number, what percent one number is of another, and the percentage increase or decrease between two values, with the formula shown for each.",
    keywords: [
      "percentage calculator",
      "percent of a number",
      "percentage change calculator",
      "percent difference",
    ],
    popular: true,
  },
  {
    slug: "unit-converter",
    category: "conversions",
    title: "Unit converter",
    heading: "Unit Converter",
    description:
      "Convert length, weight, temperature, volume, area and speed between metric and imperial units instantly, with the conversion factor shown for every pair.",
    keywords: [
      "unit converter",
      "metric to imperial",
      "length converter",
      "weight converter",
    ],
  },
  {
    slug: "currency-converter",
    category: "conversions",
    title: "Currency converter",
    heading: "Currency Converter",
    description:
      "Convert between 30+ world currencies with indicative daily exchange rates, see the rate used and the reverse conversion, and compare amounts side by side.",
    keywords: [
      "currency converter",
      "exchange rate calculator",
      "usd to eur",
      "money converter",
    ],
  },

  // ── Finance (expanded) ─────────────────────────────────────
  {
    slug: "mortgage-refinance-calculator",
    category: "finance",
    title: "Mortgage refinance",
    heading: "Mortgage Refinance Calculator",
    description:
      "See if refinancing pays off: the new monthly payment, monthly savings, the months to break even on closing costs and total interest saved over the loan.",
    keywords: [
      "mortgage refinance calculator",
      "refinance break even",
      "should I refinance",
      "refinance savings calculator",
    ],
    popular: true,
  },
  {
    slug: "retirement-savings-calculator",
    category: "finance",
    title: "Retirement savings",
    heading: "Retirement Savings Calculator",
    description:
      "Project your retirement nest egg from current savings, monthly contributions, expected return and years to retirement, and see the income it could support.",
    keywords: [
      "retirement calculator",
      "retirement savings calculator",
      "how much to retire",
      "retirement nest egg",
    ],
    popular: true,
  },
  {
    slug: "401k-calculator",
    category: "finance",
    title: "401(k)",
    heading: "401(k) Retirement Calculator",
    description:
      "Estimate your 401(k) balance at retirement from salary, contribution rate, employer match and return, and see how much the match adds over the years.",
    keywords: [
      "401k calculator",
      "401k growth calculator",
      "employer match calculator",
      "401k retirement projection",
    ],
  },
  {
    slug: "rmd-calculator",
    category: "finance",
    title: "RMD (required distribution)",
    heading: "RMD Calculator",
    description:
      "Calculate this year's Required Minimum Distribution from your IRA or 401(k) balance and age with the IRS Uniform Lifetime Table, plus deadline and penalty.",
    keywords: [
      "rmd calculator",
      "required minimum distribution calculator",
      "ira rmd calculator",
      "how much is my rmd",
    ],
    isNew: true,
  },
  {
    slug: "roth-ira-calculator",
    category: "finance",
    title: "Roth IRA",
    heading: "Roth IRA Calculator",
    description:
      "Project your tax-free Roth IRA balance at retirement from contributions, return and years, and compare it with a taxable account to see the tax you save.",
    keywords: [
      "roth ira calculator",
      "roth ira growth calculator",
      "tax free retirement calculator",
      "ira calculator",
    ],
    isNew: true,
  },
  {
    slug: "hsa-calculator",
    category: "finance",
    title: "HSA",
    heading: "HSA Calculator",
    description:
      "See your 2026 HSA contribution limit, the federal, state and FICA tax you save each year, and how your health savings account grows when invested.",
    keywords: [
      "hsa calculator",
      "hsa tax savings calculator",
      "hsa contribution limit 2026",
      "health savings account calculator",
      "hsa growth calculator",
    ],
    isNew: true,
  },
  {
    slug: "529-calculator",
    category: "finance",
    title: "529 college savings",
    heading: "529 College Savings Calculator",
    description:
      "Project a 529 college savings plan to your child's first year from balance, monthly deposits and return, and see the share of four-year costs it covers.",
    keywords: [
      "529 calculator",
      "529 college savings calculator",
      "college savings calculator",
      "529 plan calculator",
    ],
    isNew: true,
  },
  {
    slug: "capital-gains-tax-calculator",
    category: "finance",
    title: "Capital gains tax",
    heading: "Capital Gains Tax Calculator",
    description:
      "Estimate federal and state tax on an investment profit from purchase price, sale price, holding period and filing status.",
    keywords: [
      "capital gains tax calculator",
      "long term capital gains calculator",
      "short term capital gains tax",
      "stock sale tax calculator",
    ],
    isNew: true,
  },
  {
    slug: "credit-card-payoff-calculator",
    category: "finance",
    title: "Credit card payoff",
    heading: "Credit Card Payoff Calculator",
    description:
      "Find how many months it takes to clear a credit card at your APR and monthly payment, the total interest, and the payment needed to be debt-free by a date.",
    keywords: [
      "credit card payoff calculator",
      "credit card interest calculator",
      "debt payoff time",
      "minimum payment calculator",
    ],
    popular: true,
  },
  {
    slug: "debt-payoff-calculator",
    category: "finance",
    title: "Debt snowball",
    heading: "Debt Snowball & Avalanche Calculator",
    description:
      "Enter several debts with balances, rates and minimums to compare snowball and avalanche: payoff order, debt-free date and total interest for each method.",
    keywords: [
      "debt snowball calculator",
      "debt avalanche calculator",
      "debt payoff calculator",
      "pay off debt faster",
    ],
  },
  {
    slug: "debt-consolidation-calculator",
    category: "finance",
    title: "Debt consolidation",
    heading: "Debt Consolidation Calculator",
    description:
      "See if rolling your debts into one loan lowers your monthly payment and interest — enter each balance and rate, then a new loan rate and term to compare.",
    keywords: [
      "debt consolidation calculator",
      "consolidate debt calculator",
      "debt consolidation loan calculator",
      "combine debt calculator",
    ],
    popular: true,
    isNew: true,
  },
  {
    slug: "student-loan-calculator",
    category: "finance",
    title: "Student loan",
    heading: "Student Loan Calculator",
    description:
      "Work out your student loan payment, payoff date and total interest — including interest capitalized during school and grace, plus what paying extra saves.",
    keywords: [
      "student loan calculator",
      "student loan payment calculator",
      "student loan payoff calculator",
      "student loan interest calculator",
      "student loan repayment calculator",
    ],
    popular: true,
    isNew: true,
  },
  {
    slug: "roi-calculator",
    category: "finance",
    title: "ROI",
    heading: "Return on Investment (ROI) Calculator",
    description:
      "Calculate return on investment from the amount invested and the amount returned: net profit, ROI percentage and annualized ROI over the holding period.",
    keywords: [
      "roi calculator",
      "return on investment calculator",
      "annualized roi",
      "investment return calculator",
    ],
  },
  {
    slug: "rental-property-calculator",
    category: "finance",
    title: "Rental property ROI",
    heading: "Rental Property Calculator",
    description:
      "Analyze a rental from price, financing, rent and expenses: monthly cash flow, cash-on-cash return, cap rate, NOI and DSCR with your own vacancy rate.",
    keywords: [
      "rental property calculator",
      "cash on cash return calculator",
      "cap rate calculator",
      "dscr calculator",
      "rental property roi calculator",
    ],
    isNew: true,
  },
  {
    slug: "savings-goal-calculator",
    category: "finance",
    title: "Savings goal",
    heading: "Savings Goal Calculator",
    description:
      "Find the monthly deposit needed to reach a savings goal by a target date from your starting balance and interest rate, with a month-by-month plan.",
    keywords: [
      "savings goal calculator",
      "how much to save monthly",
      "savings target calculator",
      "save for a goal",
    ],
  },
  {
    slug: "cd-calculator",
    category: "finance",
    title: "CD",
    heading: "Certificate of Deposit (CD) Calculator",
    description:
      "Calculate the maturity value and APY of a certificate of deposit from your deposit, term length and interest rate — see exactly what it grows to.",
    keywords: [
      "cd calculator",
      "certificate of deposit calculator",
      "cd interest calculator",
      "apy calculator",
    ],
  },
  {
    slug: "simple-interest-calculator",
    category: "finance",
    title: "Simple interest",
    heading: "Simple Interest Calculator",
    description:
      "Calculate simple interest and the total owed or earned from a principal, annual rate and time in years, months or days, with the I = P × r × t formula.",
    keywords: [
      "simple interest calculator",
      "simple interest formula",
      "interest calculator",
      "principal interest calculator",
    ],
  },
  {
    slug: "home-affordability-calculator",
    category: "finance",
    title: "Home affordability",
    heading: "Home Affordability Calculator",
    description:
      "Estimate how much house you can afford from income, monthly debts, down payment, rate and term with the 28/36 rule: maximum price and monthly payment.",
    keywords: [
      "home affordability calculator",
      "how much house can I afford",
      "mortgage affordability",
      "home buying budget",
    ],
  },
  {
    slug: "rent-vs-buy-calculator",
    category: "finance",
    title: "Rent vs buy",
    heading: "Rent vs. Buy Calculator",
    description:
      "Compare the long-run net worth of renting vs buying a home — with the break-even year, using the opportunity-cost (invest-the-difference) method.",
    keywords: [
      "rent vs buy calculator",
      "should I rent or buy",
      "renting vs buying a house",
      "rent or buy break even",
    ],
    popular: true,
    isNew: true,
  },
  {
    slug: "bonus-tax-calculator",
    category: "finance",
    title: "Bonus tax",
    heading: "Bonus Tax Calculator",
    description:
      "See how much of a bonus you take home after US withholding — 22% flat federal, Social Security, Medicare and state — with 2026 IRS Publication 15 rates.",
    keywords: [
      "bonus tax calculator",
      "how are bonuses taxed",
      "bonus withholding 22 percent",
      "bonus take home pay",
    ],
    isNew: true,
  },
  {
    slug: "balance-transfer-calculator",
    category: "finance",
    title: "Balance transfer",
    heading: "Balance Transfer Calculator",
    description:
      "See whether moving a card balance to a 0% promo card saves money after the fee: interest both ways, payoff time and the payment that clears it in time.",
    keywords: [
      "balance transfer calculator",
      "0% balance transfer savings",
      "is a balance transfer worth it",
      "credit card balance transfer fee",
    ],
    isNew: true,
  },
  {
    slug: "mortgage-points-calculator",
    category: "finance",
    title: "Mortgage points",
    heading: "Mortgage Points Calculator",
    description:
      "See whether buying discount points pays off: cost of the points, monthly savings, the break-even month and the net result over the years you keep the loan.",
    keywords: [
      "mortgage points calculator",
      "discount points break even",
      "should I buy points on my mortgage",
      "mortgage buydown calculator",
    ],
    isNew: true,
  },
  {
    slug: "inflation-calculator",
    category: "finance",
    title: "Inflation",
    heading: "Inflation Calculator",
    description:
      "See how inflation changes the buying power of money between two years, or what an amount will be worth at a chosen annual rate over any number of years.",
    keywords: [
      "inflation calculator",
      "buying power calculator",
      "future value of money",
      "inflation rate calculator",
    ],
  },
  {
    slug: "sales-tax-calculator",
    category: "finance",
    title: "Sales tax",
    heading: "Sales Tax Calculator",
    description:
      "Add US sales tax to a price or back it out of a total at any state or local rate: tax amount, pre-tax price and final total, with common state rates.",
    keywords: [
      "sales tax calculator",
      "add sales tax",
      "reverse sales tax calculator",
      "tax total calculator",
    ],
    popular: true,
  },
  {
    slug: "vat-calculator",
    category: "finance",
    title: "VAT",
    heading: "VAT Calculator",
    description:
      "Add or remove VAT at any rate (20%, 5% or your own) to find the net price, VAT amount and gross total, for UK and EU invoices and receipts.",
    keywords: [
      "vat calculator",
      "add vat",
      "remove vat calculator",
      "uk vat calculator",
    ],
  },

  // ── Auto ───────────────────────────────────────────────────
  {
    slug: "auto-loan-calculator",
    category: "auto",
    title: "Auto loan",
    heading: "Auto Loan Calculator",
    description:
      "Calculate your monthly car payment from vehicle price, down payment, trade-in, sales tax, fees, APR and term, with total interest and a payment schedule.",
    keywords: [
      "auto loan calculator",
      "car payment calculator",
      "car loan calculator",
      "monthly car payment",
    ],
    popular: true,
  },
  {
    slug: "car-affordability-calculator",
    category: "auto",
    title: "Car affordability",
    heading: "Car Affordability Calculator",
    description:
      "Find the car price you can afford from a monthly payment budget, down payment, trade-in, APR and loan term, with the total cost of the loan.",
    keywords: [
      "car affordability calculator",
      "how much car can i afford",
      "car budget calculator",
      "affordable car price calculator",
    ],
    isNew: true,
  },
  {
    slug: "auto-lease-calculator",
    category: "auto",
    title: "Auto lease",
    heading: "Car Lease Calculator",
    description:
      "Estimate a monthly car lease payment from negotiated price, residual value, money factor, term and down payment, with the depreciation and finance charge.",
    keywords: [
      "auto lease calculator",
      "car lease calculator",
      "lease payment calculator",
      "money factor calculator",
    ],
  },

  // ── Business ───────────────────────────────────────────────
  {
    slug: "margin-markup-calculator",
    category: "business",
    title: "Margin & markup",
    heading: "Profit Margin & Markup Calculator",
    description:
      "Calculate profit margin, markup percentage and selling price from cost and revenue, or work backwards from a target margin to the price you need to charge.",
    keywords: [
      "margin calculator",
      "markup calculator",
      "profit margin calculator",
      "gross margin calculator",
    ],
  },
  {
    slug: "sales-commission-calculator",
    category: "business",
    title: "Sales commission",
    heading: "Sales Commission Calculator",
    description:
      "Calculate commission earned and total pay from sales revenue and a commission rate, with tiered rates, a base salary and the base-versus-commission split.",
    keywords: [
      "commission calculator",
      "sales commission calculator",
      "how to calculate commission",
      "commission rate calculator",
    ],
    isNew: true,
  },
  {
    slug: "depreciation-calculator",
    category: "business",
    title: "Depreciation",
    heading: "Depreciation Calculator",
    description:
      "Build a year-by-year depreciation schedule using straight-line, declining balance or MACRS — first-year deduction, accumulated depreciation and book value.",
    keywords: [
      "depreciation calculator",
      "macrs depreciation calculator",
      "straight line depreciation calculator",
      "declining balance depreciation",
      "asset depreciation schedule",
    ],
    isNew: true,
  },
  {
    slug: "break-even-calculator",
    category: "business",
    title: "Break-even",
    heading: "Break-Even Point Calculator",
    description:
      "Find how many units you must sell to cover your fixed and variable costs, plus the revenue and contribution margin at your break-even point.",
    keywords: [
      "break even calculator",
      "break even point",
      "break even analysis",
      "break even units calculator",
    ],
  },
  {
    slug: "discount-calculator",
    category: "business",
    title: "Discount",
    heading: "Discount & Sale Price Calculator",
    description:
      "Calculate the sale price and the amount you save after a percentage discount — enter the original price and the percent off to see both.",
    keywords: [
      "discount calculator",
      "percent off calculator",
      "sale price calculator",
      "how much did I save",
    ],
    popular: true,
  },

  // ── Health (expanded) ──────────────────────────────────────
  {
    slug: "body-fat-calculator",
    category: "health",
    title: "Body fat",
    heading: "Body Fat Percentage Calculator",
    description:
      "Estimate body fat percentage with the US Navy tape method from height, neck, waist and hip measurements, with your category and lean body mass.",
    keywords: [
      "body fat calculator",
      "navy body fat calculator",
      "body fat percentage",
      "how to measure body fat",
    ],
  },
  {
    slug: "bmr-calculator",
    category: "health",
    title: "BMR",
    heading: "Basal Metabolic Rate (BMR) Calculator",
    description:
      "Calculate the calories your body burns at rest with the Mifflin-St Jeor equation from age, sex, height and weight, alongside the Harris-Benedict result.",
    keywords: [
      "bmr calculator",
      "basal metabolic rate",
      "resting calories calculator",
      "mifflin st jeor calculator",
    ],
  },
  {
    slug: "ideal-weight-calculator",
    category: "health",
    title: "Ideal weight",
    heading: "Ideal Body Weight Calculator",
    description:
      "Estimate ideal body weight for your height and sex using the Devine, Robinson, Miller and Hamwi formulas, with the healthy BMI range shown alongside.",
    keywords: [
      "ideal weight calculator",
      "ideal body weight",
      "healthy weight calculator",
      "ibw calculator",
    ],
  },
  {
    slug: "macro-calculator",
    category: "health",
    title: "Macros",
    heading: "Macronutrient (Macro) Calculator",
    description:
      "Split your daily calories into protein, carbohydrate and fat targets in grams for weight loss, maintenance or muscle gain, with preset or custom ratios.",
    keywords: [
      "macro calculator",
      "macronutrient calculator",
      "iifym calculator",
      "protein carb fat calculator",
    ],
  },
  {
    slug: "ovulation-calculator",
    category: "health",
    title: "Ovulation",
    heading: "Ovulation & Fertility Calculator",
    description:
      "Find your most fertile days, estimated ovulation date and next period from the first day of your last period and your average cycle length.",
    keywords: [
      "ovulation calculator",
      "fertility calculator",
      "fertile window calculator",
      "ovulation predictor",
    ],
  },
  {
    slug: "due-date-calculator",
    category: "health",
    title: "Due date",
    heading: "Pregnancy Due Date Calculator",
    description:
      "Estimate your baby's due date and current pregnancy week from your last period, conception date or IVF transfer, with trimester dates and key milestones.",
    keywords: [
      "due date calculator",
      "pregnancy due date",
      "baby due date calculator",
      "how many weeks pregnant",
    ],
  },
  {
    slug: "one-rep-max-calculator",
    category: "health",
    title: "One rep max",
    heading: "One Rep Max (1RM) Calculator",
    description:
      "Estimate your one-rep max from a set's weight and reps with the Epley and Brzycki formulas, plus training percentages from 50% to 95% for programming.",
    keywords: [
      "one rep max calculator",
      "1rm calculator",
      "max lift calculator",
      "bench press max calculator",
    ],
  },
  {
    slug: "water-intake-calculator",
    category: "health",
    title: "Water intake",
    heading: "Daily Water Intake Calculator",
    description:
      "Estimate how much water to drink each day from your weight, activity level and climate, in liters, cups and ounces, with the common guidelines explained.",
    keywords: [
      "water intake calculator",
      "how much water should I drink",
      "daily water calculator",
      "hydration calculator",
    ],
  },

  // ── Date & Time (expanded) ─────────────────────────────────
  {
    slug: "age-calculator",
    category: "datetime",
    title: "Age",
    heading: "Age Calculator",
    description:
      "Calculate exact age in years, months and days between a birth date and today or any other date, with total days lived and the weekday you were born.",
    keywords: [
      "age calculator",
      "how old am I",
      "exact age calculator",
      "age in years months days",
    ],
    popular: true,
  },
  {
    slug: "countdown-calculator",
    category: "datetime",
    title: "Days until",
    heading: "Countdown / Days Until Calculator",
    description:
      "Count down the days, weeks and months until any upcoming date or event — or count up the time that has passed since a date in the past.",
    keywords: [
      "days until calculator",
      "countdown calculator",
      "days until date",
      "how many days until",
    ],
  },
  {
    slug: "business-days-calculator",
    category: "datetime",
    title: "Business days",
    heading: "Business Days Calculator",
    description:
      "Count working days between two dates excluding weekends and the US federal holidays you choose, or add business days to a date to find a deadline.",
    keywords: [
      "business days calculator",
      "working days calculator",
      "weekdays between dates",
      "networkdays calculator",
    ],
  },
  {
    slug: "time-duration-calculator",
    category: "datetime",
    title: "Time duration",
    heading: "Time Duration Calculator",
    description:
      "Calculate the hours and minutes between two clock times, across midnight if needed, with a break deducted and the result in decimal hours for timesheets.",
    keywords: [
      "time duration calculator",
      "hours between times",
      "time card calculator",
      "work hours calculator",
    ],
  },

  // ── Math (expanded) ────────────────────────────────────────
  {
    slug: "gpa-calculator",
    category: "math",
    title: "GPA",
    heading: "GPA Calculator",
    description:
      "Calculate your grade point average from your course grades and credit hours on the standard 4.0 scale, with your total quality points.",
    keywords: [
      "gpa calculator",
      "college gpa calculator",
      "weighted gpa calculator",
      "grade point average calculator",
    ],
    popular: true,
  },
  {
    slug: "grade-calculator",
    category: "math",
    title: "Grade",
    heading: "Grade Calculator",
    description:
      "Find your weighted course grade from assignment scores and weights, or the score you need on the final to hit your target.",
    keywords: [
      "grade calculator",
      "weighted grade calculator",
      "final grade calculator",
      "test grade calculator",
      "what do i need on my final",
    ],
    isNew: true,
  },
  {
    slug: "fraction-calculator",
    category: "math",
    title: "Fractions",
    heading: "Fraction Calculator",
    description:
      "Add, subtract, multiply and divide fractions and mixed numbers, with the result simplified to lowest terms, shown as a decimal and worked step by step.",
    keywords: [
      "fraction calculator",
      "adding fractions calculator",
      "simplify fractions",
      "fraction to decimal",
    ],
  },
  {
    slug: "standard-deviation-calculator",
    category: "math",
    title: "Standard deviation",
    heading: "Standard Deviation Calculator",
    description:
      "Calculate the mean, variance and standard deviation of a data set for a sample or a population, with the sum of squares and each step of the formula.",
    keywords: [
      "standard deviation calculator",
      "variance calculator",
      "mean and standard deviation",
      "sd calculator",
    ],
  },
  {
    slug: "roman-numeral-converter",
    category: "math",
    title: "Roman numerals",
    heading: "Roman Numeral Converter",
    description:
      "Convert numbers from 1 to 3,999,999 to Roman numerals and Roman numerals back to numbers, with the symbol-by-symbol breakdown and the rules explained.",
    keywords: [
      "roman numeral converter",
      "roman numerals",
      "number to roman numeral",
      "roman numeral translator",
    ],
  },

  // ── Conversions (expanded) ─────────────────────────────────
  {
    slug: "fuel-economy-converter",
    category: "conversions",
    title: "Fuel economy",
    heading: "MPG to L/100km Converter",
    description:
      "Convert fuel economy between US MPG, UK MPG, km/L and liters per 100 km — compare car efficiency across different measurement systems.",
    keywords: [
      "mpg to l/100km",
      "fuel economy converter",
      "mpg converter",
      "liters per 100km calculator",
    ],
  },
  {
    slug: "cooking-conversion-calculator",
    category: "conversions",
    title: "Cooking converter",
    heading: "Cooking Measurement Converter",
    description:
      "Convert cooking volumes between cups, tablespoons, teaspoons, milliliters, fluid ounces and pints, US and metric, with a table of common amounts.",
    keywords: [
      "cooking measurement converter",
      "cups to ml",
      "tablespoons to cups",
      "recipe converter",
    ],
  },
  {
    slug: "oven-temperature-converter",
    category: "conversions",
    title: "Oven temperature",
    heading: "Oven Temperature Converter",
    description:
      "Convert oven settings between Celsius, Fahrenheit and UK gas marks, with the fan (convection) equivalent and a table of common baking temperatures.",
    keywords: [
      "oven temperature converter",
      "gas mark to celsius",
      "fan oven conversion",
      "350f to celsius oven",
    ],
    isNew: true,
  },

  // ── Home & DIY ─────────────────────────────────────────────
  {
    slug: "paint-calculator",
    category: "homediy",
    title: "Paint",
    heading: "Paint Calculator",
    description:
      "Estimate the gallons or liters of paint for a room from wall dimensions, doors, windows and coats, with the coverage per gallon and a cost estimate.",
    keywords: [
      "paint calculator",
      "how much paint do I need",
      "paint coverage calculator",
      "room paint estimator",
    ],
  },
  {
    slug: "square-footage-calculator",
    category: "homediy",
    title: "Square footage",
    heading: "Square Footage Calculator",
    description:
      "Calculate the area of a room or project in square feet and square meters from its dimensions, for several shapes, with material cost at your unit price.",
    keywords: [
      "square footage calculator",
      "square feet calculator",
      "room area calculator",
      "sq ft calculator",
    ],
  },
  {
    slug: "electricity-cost-calculator",
    category: "homediy",
    title: "Electricity cost",
    heading: "Electricity Cost Calculator",
    description:
      "Work out what an appliance costs to run per day, month and year from its wattage, hours of use and your electricity rate per kWh, with annual kWh used.",
    keywords: [
      "electricity cost calculator",
      "appliance running cost",
      "kwh cost calculator",
      "energy cost calculator",
      "cost to run appliance",
    ],
    isNew: true,
  },
  {
    slug: "solar-panel-calculator",
    category: "homediy",
    title: "Solar panel",
    heading: "Solar Panel Calculator",
    description:
      "Estimate how many solar panels you need, the system size and cost, and the payback period — worked back from your power bill, with the 30% tax credit.",
    keywords: [
      "solar panel calculator",
      "how many solar panels do i need",
      "solar system size calculator",
      "solar payback calculator",
    ],
    isNew: true,
  },
  {
    slug: "stair-calculator",
    category: "homediy",
    title: "Stair",
    heading: "Stair Calculator",
    description:
      "Turn your floor-to-floor rise into a buildable staircase — number of steps, riser height, total run and stringer length, with code checks.",
    keywords: [
      "stair calculator",
      "stair stringer calculator",
      "how many stairs do i need",
      "riser and tread calculator",
    ],
    isNew: true,
  },
  {
    slug: "drywall-calculator",
    category: "homediy",
    title: "Drywall",
    heading: "Drywall Calculator",
    description:
      "Estimate how many drywall sheets you need for a room's walls and ceiling, plus joint compound, tape, screws and cost — with waste included.",
    keywords: [
      "drywall calculator",
      "how many sheets of drywall do i need",
      "sheetrock calculator",
      "drywall estimator",
    ],
    isNew: true,
  },
  {
    slug: "insulation-calculator",
    category: "homediy",
    title: "Insulation",
    heading: "Insulation Calculator",
    description:
      "Work out how much insulation you need — R-value to add, layer thickness, number of rolls, batts or bags, and the material cost, with waste included.",
    keywords: [
      "insulation calculator",
      "r value calculator",
      "how much insulation do i need",
      "attic insulation calculator",
      "blown in insulation calculator",
    ],
    isNew: true,
  },

  // ── Batch 2: more high-demand calculators ──────────────────
  {
    slug: "income-tax-calculator",
    category: "finance",
    title: "Income tax",
    heading: "Income Tax Calculator (US Federal)",
    description:
      "Estimate 2026 US federal income tax from income and filing status with the standard deduction and IRS brackets: tax owed, effective rate and take-home pay.",
    keywords: [
      "income tax calculator",
      "federal tax calculator",
      "tax bracket calculator",
      "how much tax will I pay",
    ],
    popular: true,
  },
  {
    slug: "self-employment-tax-calculator",
    category: "finance",
    title: "Self-employment tax",
    heading: "Self-Employment Tax Calculator",
    description:
      "Work out your US self-employment (SECA) tax from net profit — the Social Security and Medicare split, the deductible half and your effective rate.",
    keywords: [
      "self employment tax calculator",
      "seca tax calculator",
      "fica self employed calculator",
      "1099 tax calculator",
    ],
    isNew: true,
  },
  {
    slug: "paycheck-calculator",
    category: "finance",
    title: "Paycheck",
    heading: "Paycheck Calculator",
    description:
      "Estimate take-home pay per paycheck from gross pay, pay frequency, federal and state tax rate, FICA and pre-tax 401(k) deductions, with a full breakdown.",
    keywords: [
      "paycheck calculator",
      "take home pay calculator",
      "net pay calculator",
      "salary after tax",
    ],
  },
  {
    slug: "net-worth-calculator",
    category: "finance",
    title: "Net worth",
    heading: "Net Worth Calculator",
    description:
      "Add up your assets and liabilities to see your total net worth, and understand your financial position at a glance with a clear breakdown.",
    keywords: [
      "net worth calculator",
      "assets and liabilities",
      "personal net worth",
      "how to calculate net worth",
    ],
  },
  {
    slug: "life-insurance-calculator",
    category: "finance",
    title: "Life insurance needs",
    heading: "Life Insurance Needs Calculator",
    description:
      "Estimate how much life insurance your family needs with the DIME method: income, debts, mortgage and education, minus savings and existing cover.",
    keywords: [
      "life insurance calculator",
      "how much life insurance do i need",
      "life insurance needs calculator",
      "dime method life insurance",
    ],
    isNew: true,
  },
  {
    slug: "pace-calculator",
    category: "health",
    title: "Running pace",
    heading: "Running Pace Calculator",
    description:
      "Work out running pace per mile or kilometer, speed and finish time from any two of distance, time and pace, with splits for 5K, 10K, half and marathon.",
    keywords: [
      "pace calculator",
      "running pace calculator",
      "pace per mile",
      "marathon pace calculator",
    ],
    popular: true,
  },
  {
    slug: "calories-burned-calculator",
    category: "health",
    title: "Calories burned",
    heading: "Calories Burned Calculator",
    description:
      "Estimate calories burned during exercise from the activity, your weight and the duration, using MET values for 50+ activities from walking to swimming.",
    keywords: [
      "calories burned calculator",
      "calories burned walking",
      "exercise calorie calculator",
      "met calculator",
    ],
  },
  {
    slug: "add-days-calculator",
    category: "datetime",
    title: "Add / subtract days",
    heading: "Add or Subtract Days Calculator",
    description:
      "Add or subtract days, weeks, months or years from any date to find the new date, with the weekday, business-day option and the number of days between.",
    keywords: [
      "add days to date",
      "date calculator add days",
      "subtract days from date",
      "days from today calculator",
    ],
  },
  {
    slug: "ratio-calculator",
    category: "math",
    title: "Ratio",
    heading: "Ratio Calculator",
    description:
      "Simplify a ratio to its lowest terms or solve a proportion for the missing value, with the equivalent decimal and percentage shown too.",
    keywords: [
      "ratio calculator",
      "simplify ratio",
      "proportion calculator",
      "ratio simplifier",
    ],
  },
  {
    slug: "average-calculator",
    category: "math",
    title: "Average (mean)",
    heading: "Average Calculator",
    description:
      "Find the mean, median, mode, range and sum of any set of numbers at once — just paste your values and get every average instantly.",
    keywords: [
      "average calculator",
      "mean calculator",
      "median mode calculator",
      "how to find the average",
    ],
    popular: true,
  },
  {
    slug: "unit-price-calculator",
    category: "math",
    title: "Unit price",
    heading: "Unit Price Calculator",
    description:
      "Compare products by price per unit (ounce, pound, liter, count) to see which is the better deal and how much you save per unit and per purchase.",
    keywords: [
      "unit price calculator",
      "price per unit calculator",
      "cost per unit calculator",
      "which is cheaper calculator",
      "compare prices per unit",
    ],
    isNew: true,
  },
  {
    slug: "temperature-converter",
    category: "conversions",
    title: "Temperature",
    heading: "Temperature Converter",
    description:
      "Convert temperatures between Celsius, Fahrenheit and Kelvin instantly, with the formulas and a table of common temperatures for each scale.",
    keywords: [
      "temperature converter",
      "celsius to fahrenheit",
      "fahrenheit to celsius",
      "c to f converter",
    ],
    popular: true,
  },
  {
    slug: "speed-converter",
    category: "conversions",
    title: "Speed",
    heading: "Speed Converter",
    description:
      "Convert speed between mph, km/h, m/s, knots and feet per second instantly, with a clear table of common values for each unit.",
    keywords: [
      "speed converter",
      "mph to kmh",
      "kmh to mph",
      "m/s to mph",
    ],
  },
  {
    slug: "data-storage-converter",
    category: "conversions",
    title: "Data storage",
    heading: "Data Storage Converter",
    description:
      "Convert digital storage between bytes, KB, MB, GB, TB and PB, using both decimal (1000) and binary (1024) values, instantly and for free.",
    keywords: [
      "data storage converter",
      "mb to gb",
      "gb to tb",
      "bytes converter",
    ],
  },
  {
    slug: "fuel-cost-calculator",
    category: "auto",
    title: "Fuel / trip cost",
    heading: "Fuel Cost Calculator",
    description:
      "Estimate the fuel needed and total cost of a trip from distance, your car's MPG or L/100km and the fuel price, with round-trip and cost-per-person options.",
    keywords: [
      "fuel cost calculator",
      "gas cost calculator",
      "trip cost calculator",
      "cost of driving calculator",
    ],
    popular: true,
  },

  // ── Batch 3: growth calculators ────────────────────────────
  {
    slug: "height-converter",
    category: "conversions",
    title: "Height",
    heading: "Height Converter",
    description:
      "Convert height between centimeters, meters, and feet and inches — perfect for forms, fitness and comparing metric and imperial heights.",
    keywords: [
      "height converter",
      "cm to feet",
      "feet to cm",
      "cm to inches",
    ],
    popular: true,
  },
  {
    slug: "weight-converter",
    category: "conversions",
    title: "Weight",
    heading: "Weight Converter",
    description:
      "Convert weight between kilograms, pounds, stones, ounces and grams instantly, with a reference table of common conversions for each unit.",
    keywords: [
      "weight converter",
      "kg to lbs",
      "lbs to kg",
      "pounds to kg",
    ],
    popular: true,
  },
  {
    slug: "number-base-converter",
    category: "conversions",
    title: "Number base",
    heading: "Number Base Converter",
    description:
      "Convert numbers between binary, octal, decimal and hexadecimal, and see each value side by side — a handy free tool for programming and CS homework.",
    keywords: [
      "number base converter",
      "binary to decimal",
      "decimal to hex",
      "hex to binary",
    ],
  },
  {
    slug: "pythagorean-theorem-calculator",
    category: "math",
    title: "Pythagorean theorem",
    heading: "Pythagorean Theorem Calculator",
    description:
      "Find the hypotenuse or a missing leg of a right triangle with a² + b² = c², with the area, perimeter and angles of the triangle and each step shown.",
    keywords: [
      "pythagorean theorem calculator",
      "hypotenuse calculator",
      "right triangle calculator",
      "a squared plus b squared",
    ],
  },
  {
    slug: "distance-between-two-points-calculator",
    category: "math",
    title: "Distance between two points",
    heading: "Distance Between Two Points Calculator",
    description:
      "Find the distance, midpoint and slope between two points on a coordinate plane from their x and y coordinates, with the distance formula worked out.",
    keywords: [
      "distance between two points",
      "distance formula calculator",
      "midpoint calculator",
      "slope between two points",
      "coordinate distance calculator",
    ],
    isNew: true,
  },
  {
    slug: "quadratic-equation-calculator",
    category: "math",
    title: "Quadratic equation",
    heading: "Quadratic Equation Solver",
    description:
      "Solve any quadratic equation ax² + bx + c = 0 for real or complex roots, with the discriminant and the step-by-step quadratic formula.",
    keywords: [
      "quadratic equation calculator",
      "quadratic formula solver",
      "roots of quadratic",
      "discriminant calculator",
    ],
  },
  {
    slug: "lcm-gcd-calculator",
    category: "math",
    title: "LCM & GCD",
    heading: "LCM and GCD Calculator",
    description:
      "Find the least common multiple and greatest common divisor of two or more numbers, with the prime factorization and Euclidean steps that produce them.",
    keywords: [
      "lcm calculator",
      "gcd calculator",
      "least common multiple",
      "greatest common divisor",
    ],
  },
  {
    slug: "sleep-calculator",
    category: "health",
    title: "Sleep / bedtime",
    heading: "Sleep Calculator",
    description:
      "Find the best bedtime or wake-up time based on 90-minute sleep cycles, so you wake at the end of a cycle feeling refreshed instead of groggy.",
    keywords: [
      "sleep calculator",
      "bedtime calculator",
      "sleep cycle calculator",
      "what time to wake up",
    ],
    popular: true,
  },
  {
    slug: "target-heart-rate-calculator",
    category: "health",
    title: "Target heart rate",
    heading: "Target Heart Rate Calculator",
    description:
      "Work out your target heart-rate training zones (warm-up, fat-burn, aerobic, peak) from age and resting heart rate with the max-HR and Karvonen methods.",
    keywords: [
      "target heart rate calculator",
      "heart rate zones",
      "max heart rate",
      "karvonen formula",
    ],
  },
  {
    slug: "dti-calculator",
    category: "finance",
    title: "Debt-to-income",
    heading: "Debt-to-Income (DTI) Calculator",
    description:
      "Calculate your debt-to-income ratio from monthly debt payments and gross income, with front-end and back-end DTI and how they compare with lender limits.",
    keywords: [
      "debt to income calculator",
      "dti calculator",
      "dti ratio",
      "debt to income ratio",
    ],
  },
  {
    slug: "down-payment-calculator",
    category: "finance",
    title: "Down payment",
    heading: "Down Payment Calculator",
    description:
      "Work out your down payment and loan amount from a home price and percentage, see the LTV, whether PMI applies and how 5%, 10% and 20% change the payment.",
    keywords: [
      "down payment calculator",
      "how much down payment",
      "20 percent down",
      "mortgage down payment",
    ],
  },
  {
    slug: "ltv-calculator",
    category: "finance",
    title: "Loan-to-value (LTV)",
    heading: "Loan-to-Value (LTV) Calculator",
    description:
      "Calculate your loan-to-value ratio from a property value and down payment or loan balance, see if PMI applies above 80% and the equity you hold.",
    keywords: [
      "ltv calculator",
      "loan to value calculator",
      "loan to value ratio",
      "ltv ratio calculator",
    ],
    isNew: true,
  },
  {
    slug: "budget-calculator",
    category: "finance",
    title: "50/30/20 budget",
    heading: "Budget Calculator (50/30/20)",
    description:
      "Split your monthly after-tax income into needs, wants and savings with the 50/30/20 rule, or set your own percentages, and see the dollar amount for each.",
    keywords: [
      "budget calculator",
      "50 30 20 budget",
      "monthly budget calculator",
      "budget planner",
    ],
    popular: true,
  },
  {
    slug: "concrete-calculator",
    category: "homediy",
    title: "Concrete",
    heading: "Concrete Calculator",
    description:
      "Estimate the concrete for a slab, footing or column in cubic yards, cubic feet and 60 or 80 lb bags from its dimensions, with waste and cost included.",
    keywords: [
      "concrete calculator",
      "concrete yardage calculator",
      "how much concrete do I need",
      "concrete bags calculator",
    ],
  },

  // ── Batch 4: growth (marked new) ───────────────────────────
  {
    slug: "apr-calculator",
    category: "finance",
    title: "APR",
    heading: "APR Calculator",
    description:
      "Find the true APR of a loan once origination and other fees are included: enter the amount, note rate, term and fees to compare offers on the same basis.",
    keywords: ["apr calculator", "annual percentage rate", "loan apr", "true cost of a loan", "monthly interest rate to apr", "apr vs apy", "apr from monthly payment"],
    isNew: true,
  },
  {
    slug: "emergency-fund-calculator",
    category: "finance",
    title: "Emergency fund",
    heading: "Emergency Fund Calculator",
    description:
      "Work out how much to save for an emergency fund from your essential monthly expenses and the months of cover you want, with a monthly plan to reach it.",
    keywords: ["emergency fund calculator", "how much emergency fund", "rainy day fund", "months of expenses"],
    isNew: true,
  },
  {
    slug: "rent-affordability-calculator",
    category: "finance",
    title: "Rent affordability",
    heading: "Rent Affordability Calculator",
    description:
      "See how much rent you can afford based on your income and the 30% rule, with a comfortable monthly range so you don't overstretch your budget.",
    keywords: ["rent affordability calculator", "how much rent can I afford", "30 percent rule rent", "rent budget"],
    isNew: true,
  },
  {
    slug: "overtime-pay-calculator",
    category: "finance",
    title: "Overtime pay",
    heading: "Overtime Pay Calculator",
    description:
      "Calculate overtime pay and total weekly earnings from your hourly rate, regular hours and overtime hours at time-and-a-half, double time or a custom rate.",
    keywords: ["overtime pay calculator", "time and a half calculator", "overtime rate", "weekly pay with overtime"],
    isNew: true,
  },
  {
    slug: "timesheet-calculator",
    category: "finance",
    title: "Timesheet",
    heading: "Timesheet Calculator",
    description:
      "Add up weekly work hours from clock-in and clock-out times with breaks deducted, split regular and overtime hours, and see gross pay at your hourly rate.",
    keywords: [
      "timesheet calculator",
      "work hours calculator",
      "time card calculator",
      "hours and minutes calculator",
      "weekly hours calculator",
    ],
    isNew: true,
  },
  {
    slug: "length-converter",
    category: "conversions",
    title: "Length",
    heading: "Length Converter",
    description:
      "Convert length between meters, feet, miles, inches, kilometers, yards and centimeters instantly, with a table of common conversions.",
    keywords: ["length converter", "meters to feet", "miles to km", "inches to cm"],
    isNew: true,
  },
  {
    slug: "volume-converter",
    category: "conversions",
    title: "Volume",
    heading: "Volume Converter",
    description:
      "Convert volume between liters, milliliters, US and UK gallons, quarts, pints, cups and fluid ounces instantly, with a table of common conversions.",
    keywords: ["volume converter", "liters to gallons", "ml to oz", "gallons to liters"],
    isNew: true,
  },
  {
    slug: "area-converter",
    category: "conversions",
    title: "Area",
    heading: "Area Converter",
    description:
      "Convert area between square feet, square meters, square yards, acres, hectares and square miles instantly, with the factor and a table of common values.",
    keywords: ["area converter", "square feet to square meters", "acres to hectares", "sq m to sq ft"],
    isNew: true,
  },
  {
    slug: "scientific-notation-calculator",
    category: "math",
    title: "Scientific notation",
    heading: "Scientific Notation Converter",
    description:
      "Convert numbers to and from scientific notation and E notation, see the expanded standard form and significant figures, with the steps explained.",
    keywords: ["scientific notation calculator", "standard form converter", "e notation", "convert to scientific notation"],
    isNew: true,
  },
  {
    slug: "permutations-combinations-calculator",
    category: "math",
    title: "Permutations & combinations",
    heading: "Permutations and Combinations Calculator",
    description:
      "Calculate permutations (nPr), combinations (nCr) and factorials for any n and r, with the formulas and exact results — ideal for probability and stats.",
    keywords: ["permutations calculator", "combinations calculator", "nCr nPr calculator", "factorial calculator"],
    isNew: true,
  },
  {
    slug: "set-partitions-calculator",
    category: "math",
    title: "Set partitions",
    heading: "Set Partitions & Stirling Numbers Calculator",
    description:
      "Count the ways to partition n objects into k groups (Stirling numbers of the second kind) and into any number of groups (Bell number).",
    keywords: [
      "set partition calculator",
      "stirling numbers calculator",
      "ways to partition n objects into k groups",
      "bell number calculator",
      "S(n,k) calculator",
    ],
    isNew: true,
  },
  {
    slug: "prime-factorization-calculator",
    category: "math",
    title: "Prime factorization",
    heading: "Prime Factorization Calculator",
    description:
      "Break any number into its prime factors, list all its divisors and check whether it is prime, with the factor tree and exponent form shown.",
    keywords: [
      "prime factorization calculator",
      "factors of a number",
      "prime factors calculator",
      "divisors calculator",
      "is this number prime",
    ],
    isNew: true,
  },
  {
    slug: "number-to-words-calculator",
    category: "math",
    title: "Number to words",
    heading: "Number to Words Converter",
    description:
      "Write any number in words, including decimals and negatives, plus a cheque-style dollars-and-cents amount, in US or UK spelling.",
    keywords: [
      "number to words",
      "number to words converter",
      "spell a number",
      "amount in words",
      "write number in words",
    ],
    isNew: true,
  },
  {
    slug: "tile-calculator",
    category: "homediy",
    title: "Tile",
    heading: "Tile Calculator",
    description:
      "Estimate how many tiles and boxes you need for a floor or wall from the area, tile size, grout gap and waste, with the total cost at your price per box.",
    keywords: ["tile calculator", "how many tiles do I need", "tile flooring calculator", "square footage tiles"],
    isNew: true,
  },
  {
    slug: "gravel-calculator",
    category: "homediy",
    title: "Gravel / mulch",
    heading: "Gravel & Mulch Calculator",
    description:
      "Estimate the gravel, mulch, sand or soil you need for a project in cubic yards, cubic feet and tons — from the area and depth you enter.",
    keywords: ["gravel calculator", "mulch calculator", "how much gravel do I need", "cubic yards calculator"],
    isNew: true,
  },
  {
    slug: "btu-calculator",
    category: "homediy",
    title: "BTU (AC size)",
    heading: "BTU Calculator (Room Size)",
    description:
      "Estimate the BTUs needed to cool or heat a room from its square footage, adjusted for sunlight, occupancy and climate, to size an AC or heater.",
    keywords: ["btu calculator", "ac size calculator", "how many btu do I need", "air conditioner size"],
    isNew: true,
  },
  {
    slug: "flooring-calculator",
    category: "homediy",
    title: "Flooring",
    heading: "Flooring Calculator",
    description:
      "Work out the flooring area and number of boxes or planks you need from room dimensions, box coverage and waste, with the total material cost.",
    keywords: ["flooring calculator", "how much flooring do I need", "laminate flooring calculator", "square footage flooring"],
    isNew: true,
  },
  {
    slug: "roofing-calculator",
    category: "homediy",
    title: "Roofing / shingles",
    heading: "Roofing Calculator (Shingles & Squares)",
    description:
      "Estimate your roof's surface area from its footprint and pitch, then the roofing squares, shingle bundles, underlayment and cost you need — waste included.",
    keywords: ["roofing calculator", "roof shingle calculator", "how many bundles of shingles do I need", "roof square footage calculator", "roof pitch calculator"],
    isNew: true,
  },
  {
    slug: "deck-calculator",
    category: "homediy",
    title: "Deck boards",
    heading: "Deck Calculator (Boards, Joists & Screws)",
    description:
      "Work out how many deck boards, joists and screws you need for your deck size, board width and joist spacing — waste and cost included.",
    keywords: ["deck calculator", "deck board calculator", "how many deck boards do I need", "decking calculator", "deck joist calculator"],
    isNew: true,
  },
  {
    slug: "mileage-reimbursement-calculator",
    category: "auto",
    title: "Mileage reimbursement",
    heading: "Mileage Reimbursement Calculator",
    description:
      "Calculate mileage reimbursement from the miles you drove and the rate per mile, using the IRS standard rate or your own custom cents-per-mile rate.",
    keywords: ["mileage reimbursement calculator", "irs mileage rate", "business mileage calculator", "cents per mile"],
    isNew: true,
  },
  {
    slug: "lease-vs-buy-calculator",
    category: "auto",
    title: "Lease vs buy",
    heading: "Lease vs Buy Car Calculator",
    description:
      "Compare the total cost of leasing versus buying a car over the same years: payments, down payment, fees, resale value and interest, side by side.",
    keywords: ["lease vs buy calculator", "should I lease or buy", "car lease vs buy", "lease or finance"],
    isNew: true,
  },
];

// ── Lookups ──────────────────────────────────────────────────────
const bySlug = new Map(calculators.map((c) => [c.slug, c]));

export function getCalc(slug: string): CalcDef | undefined {
  return bySlug.get(slug);
}

export function getCategory(id: CategoryId): CategoryDef {
  return categories.find((c) => c.id === id)!;
}

export function calcsInCategory(id: CategoryId): CalcDef[] {
  return calculators.filter((c) => c.category === id);
}

export function relatedCalcs(slug: string, limit = 4): CalcDef[] {
  const self = getCalc(slug);
  if (!self) return calculators.slice(0, limit);
  // Prefer siblings in the same sub-intent cluster (e.g. a mortgage page links
  // to other mortgage/home calcs, not to unrelated finance tools) — tighter,
  // more relevant internal links that help discovery and topical grouping.
  const cluster = clusterOfSlug(slug);
  const clusterSiblings = (cluster?.slugs ?? [])
    .filter((s) => s !== slug)
    .map((s) => getCalc(s))
    .filter((c): c is CalcDef => Boolean(c));
  const inCluster = new Set(clusterSiblings.map((c) => c.slug));
  const sameCat = calculators.filter(
    (c) => c.category === self.category && c.slug !== slug && !inCluster.has(c.slug),
  );
  const rest = calculators.filter(
    (c) => c.category !== self.category && c.slug !== slug,
  );
  return [...clusterSiblings, ...sameCat, ...rest].slice(0, limit);
}
