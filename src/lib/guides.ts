import type { CategoryId } from "@/lib/calculators/registry";

// Long-form guide content: informational articles that target "how / why"
// search intent and link to the relevant calculators (topical authority +
// internal linking both ways).

export type Block =
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "steps"; items: string[] }
  | { t: "callout"; text: string };

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: CategoryId;
  updated: string;
  readMins: number;
  /** related calculator slugs — the first is the primary CTA */
  calcSlugs: string[];
  body: Block[];
}

export const GUIDES: Guide[] = [
  {
    slug: "how-mortgage-payments-work",
    title: "How Mortgage Payments Work",
    description:
      "Understand what makes up a mortgage payment, the amortization formula, and how to pay less interest over the life of the loan.",
    category: "finance",
    updated: "2026-08",
    readMins: 5,
    calcSlugs: ["loan-calculator", "mortgage-refinance-calculator"],
    body: [
      {
        t: "p",
        text: "A fixed-rate mortgage payment stays the same every month, but what it is made of changes over time. Each payment covers two things: interest (the cost of borrowing) and principal (the amount that actually reduces your balance). Property tax and insurance are often bundled in too, but the core of the payment is principal and interest.",
      },
      { t: "h2", text: "The formula behind your payment" },
      {
        t: "p",
        text: "Lenders use the standard amortization formula to work out a level monthly payment that pays the loan off exactly at the end of the term:",
      },
      {
        t: "callout",
        text: "M = P · r · (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1), where P is the amount borrowed, r is the monthly interest rate (APR ÷ 12 ÷ 100), and n is the number of monthly payments.",
      },
      {
        t: "p",
        text: "Because the payment is fixed, lowering the rate or shortening the term changes how much you pay each month — and dramatically changes the total interest.",
      },
      { t: "h2", text: "Why early payments are mostly interest" },
      {
        t: "p",
        text: "Interest is charged on the outstanding balance, which is largest at the start. So in the early years most of each payment goes to interest and only a little to principal. As the balance shrinks, the split flips and more of every payment attacks the principal. That is why an amortization schedule shows the balance falling slowly at first, then faster.",
      },
      { t: "h2", text: "What changes your payment" },
      {
        t: "ul",
        items: [
          "Interest rate — even 0.5% makes a large difference over 30 years.",
          "Loan term — a 15-year loan has higher payments but far less total interest than a 30-year loan.",
          "Amount borrowed — a bigger down payment means a smaller loan and payment.",
          "Taxes and insurance — a full monthly payment (PITI) adds property tax, homeowners insurance and sometimes PMI on top of principal and interest.",
        ],
      },
      { t: "h2", text: "Ways to pay less interest" },
      {
        t: "ul",
        items: [
          "Put down a larger deposit to borrow less.",
          "Choose a shorter term if you can afford the higher payment.",
          "Make extra principal payments — even one extra payment a year shortens the loan.",
          "Refinance when rates fall enough to beat your closing costs.",
        ],
      },
      {
        t: "steps",
        items: [
          "Enter the loan amount, interest rate (APR) and term into the calculator.",
          "Check the monthly payment, total interest and total cost.",
          "Open the amortization schedule to see how the balance falls year by year.",
          "Try a shorter term or lower rate to see how much interest you could save.",
        ],
      },
    ],
  },
  {
    slug: "compound-interest-explained",
    title: "Compound Interest, Explained Simply",
    description:
      "How compound interest works, why starting early matters so much, and how regular contributions accelerate growth.",
    category: "finance",
    updated: "2026-08",
    readMins: 4,
    calcSlugs: ["compound-interest-calculator", "savings-goal-calculator"],
    body: [
      {
        t: "p",
        text: "Compound interest is interest earned on your interest. With simple interest you only earn on the original amount; with compound interest each period's gain is added to the balance, so the next period earns a little more. Over years, that snowball effect becomes the main driver of growth.",
      },
      { t: "h2", text: "The formula" },
      {
        t: "callout",
        text: "A = P · (1 + r/n)^(n·t), where P is the starting amount, r is the annual rate (as a decimal), n is how many times a year it compounds, and t is the number of years.",
      },
      {
        t: "p",
        text: "Compounding more often (monthly vs annually) helps a little, but the two things that matter most are the rate and the time.",
      },
      { t: "h2", text: "Why starting early wins" },
      {
        t: "p",
        text: "Because growth builds on itself, an extra decade at the start is worth far more than extra money at the end. Someone who invests modestly in their twenties can end up ahead of someone who invests much more starting in their forties — time does the heavy lifting.",
      },
      { t: "h2", text: "Regular contributions" },
      {
        t: "p",
        text: "Adding a fixed amount every month keeps the balance growing even when returns are flat, and each contribution then compounds for the rest of the period. This is why automatic monthly investing is so effective.",
      },
      {
        t: "callout",
        text: "Rule of 72: divide 72 by the annual return to estimate how many years it takes your money to double. At 8%, that's about 9 years.",
      },
      {
        t: "steps",
        items: [
          "Enter your starting amount, annual rate, years and monthly contribution.",
          "Compare the future value with the total you actually put in — the gap is compound interest.",
          "Increase the years to see how much difference time makes.",
        ],
      },
    ],
  },
  {
    slug: "understanding-your-bmi",
    title: "Understanding Your BMI",
    description:
      "What Body Mass Index measures, how to read the categories, and the limits of BMI as a health metric.",
    category: "health",
    updated: "2026-08",
    readMins: 4,
    calcSlugs: ["bmi-calculator", "ideal-weight-calculator"],
    body: [
      {
        t: "p",
        text: "Body Mass Index (BMI) is a quick screening number that relates your weight to your height. It doesn't measure body fat directly, but for most people it gives a reasonable first indication of whether their weight sits in a healthy range.",
      },
      { t: "h2", text: "The formula" },
      {
        t: "callout",
        text: "Metric: BMI = weight (kg) ÷ height (m)². Imperial: BMI = 703 × weight (lb) ÷ height (in)².",
      },
      { t: "h2", text: "The categories" },
      {
        t: "ul",
        items: [
          "Under 18.5 — underweight",
          "18.5 to 24.9 — normal weight",
          "25 to 29.9 — overweight",
          "30 and above — obese",
        ],
      },
      { t: "h2", text: "What BMI doesn't tell you" },
      {
        t: "p",
        text: "BMI uses only height and weight, so it can't tell muscle from fat or show where fat is stored. A muscular athlete may read as \"overweight\" while carrying very little fat, and two people with the same BMI can have very different health profiles. For a fuller picture, look at body-fat percentage and waist measurement alongside BMI.",
      },
      {
        t: "callout",
        text: "BMI is a screening tool, not a diagnosis. For medical decisions, talk to a healthcare professional.",
      },
      {
        t: "steps",
        items: [
          "Choose metric or imperial units.",
          "Enter your height and weight.",
          "Read your BMI, category and the healthy-weight range for your height.",
        ],
      },
    ],
  },
  {
    slug: "how-to-calculate-percentages",
    title: "How to Calculate Percentages",
    description:
      "The three percentage questions that come up most — percent of a number, percentage change, and what percent one number is of another.",
    category: "math",
    updated: "2026-08",
    readMins: 3,
    calcSlugs: ["percentage-calculator"],
    body: [
      {
        t: "p",
        text: "A percentage is just a fraction of 100. Almost every real-world percentage question is one of three types, and each has a simple formula.",
      },
      { t: "h2", text: "Percent of a number" },
      {
        t: "callout",
        text: "X% of Y = (X ÷ 100) × Y. Example: 20% of 80 = 0.20 × 80 = 16.",
      },
      { t: "h2", text: "Percentage change" },
      {
        t: "callout",
        text: "Change = (new − old) ÷ old × 100. Example: from 200 to 250 is (250 − 200) ÷ 200 × 100 = +25%.",
      },
      {
        t: "p",
        text: "A positive result is an increase; a negative result is a decrease.",
      },
      { t: "h2", text: "What percent is X of Y" },
      {
        t: "callout",
        text: "Percent = X ÷ Y × 100. Example: 30 out of 120 is 30 ÷ 120 × 100 = 25%.",
      },
      { t: "h2", text: "Where you'll use these" },
      {
        t: "ul",
        items: [
          "Tips and sales tax on a bill",
          "Discounts and markups on a price",
          "Growth or decline between two figures",
          "Test scores and progress",
        ],
      },
      {
        t: "steps",
        items: [
          "Pick the mode that matches your question.",
          "Enter the two numbers.",
          "Read the answer — it updates as you type.",
        ],
      },
    ],
  },
  {
    slug: "daily-calories-and-tdee",
    title: "Daily Calories and TDEE, Explained",
    description:
      "The difference between BMR and TDEE, how activity multipliers work, and how to set calories for losing or gaining weight.",
    category: "health",
    updated: "2026-08",
    readMins: 4,
    calcSlugs: ["calorie-calculator", "bmr-calculator", "macro-calculator"],
    body: [
      {
        t: "p",
        text: "Two numbers describe your daily energy needs. BMR (basal metabolic rate) is what your body burns at complete rest just to stay alive. TDEE (total daily energy expenditure) is BMR plus everything else you do — moving, working, exercising.",
      },
      { t: "h2", text: "Estimating BMR" },
      {
        t: "callout",
        text: "Mifflin-St Jeor — Men: 10·kg + 6.25·cm − 5·age + 5. Women: 10·kg + 6.25·cm − 5·age − 161.",
      },
      { t: "h2", text: "From BMR to TDEE" },
      {
        t: "p",
        text: "Multiply BMR by an activity factor to estimate TDEE:",
      },
      {
        t: "ul",
        items: [
          "Sedentary (little exercise) — ×1.2",
          "Lightly active (1–3 days/week) — ×1.375",
          "Moderately active (3–5 days) — ×1.55",
          "Very active (6–7 days) — ×1.725",
          "Extra active (physical job or training) — ×1.9",
        ],
      },
      { t: "h2", text: "Losing or gaining weight" },
      {
        t: "p",
        text: "Eat around your TDEE to maintain. A deficit of about 500 calories a day is roughly one pound of weight loss per week; a similar surplus supports gradual gain. Large, sudden changes are hard to sustain, so small consistent adjustments usually win.",
      },
      {
        t: "callout",
        text: "These are estimates. Real needs vary with body composition, genetics and NEAT (everyday non-exercise movement).",
      },
      {
        t: "steps",
        items: [
          "Enter your age, sex, height and weight.",
          "Pick the activity level that matches a typical week.",
          "Use the maintenance number as your baseline, then adjust for your goal.",
        ],
      },
    ],
  },
  {
    slug: "how-us-federal-income-tax-works",
    title: "How US Federal Income Tax Works",
    description:
      "Marginal vs effective tax rates, the standard deduction, and why moving into a higher bracket doesn't tax all your income.",
    category: "finance",
    updated: "2026-08",
    readMins: 5,
    calcSlugs: ["income-tax-calculator", "paycheck-calculator"],
    body: [
      {
        t: "p",
        text: "US federal income tax is progressive: income is taxed in bands called brackets, and each band has its own rate. A common myth is that earning a dollar more can push all your income into a higher bracket. It can't — only the income above each threshold is taxed at the higher rate.",
      },
      { t: "h2", text: "Marginal vs effective rate" },
      {
        t: "callout",
        text: "Your marginal rate is the rate on your last dollar of income. Your effective rate is total tax ÷ total income — always lower than the marginal rate.",
      },
      { t: "h2", text: "The standard deduction" },
      {
        t: "p",
        text: "Before brackets apply, most people subtract the standard deduction. For tax year 2024 it is $14,600 for single filers and $29,200 for married couples filing jointly. Only the income above the deduction — your taxable income — is taxed.",
      },
      { t: "h2", text: "A quick example" },
      {
        t: "p",
        text: "Suppose a single filer earns $75,000. After the $14,600 deduction, $60,400 is taxable. The first $11,600 is taxed at 10%, the next band at 12%, and the remainder at 22%. That works out to roughly $8,300 in federal tax — an effective rate near 11%, even though the top bracket touched is 22%.",
      },
      {
        t: "callout",
        text: "This covers federal income tax only. It doesn't include state tax, FICA (Social Security and Medicare), or credits. For advice on your situation, consult a tax professional.",
      },
      {
        t: "steps",
        items: [
          "Enter your annual income and filing status.",
          "Read your estimated federal tax, effective rate and after-tax income.",
          "Use the paycheck calculator to estimate take-home pay per paycheck.",
        ],
      },
    ],
  },
  {
    slug: "how-much-to-tip",
    title: "How Much to Tip (and How to Split a Bill)",
    description:
      "Typical tipping percentages in the US, whether to tip on the pre-tax total, and how to split a bill fairly.",
    category: "finance",
    updated: "2026-08",
    readMins: 3,
    calcSlugs: ["tip-calculator", "percentage-calculator"],
    body: [
      {
        t: "p",
        text: "Tipping trips people up because the “right” amount depends on the country, the service and the setting. In the US, tipping is customary and often makes up most of a server's pay, so the norms are stronger than in much of the world.",
      },
      { t: "h2", text: "Typical US tip percentages" },
      {
        t: "ul",
        items: [
          "Restaurants (sit-down): 15–20%, with 18–20% for good service.",
          "Bars: about $1–2 per drink, or 15–20% of the tab.",
          "Taxis / rideshare: 10–15%.",
          "Food delivery: 10–15%, more in bad weather.",
          "Coffee shops and counter service: optional, often rounding up or 10%.",
        ],
      },
      { t: "h2", text: "Tip on the total or the pre-tax amount?" },
      {
        t: "p",
        text: "Either is acceptable. Tipping on the pre-tax subtotal is technically correct because the tax isn't part of the service, but many people just tip on the total for simplicity — the difference is usually small.",
      },
      {
        t: "callout",
        text: "Quick math: 20% is one-fifth, so move the decimal one place left and double it. 10% of $45 is $4.50, so 20% is $9.",
      },
      { t: "h2", text: "Splitting the bill" },
      {
        t: "p",
        text: "For an even split, add the tip first, then divide by the number of people. If everyone ordered very differently, split by what each person had and add the same tip percentage to each share.",
      },
      {
        t: "steps",
        items: [
          "Enter the bill amount.",
          "Pick a tip percentage (or type your own).",
          "Set the number of people to see the total and the per-person amount.",
        ],
      },
    ],
  },
  {
    slug: "salary-to-hourly-explained",
    title: "Converting Salary to Hourly (and Back)",
    description:
      "How to turn an annual salary into an hourly rate, why 2,080 hours matters, and how to compare job offers fairly.",
    category: "finance",
    updated: "2026-08",
    readMins: 3,
    calcSlugs: ["salary-to-hourly-calculator", "paycheck-calculator"],
    body: [
      {
        t: "p",
        text: "Comparing a salaried job with an hourly one — or a full-time role with freelance work — means putting both on the same footing. The bridge between them is the number of hours you work in a year.",
      },
      { t: "h2", text: "The 2,080-hour rule" },
      {
        t: "callout",
        text: "A standard full-time year is 40 hours × 52 weeks = 2,080 hours. Hourly rate = annual salary ÷ 2,080. So $60,000 ÷ 2,080 ≈ $28.85/hour.",
      },
      {
        t: "p",
        text: "If you take unpaid time off, your effective hourly rate on the hours you actually work is a little higher; if you work overtime unpaid, it's lower.",
      },
      { t: "h2", text: "Going the other way" },
      {
        t: "p",
        text: "To annualize an hourly rate, multiply by the hours you work per week and by the weeks you work per year: $30/hour × 40 × 52 = $62,400 a year.",
      },
      { t: "h2", text: "Comparing offers fairly" },
      {
        t: "ul",
        items: [
          "Benefits: health insurance, retirement match and paid leave can be worth thousands.",
          "Hours: a “salary” that expects 55-hour weeks has a lower real hourly rate.",
          "Taxes and self-employment: freelance rates need to cover taxes and gaps between gigs.",
        ],
      },
      {
        t: "steps",
        items: [
          "Choose salary → hourly or hourly → salary.",
          "Enter the amount and your typical hours and weeks.",
          "Read the hourly, weekly, monthly and annual equivalents.",
        ],
      },
    ],
  },
  {
    slug: "how-currency-conversion-works",
    title: "How Currency Conversion Works",
    description:
      "What an exchange rate is, why the rate you get differs from the mid-market rate, and how to avoid hidden fees.",
    category: "conversions",
    updated: "2026-08",
    readMins: 3,
    calcSlugs: ["currency-converter"],
    body: [
      {
        t: "p",
        text: "An exchange rate is simply the price of one currency in another. If 1 USD = 0.92 EUR, then euros are the “price” you pay to buy one dollar. Rates move constantly as markets trade.",
      },
      { t: "h2", text: "The mid-market rate vs the rate you get" },
      {
        t: "p",
        text: "The mid-market (or interbank) rate is the “real” midpoint between buy and sell prices — the rate you see on Google. But banks, airport kiosks and many apps add a margin on top, so the rate you actually get is worse. That margin is often a bigger cost than any upfront “fee”.",
      },
      {
        t: "callout",
        text: "To spot the true cost, compare the total you receive against the mid-market rate — not just the advertised fee.",
      },
      { t: "h2", text: "Tips to keep more of your money" },
      {
        t: "ul",
        items: [
          "Prefer providers that use the mid-market rate with a small, transparent fee.",
          "Avoid airport and hotel exchange counters — their margins are the highest.",
          "When a card asks to charge you in your home currency abroad (DCC), decline and pay in the local currency.",
        ],
      },
      {
        t: "p",
        text: "Our converter uses indicative rates for quick estimates. For an exact amount to send or spend, check your provider's live rate at the moment of the transaction.",
      },
      {
        t: "steps",
        items: [
          "Enter an amount and pick the two currencies.",
          "Read the converted amount and the effective rate.",
          "Use it as an estimate, then confirm with your provider's live rate.",
        ],
      },
    ],
  },
  {
    slug: "understanding-debt-to-income",
    title: "Understanding Debt-to-Income (DTI)",
    description:
      "What DTI is, the front-end and back-end ratios, and why lenders care so much about it for a mortgage.",
    category: "finance",
    updated: "2026-08",
    readMins: 4,
    calcSlugs: ["dti-calculator", "home-affordability-calculator", "mortgage-refinance-calculator"],
    body: [
      {
        t: "p",
        text: "Debt-to-income ratio (DTI) compares how much you owe each month to how much you earn. Lenders use it as a quick read on whether you can comfortably take on a new payment — it's one of the biggest factors in a mortgage decision.",
      },
      { t: "h2", text: "Two ratios" },
      {
        t: "callout",
        text: "Front-end DTI = housing payment ÷ gross monthly income. Back-end DTI = (housing + all other debt payments) ÷ gross monthly income.",
      },
      {
        t: "p",
        text: "“Gross” means before tax. Debt payments include mortgage or rent, car loans, student loans, and minimum credit-card payments — but usually not things like utilities or groceries.",
      },
      { t: "h2", text: "What counts as a good DTI" },
      {
        t: "ul",
        items: [
          "36% or below — healthy; lenders see plenty of room.",
          "37–43% — manageable; still within many lenders' limits.",
          "Above 43% — high; it gets harder to qualify for a mortgage.",
        ],
      },
      { t: "h2", text: "How to improve it" },
      {
        t: "ul",
        items: [
          "Pay down the balances with the highest monthly minimums.",
          "Avoid taking on new loans before applying for a mortgage.",
          "Increase income where you can — it's the denominator.",
        ],
      },
      {
        t: "steps",
        items: [
          "Enter your gross monthly income.",
          "Add your housing payment and other monthly debts.",
          "Read your front-end and back-end DTI and where you land.",
        ],
      },
    ],
  },
  {
    slug: "the-50-30-20-budget",
    title: "The 50/30/20 Budget, Explained",
    description:
      "A simple budgeting rule that splits your take-home pay into needs, wants and savings — and how to adapt it.",
    category: "finance",
    updated: "2026-08",
    readMins: 3,
    calcSlugs: ["budget-calculator", "emergency-fund-calculator"],
    body: [
      {
        t: "p",
        text: "The 50/30/20 rule is a budgeting starting point that's easy to remember: split your monthly after-tax income into three buckets. It won't fit everyone exactly, but it's a fast way to see whether your spending is balanced.",
      },
      { t: "h2", text: "The three buckets" },
      {
        t: "ul",
        items: [
          "50% needs — rent/mortgage, utilities, groceries, transport, insurance, minimum debt payments.",
          "30% wants — dining out, subscriptions, hobbies, travel, upgrades.",
          "20% savings & debt — emergency fund, retirement, investments, extra debt payoff.",
        ],
      },
      {
        t: "callout",
        text: "Use take-home (after-tax) pay, not gross. If your taxes are taken out before you're paid, the number on your paycheck is the one to split.",
      },
      { t: "h2", text: "When to adapt it" },
      {
        t: "p",
        text: "In high-cost cities, needs can easily exceed 50% — that's fine, just trim wants to keep some savings going. If you're paying down expensive debt, temporarily grow the 20% bucket. The point is a conscious plan, not perfection.",
      },
      {
        t: "steps",
        items: [
          "Enter your monthly after-tax income.",
          "See your needs, wants and savings targets.",
          "Compare them with what you actually spend and adjust.",
        ],
      },
    ],
  },
  {
    slug: "sleep-cycles-and-bedtime",
    title: "Sleep Cycles and the Best Time to Wake Up",
    description:
      "Why waking at the end of a 90-minute sleep cycle feels better, and how to plan your bedtime or wake-up time.",
    category: "health",
    updated: "2026-08",
    readMins: 3,
    calcSlugs: ["sleep-calculator"],
    body: [
      {
        t: "p",
        text: "You don't sleep at one steady depth — you move through cycles of light sleep, deep sleep and REM. Each full cycle lasts about 90 minutes. Waking at the end of a cycle, in light sleep, tends to feel far easier than being pulled out of deep sleep.",
      },
      { t: "h2", text: "The 90-minute rule" },
      {
        t: "callout",
        text: "Aim for a whole number of cycles. Most adults do well on 5–6 cycles (about 7.5–9 hours), plus roughly 15 minutes to fall asleep.",
      },
      {
        t: "p",
        text: "So if you need to be up at 7:00 am, counting back six 90-minute cycles plus 15 minutes to drift off suggests a bedtime around 9:45 pm; five cycles points to about 11:15 pm.",
      },
      { t: "h2", text: "Sleep better, not just longer" },
      {
        t: "ul",
        items: [
          "Keep a consistent schedule, even on weekends.",
          "Dim screens and lights in the last hour before bed.",
          "Avoid caffeine late in the day and heavy meals close to bedtime.",
        ],
      },
      {
        t: "steps",
        items: [
          "Choose whether you're planning a wake-up time or a bedtime.",
          "Enter the time.",
          "Pick one of the suggested times that lands on a full sleep cycle.",
        ],
      },
    ],
  },
];

// ── Lookups ──────────────────────────────────────────────────────
const bySlug = new Map(GUIDES.map((g) => [g.slug, g]));

export function getGuide(slug: string): Guide | undefined {
  return bySlug.get(slug);
}

/** The guide that features a given calculator (for cross-linking), if any. */
export function guideForCalc(calcSlug: string): Guide | undefined {
  return GUIDES.find((g) => g.calcSlugs.includes(calcSlug));
}
