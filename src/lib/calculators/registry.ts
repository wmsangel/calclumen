// Central catalog of every calculator. Pages, home hub, sitemap, and
// internal linking all read from here so a new calculator is one entry away.

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
    title: "Loan & mortgage",
    heading: "Loan & Mortgage Payment Calculator",
    description:
      "Work out the monthly payment, total interest and total cost of any loan or mortgage.",
    keywords: [
      "loan calculator",
      "mortgage calculator",
      "monthly payment calculator",
      "amortization",
    ],
    popular: true,
  },
  {
    slug: "compound-interest-calculator",
    category: "finance",
    title: "Compound interest",
    heading: "Compound Interest Calculator",
    description:
      "See how savings or investments grow over time with compound interest and regular contributions.",
    keywords: [
      "compound interest calculator",
      "investment growth calculator",
      "savings calculator",
    ],
    popular: true,
  },
  {
    slug: "salary-to-hourly-calculator",
    category: "finance",
    title: "Salary to hourly",
    heading: "Salary to Hourly Calculator",
    description:
      "Convert an annual salary to an hourly, weekly or monthly rate — and back again.",
    keywords: [
      "salary to hourly",
      "hourly to salary",
      "annual salary calculator",
      "pay rate calculator",
    ],
  },
  {
    slug: "tip-calculator",
    category: "finance",
    title: "Tip & split",
    heading: "Tip Calculator & Bill Splitter",
    description:
      "Calculate the tip and split the bill evenly between any number of people.",
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
      "Calculate your Body Mass Index in metric or imperial units and see your weight category.",
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
      "Estimate your daily calorie needs (BMR and TDEE) for maintaining, losing or gaining weight.",
    keywords: [
      "calorie calculator",
      "tdee calculator",
      "bmr calculator",
      "maintenance calories",
    ],
  },
  {
    slug: "date-difference-calculator",
    category: "datetime",
    title: "Date difference",
    heading: "Date Difference Calculator",
    description:
      "Count the days, weeks and months between two dates — or how long until a future date.",
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
      "Find a percentage of a number, percentage change, and what percent one number is of another.",
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
      "Convert length, weight, temperature and volume between metric and imperial units.",
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
      "Convert between world currencies with a simple, fast exchange-rate calculator.",
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
      "See if refinancing saves money and how fast you break even on closing costs.",
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
      "Project your retirement nest egg from savings, monthly contributions and returns.",
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
      "Estimate your 401(k) balance at retirement including employer matching and growth.",
    keywords: [
      "401k calculator",
      "401k growth calculator",
      "employer match calculator",
      "401k retirement projection",
    ],
  },
  {
    slug: "credit-card-payoff-calculator",
    category: "finance",
    title: "Credit card payoff",
    heading: "Credit Card Payoff Calculator",
    description:
      "Find how long it takes to clear credit card debt and the total interest you'll pay.",
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
      "Compare snowball and avalanche strategies to pay off multiple debts faster.",
    keywords: [
      "debt snowball calculator",
      "debt avalanche calculator",
      "debt payoff calculator",
      "pay off debt faster",
    ],
  },
  {
    slug: "roi-calculator",
    category: "finance",
    title: "ROI",
    heading: "Return on Investment (ROI) Calculator",
    description:
      "Calculate return on investment, net profit and annualized ROI for any investment.",
    keywords: [
      "roi calculator",
      "return on investment calculator",
      "annualized roi",
      "investment return calculator",
    ],
  },
  {
    slug: "savings-goal-calculator",
    category: "finance",
    title: "Savings goal",
    heading: "Savings Goal Calculator",
    description:
      "Find the monthly deposit needed to reach a savings goal by your target date.",
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
      "Calculate the maturity value and APY of a certificate of deposit.",
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
      "Calculate simple interest and the total owed or earned on a principal over time.",
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
      "Estimate how much house you can afford from income, debts and down payment.",
    keywords: [
      "home affordability calculator",
      "how much house can I afford",
      "mortgage affordability",
      "home buying budget",
    ],
  },
  {
    slug: "inflation-calculator",
    category: "finance",
    title: "Inflation",
    heading: "Inflation Calculator",
    description:
      "See how inflation changes the buying power of money over a number of years.",
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
      "Add or remove US sales tax from a price and see the tax amount and total.",
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
      "Add or remove VAT at any rate to find net price, VAT amount and gross total.",
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
      "Calculate your monthly car payment including taxes, fees, trade-in and down payment.",
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
      "Find the car price you can afford from a monthly payment budget, down payment, trade-in, APR and loan term.",
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
      "Estimate your monthly car lease payment from price, residual value and money factor.",
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
      "Calculate profit margin, markup percentage and selling price from cost and revenue.",
    keywords: [
      "margin calculator",
      "markup calculator",
      "profit margin calculator",
      "gross margin calculator",
    ],
  },
  {
    slug: "break-even-calculator",
    category: "business",
    title: "Break-even",
    heading: "Break-Even Point Calculator",
    description:
      "Find how many units you must sell to cover fixed and variable costs.",
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
      "Calculate the sale price and amount saved after a percentage discount.",
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
      "Estimate your body fat percentage using the US Navy tape-measurement method.",
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
      "Calculate the calories your body burns at rest using the Mifflin-St Jeor equation.",
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
      "Estimate your ideal body weight using the Devine, Robinson, Miller and Hamwi formulas.",
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
      "Split your daily calories into protein, carb and fat targets for your goal.",
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
      "Find your most fertile days and next period from your last cycle and length.",
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
      "Estimate your baby's due date and current pregnancy week from your last period.",
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
      "Estimate your one-rep max and training percentages from a set's weight and reps.",
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
      "Estimate how much water you should drink each day based on weight and activity.",
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
      "Calculate exact age in years, months and days between a birth date and any date.",
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
      "Count down the days, weeks and months until any upcoming date or event.",
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
      "Count working days between two dates, excluding weekends and chosen holidays.",
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
      "Calculate the hours and minutes between two times, ideal for timesheets and shifts.",
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
      "Calculate your grade point average from course grades and credit hours.",
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
      "Add, subtract, multiply and divide fractions with simplified results and decimals.",
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
      "Calculate mean, variance and standard deviation for a data set (sample or population).",
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
      "Convert numbers to Roman numerals and Roman numerals back to numbers instantly.",
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
      "Convert fuel economy between US MPG, UK MPG, km/L and liters per 100 km.",
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
      "Convert cooking volumes between cups, tablespoons, teaspoons, milliliters and ounces.",
    keywords: [
      "cooking measurement converter",
      "cups to ml",
      "tablespoons to cups",
      "recipe converter",
    ],
  },

  // ── Home & DIY ─────────────────────────────────────────────
  {
    slug: "paint-calculator",
    category: "homediy",
    title: "Paint",
    heading: "Paint Calculator",
    description:
      "Estimate how many gallons of paint you need for a room based on wall area.",
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
      "Calculate area in square feet for rooms and projects, plus total material cost.",
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
      "Work out what any appliance costs to run — per day, month and year — from its wattage and your electricity rate.",
    keywords: [
      "electricity cost calculator",
      "appliance running cost",
      "kwh cost calculator",
      "energy cost calculator",
      "cost to run appliance",
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
      "Estimate your US federal income tax, effective rate and take-home pay by filing status.",
    keywords: [
      "income tax calculator",
      "federal tax calculator",
      "tax bracket calculator",
      "how much tax will I pay",
    ],
    popular: true,
  },
  {
    slug: "paycheck-calculator",
    category: "finance",
    title: "Paycheck",
    heading: "Paycheck Calculator",
    description:
      "Estimate your take-home pay per paycheck after taxes, FICA and retirement contributions.",
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
      "Add up your assets and liabilities to see your total net worth.",
    keywords: [
      "net worth calculator",
      "assets and liabilities",
      "personal net worth",
      "how to calculate net worth",
    ],
  },
  {
    slug: "pace-calculator",
    category: "health",
    title: "Running pace",
    heading: "Running Pace Calculator",
    description:
      "Work out your running pace, speed and finish time from distance and time.",
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
      "Estimate calories burned during exercise from activity, weight and duration.",
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
      "Add or subtract days, weeks, months or years from any date to find the new date.",
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
      "Simplify a ratio or solve a proportion, with the decimal and percentage.",
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
      "Find the mean, median, mode, range and sum of a set of numbers.",
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
      "Compare products by price per unit and see which one is the better deal, plus how much you save.",
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
      "Convert temperatures between Celsius, Fahrenheit and Kelvin instantly.",
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
      "Convert speed between mph, km/h, m/s, knots and feet per second.",
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
      "Convert digital storage between bytes, KB, MB, GB, TB and more.",
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
      "Estimate the fuel needed and total cost of a trip from distance, efficiency and price.",
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
      "Convert height between centimeters, meters and feet and inches.",
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
      "Convert weight between kilograms, pounds, stones, ounces and grams.",
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
      "Convert numbers between binary, octal, decimal and hexadecimal.",
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
      "Find the hypotenuse or a missing leg of a right triangle with a² + b² = c².",
    keywords: [
      "pythagorean theorem calculator",
      "hypotenuse calculator",
      "right triangle calculator",
      "a squared plus b squared",
    ],
  },
  {
    slug: "quadratic-equation-calculator",
    category: "math",
    title: "Quadratic equation",
    heading: "Quadratic Equation Solver",
    description:
      "Solve ax² + bx + c = 0 for real or complex roots, with the discriminant.",
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
      "Find the least common multiple and greatest common divisor of two or more numbers.",
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
      "Find the best bedtime or wake-up time based on 90-minute sleep cycles.",
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
      "Find your training heart-rate zones from your age and resting heart rate.",
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
      "Calculate your debt-to-income ratio to see how lenders view your finances.",
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
      "Work out your down payment amount and loan amount from a home price and percentage.",
    keywords: [
      "down payment calculator",
      "how much down payment",
      "20 percent down",
      "mortgage down payment",
    ],
  },
  {
    slug: "budget-calculator",
    category: "finance",
    title: "50/30/20 budget",
    heading: "Budget Calculator (50/30/20)",
    description:
      "Split your monthly income into needs, wants and savings with the 50/30/20 rule.",
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
      "Estimate the concrete you need for a slab in cubic yards, cubic feet and bags.",
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
      "Find the true annual percentage rate of a loan including fees, not just the interest rate.",
    keywords: ["apr calculator", "annual percentage rate", "loan apr", "true cost of a loan"],
    isNew: true,
  },
  {
    slug: "emergency-fund-calculator",
    category: "finance",
    title: "Emergency fund",
    heading: "Emergency Fund Calculator",
    description:
      "Work out how much to save for an emergency fund based on your monthly expenses.",
    keywords: ["emergency fund calculator", "how much emergency fund", "rainy day fund", "months of expenses"],
    isNew: true,
  },
  {
    slug: "rent-affordability-calculator",
    category: "finance",
    title: "Rent affordability",
    heading: "Rent Affordability Calculator",
    description:
      "See how much rent you can afford based on your income and the 30% rule.",
    keywords: ["rent affordability calculator", "how much rent can I afford", "30 percent rule rent", "rent budget"],
    isNew: true,
  },
  {
    slug: "overtime-pay-calculator",
    category: "finance",
    title: "Overtime pay",
    heading: "Overtime Pay Calculator",
    description:
      "Calculate your overtime pay and total weekly earnings from your hourly rate.",
    keywords: ["overtime pay calculator", "time and a half calculator", "overtime rate", "weekly pay with overtime"],
    isNew: true,
  },
  {
    slug: "length-converter",
    category: "conversions",
    title: "Length",
    heading: "Length Converter",
    description:
      "Convert length between meters, feet, miles, inches, kilometers and more.",
    keywords: ["length converter", "meters to feet", "miles to km", "inches to cm"],
    isNew: true,
  },
  {
    slug: "volume-converter",
    category: "conversions",
    title: "Volume",
    heading: "Volume Converter",
    description:
      "Convert volume between liters, gallons, milliliters, cups, pints and quarts.",
    keywords: ["volume converter", "liters to gallons", "ml to oz", "gallons to liters"],
    isNew: true,
  },
  {
    slug: "area-converter",
    category: "conversions",
    title: "Area",
    heading: "Area Converter",
    description:
      "Convert area between square feet, square meters, acres, hectares and more.",
    keywords: ["area converter", "square feet to square meters", "acres to hectares", "sq m to sq ft"],
    isNew: true,
  },
  {
    slug: "scientific-notation-calculator",
    category: "math",
    title: "Scientific notation",
    heading: "Scientific Notation Converter",
    description:
      "Convert numbers to and from scientific notation and see the expanded form.",
    keywords: ["scientific notation calculator", "standard form converter", "e notation", "convert to scientific notation"],
    isNew: true,
  },
  {
    slug: "permutations-combinations-calculator",
    category: "math",
    title: "Permutations & combinations",
    heading: "Permutations and Combinations Calculator",
    description:
      "Calculate permutations (nPr), combinations (nCr) and factorials.",
    keywords: ["permutations calculator", "combinations calculator", "nCr nPr calculator", "factorial calculator"],
    isNew: true,
  },
  {
    slug: "tile-calculator",
    category: "homediy",
    title: "Tile",
    heading: "Tile Calculator",
    description:
      "Estimate how many tiles and boxes you need for a floor or wall, with waste.",
    keywords: ["tile calculator", "how many tiles do I need", "tile flooring calculator", "square footage tiles"],
    isNew: true,
  },
  {
    slug: "gravel-calculator",
    category: "homediy",
    title: "Gravel / mulch",
    heading: "Gravel & Mulch Calculator",
    description:
      "Estimate the gravel, mulch or soil you need in cubic yards and tons.",
    keywords: ["gravel calculator", "mulch calculator", "how much gravel do I need", "cubic yards calculator"],
    isNew: true,
  },
  {
    slug: "btu-calculator",
    category: "homediy",
    title: "BTU (AC size)",
    heading: "BTU Calculator (Room Size)",
    description:
      "Estimate the BTUs needed to cool or heat a room from its square footage.",
    keywords: ["btu calculator", "ac size calculator", "how many btu do I need", "air conditioner size"],
    isNew: true,
  },
  {
    slug: "flooring-calculator",
    category: "homediy",
    title: "Flooring",
    heading: "Flooring Calculator",
    description:
      "Work out the flooring area and number of boxes you need, including waste.",
    keywords: ["flooring calculator", "how much flooring do I need", "laminate flooring calculator", "square footage flooring"],
    isNew: true,
  },
  {
    slug: "mileage-reimbursement-calculator",
    category: "auto",
    title: "Mileage reimbursement",
    heading: "Mileage Reimbursement Calculator",
    description:
      "Calculate mileage reimbursement from miles driven and the rate per mile.",
    keywords: ["mileage reimbursement calculator", "irs mileage rate", "business mileage calculator", "cents per mile"],
    isNew: true,
  },
  {
    slug: "lease-vs-buy-calculator",
    category: "auto",
    title: "Lease vs buy",
    heading: "Lease vs Buy Car Calculator",
    description:
      "Compare the total cost of leasing versus buying a car over the same period.",
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
  const sameCat = calculators.filter(
    (c) => c.category === self.category && c.slug !== slug,
  );
  const rest = calculators.filter(
    (c) => c.category !== self.category && c.slug !== slug,
  );
  return [...sameCat, ...rest].slice(0, limit);
}
