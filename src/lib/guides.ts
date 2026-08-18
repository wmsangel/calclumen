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
  {
    slug: "snowball-vs-avalanche-debt-payoff",
    title: "Snowball vs Avalanche: The Fastest Way to Pay Off Debt",
    description:
      "Two proven strategies for clearing multiple debts — one saves the most money, the other keeps you motivated. Here's how to choose.",
    category: "finance",
    updated: "2026-08",
    readMins: 5,
    calcSlugs: ["debt-payoff-calculator", "credit-card-payoff-calculator"],
    body: [
      {
        t: "p",
        text: "When you owe money on several cards or loans at once, the order you pay them off in changes how fast you become debt-free and how much interest you hand over along the way. Two methods dominate: the debt snowball and the debt avalanche. Both tell you to pay the minimum on every debt, then throw every spare dollar at one target debt until it's gone — they only disagree on which debt to target first.",
      },
      { t: "h2", text: "The debt snowball" },
      {
        t: "p",
        text: "The snowball method targets the debt with the smallest balance first, regardless of interest rate. When that debt is cleared, its old minimum payment rolls onto the next-smallest — the payment 'snowballs' and grows as each debt disappears.",
      },
      {
        t: "callout",
        text: "The snowball wins on psychology: you clear whole debts quickly, and each cleared account is a visible win that keeps you going.",
      },
      { t: "h2", text: "The debt avalanche" },
      {
        t: "p",
        text: "The avalanche method targets the debt with the highest interest rate (APR) first. Because you're always attacking the most expensive debt, you pay the least total interest and usually become debt-free slightly sooner. The trade-off is motivation: if your highest-rate debt also has a big balance, it can take a while before you clear your first account.",
      },
      { t: "h2", text: "Which should you choose?" },
      {
        t: "ul",
        items: [
          "Choose the avalanche if you're motivated by numbers and want to pay the least interest possible.",
          "Choose the snowball if you've struggled to stick with debt payoff before and need quick wins to stay motivated.",
          "The gap between the two is often small — the best method is the one you'll actually finish.",
        ],
      },
      { t: "h2", text: "The one rule both share" },
      {
        t: "p",
        text: "Every extra dollar goes to a single target debt while the rest get only their minimums. Splitting extra money across all debts equally is the slowest, most expensive approach — it keeps every balance alive longer and accruing interest.",
      },
      {
        t: "steps",
        items: [
          "List every debt with its balance, APR and minimum payment.",
          "Decide how much extra you can add on top of the minimums each month.",
          "Pick a strategy — smallest balance (snowball) or highest APR (avalanche).",
          "Pay minimums on everything, and the extra on your target debt.",
          "When a debt is cleared, roll its payment onto the next target.",
        ],
      },
    ],
  },
  {
    slug: "apr-vs-apy-explained",
    title: "APR vs APY: What's the Difference?",
    description:
      "APR and APY look similar but mean different things — one is what you pay, the other is what you earn. Understanding compounding is the key.",
    category: "finance",
    updated: "2026-08",
    readMins: 4,
    calcSlugs: [
      "apr-calculator",
      "cd-calculator",
      "compound-interest-calculator",
    ],
    body: [
      {
        t: "p",
        text: "APR (annual percentage rate) and APY (annual percentage yield) both describe an interest rate as a yearly percentage, but they answer different questions. APR is normally used for what you borrow; APY for what you earn. The difference between them comes down to one thing: compounding.",
      },
      { t: "h2", text: "APR — the cost of borrowing" },
      {
        t: "p",
        text: "APR is the yearly rate a lender charges, and on loans it usually also folds in certain fees to show the true annual cost of the credit. Crucially, a quoted APR does not assume the interest compounds on itself — it's a simple annual rate divided into your payments. That's why it's the standard figure for mortgages, car loans and credit cards.",
      },
      { t: "h2", text: "APY — the power of compounding" },
      {
        t: "p",
        text: "APY describes what you actually earn (or, on revolving debt, truly pay) once interest compounds — that is, once you start earning interest on your interest. The more often interest compounds (daily, monthly, quarterly), the higher the APY climbs above the stated rate.",
      },
      {
        t: "callout",
        text: "APY = (1 + r ÷ n)ⁿ − 1, where r is the annual rate and n is the number of compounding periods per year. More frequent compounding → higher APY.",
      },
      { t: "h2", text: "A quick example" },
      {
        t: "p",
        text: "A savings account paying 5% compounded monthly doesn't earn you exactly 5% over the year — it earns about 5.12% APY, because each month's interest starts earning interest too. The 5% is the nominal rate; the 5.12% is what actually lands in your account.",
      },
      { t: "h2", text: "What to compare" },
      {
        t: "ul",
        items: [
          "Comparing savings accounts or CDs? Compare APY — it reflects compounding, so it's apples-to-apples.",
          "Comparing loans or credit cards? Compare APR — the standard, fee-inclusive cost of borrowing.",
          "Watch the compounding frequency: two accounts with the same nominal rate can have different APYs.",
        ],
      },
    ],
  },
  {
    slug: "how-much-house-can-you-afford",
    title: "How Much House Can You Afford?",
    description:
      "Lenders use a few simple ratios to decide your budget. Learn the 28/36 rule, what counts toward it, and how the down payment changes everything.",
    category: "finance",
    updated: "2026-08",
    readMins: 5,
    calcSlugs: [
      "home-affordability-calculator",
      "down-payment-calculator",
      "mortgage-refinance-calculator",
    ],
    body: [
      {
        t: "p",
        text: "Affordability isn't just the price a lender will approve — it's the payment you can comfortably live with. Lenders lean on a couple of ratios to set a ceiling, but the smart number is usually below that limit, leaving room for the rest of your life.",
      },
      { t: "h2", text: "The 28/36 rule" },
      {
        t: "p",
        text: "The classic guideline says your housing costs should stay under 28% of gross monthly income, and your total debt payments (housing plus car loans, student loans, credit cards) should stay under 36%. These are the front-end and back-end debt-to-income ratios lenders check.",
      },
      {
        t: "callout",
        text: "Front-end ratio = housing payment ÷ gross monthly income. Back-end ratio = all debt payments ÷ gross monthly income. Aim for 28% and 36% or lower.",
      },
      { t: "h2", text: "What counts as the housing payment" },
      {
        t: "p",
        text: "It's more than principal and interest. Lenders look at PITI: principal, interest, property taxes and homeowners insurance — plus PMI if your down payment is under 20%, and any HOA dues. All of it counts toward that 28%.",
      },
      { t: "h2", text: "How the down payment changes things" },
      {
        t: "ul",
        items: [
          "A bigger down payment means a smaller loan, so a lower monthly payment for the same house.",
          "Reaching 20% down typically removes PMI, cutting the payment further.",
          "More cash down can also earn a better interest rate, compounding the savings.",
        ],
      },
      { t: "h2", text: "Don't forget the other costs" },
      {
        t: "p",
        text: "Closing costs, moving, repairs and a maintenance cushion all sit outside the mortgage payment. A common rule of thumb is to budget around 1% of the home's value per year for upkeep. Borrowing the maximum a lender offers leaves nothing for these — which is why the affordable number is usually below the approved one.",
      },
      {
        t: "steps",
        items: [
          "Add up your gross monthly income before tax.",
          "Total your existing monthly debt payments.",
          "Apply the 28/36 rule to find your housing-payment ceiling.",
          "Subtract taxes, insurance and HOA to see what's left for principal and interest.",
          "Factor in your down payment to arrive at a realistic price range.",
        ],
      },
    ],
  },
  {
    slug: "how-car-loans-work",
    title: "How Car Loans Work",
    description:
      "From sales tax and trade-ins to APR and loan term — what really drives your monthly car payment, and how to pay less for the same car.",
    category: "auto",
    updated: "2026-08",
    readMins: 5,
    calcSlugs: ["auto-loan-calculator", "lease-vs-buy-calculator"],
    body: [
      {
        t: "p",
        text: "A car loan works like any other amortized loan: you borrow a lump sum and repay it in equal monthly instalments made up of principal and interest. But the amount you actually finance is rarely just the sticker price — sales tax, fees, a down payment and a trade-in all move it before interest is ever applied.",
      },
      { t: "h2", text: "What you actually finance" },
      {
        t: "p",
        text: "Start with the vehicle price, add sales tax and dealer fees, then subtract your down payment and any trade-in value. What's left is the loan principal. Because interest is charged on that principal, anything that lowers it — a bigger down payment, a valuable trade-in — directly cuts what you pay.",
      },
      {
        t: "callout",
        text: "Loan amount = vehicle price + sales tax + fees − down payment − trade-in. A larger down payment shrinks both the loan and the interest.",
      },
      { t: "h2", text: "APR and loan term" },
      {
        t: "p",
        text: "The APR is your yearly borrowing rate; the term is how many months you spread it over. A longer term lowers the monthly payment but raises total interest — and can leave you 'underwater', owing more than the car is worth. A shorter term costs more each month but far less overall.",
      },
      { t: "h2", text: "Watch the sales tax rules" },
      {
        t: "p",
        text: "In many US states, a trade-in reduces the taxable amount — you only pay sales tax on the price difference, not the full sticker. That can be a meaningful saving, and it's why trade-in value and tax are worth modelling together rather than guessing.",
      },
      { t: "h2", text: "How to pay less" },
      {
        t: "ul",
        items: [
          "Put more down — it cuts the principal and the interest on top of it.",
          "Choose the shortest term whose payment you can comfortably afford.",
          "Shop the APR separately from the car — a credit union pre-approval is a strong bargaining chip.",
          "Be wary of long 72–84 month terms; the low payment hides a high total cost.",
        ],
      },
      {
        t: "steps",
        items: [
          "Enter the vehicle price, your down payment and any trade-in value.",
          "Add your local sales tax rate and dealer fees.",
          "Set the APR you've been quoted and the loan term in months.",
          "Compare a shorter term against a longer one to see the interest difference.",
        ],
      },
    ],
  },
  {
    slug: "margin-vs-markup",
    title: "Margin vs Markup: Pricing Without the Confusion",
    description:
      "Margin and markup use the same two numbers but mean different things — and mixing them up quietly erodes your profit. Here's the clear version.",
    category: "business",
    updated: "2026-08",
    readMins: 4,
    calcSlugs: ["margin-markup-calculator", "break-even-calculator"],
    body: [
      {
        t: "p",
        text: "Margin and markup both describe the gap between what a product costs you and what you sell it for. They're built from the same two numbers — cost and price — but they measure that gap against different bases. Confusing them is one of the most common ways small businesses underprice themselves.",
      },
      { t: "h2", text: "Markup — measured against cost" },
      {
        t: "p",
        text: "Markup is the profit expressed as a percentage of the cost. If an item costs you $40 and you add $20, that's a 50% markup ($20 ÷ $40). Markup answers: 'how much do I add on top of cost?'",
      },
      { t: "h2", text: "Margin — measured against price" },
      {
        t: "p",
        text: "Margin is the same $20 profit expressed as a percentage of the selling price. Sell that item for $60 and your margin is 33% ($20 ÷ $60), not 50%. Margin answers: 'how much of each sale do I actually keep?'",
      },
      {
        t: "callout",
        text: "Markup = profit ÷ cost. Margin = profit ÷ price. The same dollar profit always shows a smaller margin than markup.",
      },
      { t: "h2", text: "Why the mix-up costs money" },
      {
        t: "p",
        text: "If you want a 40% margin but set a 40% markup by mistake, you'll charge too little — a 40% markup only yields about a 29% margin. Over hundreds of sales that gap is real money left on the table. Decide which one your target is, and price to it deliberately.",
      },
      { t: "h2", text: "Which should you use?" },
      {
        t: "ul",
        items: [
          "Use markup when setting a price up from a known cost.",
          "Use margin when judging how healthy a sale or a whole business is.",
          "Retail and accounting usually talk in margin; buyers and suppliers often talk in markup.",
          "Always confirm which one a quoted percentage refers to before you compare.",
        ],
      },
    ],
  },
  {
    slug: "how-big-should-your-emergency-fund-be",
    title: "How Big Should Your Emergency Fund Be?",
    description:
      "The classic answer is 3–6 months of expenses — but the right number depends on your job, your dependents and your fixed costs. Here's how to size it.",
    category: "finance",
    updated: "2026-08",
    readMins: 4,
    calcSlugs: ["emergency-fund-calculator", "budget-calculator"],
    body: [
      {
        t: "p",
        text: "An emergency fund is cash set aside for the unexpected — a job loss, a medical bill, a car repair — so a bad month doesn't become debt. The common rule is three to six months of essential expenses, but that range is a starting point, not a one-size answer.",
      },
      { t: "h2", text: "Base it on expenses, not income" },
      {
        t: "p",
        text: "Size the fund against what you must spend each month, not what you earn. Add up the essentials: housing, utilities, food, insurance, minimum debt payments and transport. Discretionary spending — dining out, subscriptions — can be paused in a real emergency, so leave it out of the core number.",
      },
      {
        t: "callout",
        text: "Target = essential monthly expenses × number of months of cover. Three months is a floor; six or more suits less stable situations.",
      },
      { t: "h2", text: "What pushes the number up" },
      {
        t: "ul",
        items: [
          "Irregular or commission-based income — aim for the higher end.",
          "A single income supporting dependents.",
          "A specialised job where finding a new role takes longer.",
          "High fixed costs you can't quickly cut.",
        ],
      },
      { t: "h2", text: "What lets you keep it smaller" },
      {
        t: "ul",
        items: [
          "Two stable incomes in the household.",
          "Few dependents and low fixed costs.",
          "Strong, genuinely accessible backup options.",
        ],
      },
      { t: "h2", text: "Where to keep it" },
      {
        t: "p",
        text: "The fund's job is safety and access, not growth. Keep it in a high-yield savings account — separate from your everyday checking so you're not tempted to spend it, but reachable within a day or two. Investments can fall exactly when you need the cash, so they're the wrong home for this money.",
      },
      {
        t: "steps",
        items: [
          "Total your essential monthly expenses.",
          "Choose a months-of-cover target based on your job stability and dependents.",
          "Multiply to get your goal, then subtract what you've already saved.",
          "Automate a monthly transfer until you close the gap.",
        ],
      },
    ],
  },
  {
    slug: "understanding-your-take-home-pay",
    title: "Understanding Your Take-Home Pay",
    description:
      "Gross pay is the headline; take-home is what lands in your account. Learn what's deducted between the two and why your paycheck looks smaller.",
    category: "finance",
    updated: "2026-08",
    readMins: 4,
    calcSlugs: ["paycheck-calculator", "salary-to-hourly-calculator"],
    body: [
      {
        t: "p",
        text: "Your salary is quoted as a gross figure, but the amount that actually reaches your bank account — your take-home or net pay — is smaller. The difference is a stack of deductions taken from each paycheck, some mandatory and some chosen by you.",
      },
      { t: "h2", text: "What comes out of gross pay" },
      {
        t: "ul",
        items: [
          "Federal income tax — withheld based on your W-4 and pay rate.",
          "State and sometimes local income tax, depending on where you live.",
          "FICA — Social Security and Medicare, a fixed percentage of your pay.",
          "Pre-tax deductions — 401(k) contributions, health insurance premiums, HSA/FSA.",
        ],
      },
      { t: "h2", text: "Pre-tax vs post-tax deductions" },
      {
        t: "p",
        text: "Order matters. Pre-tax deductions like a traditional 401(k) come out before income tax is calculated, so they lower your taxable income and soften the tax hit. Post-tax deductions come out after. That's why increasing your 401(k) contribution reduces your paycheck by less than the contribution itself.",
      },
      {
        t: "callout",
        text: "Take-home pay = gross pay − taxes − pre-tax deductions − post-tax deductions. Two people with the same salary can take home very different amounts.",
      },
      { t: "h2", text: "Why your withholding may be off" },
      {
        t: "p",
        text: "Withholding is an estimate. If too little is withheld you owe at tax time; too much and you get a refund — effectively an interest-free loan to the government. Big life changes (marriage, a new job, a child) are the moments to revisit your W-4 so the estimate stays close.",
      },
      { t: "h2", text: "Budget on net, not gross" },
      {
        t: "p",
        text: "Because deductions are substantial, always build your budget around take-home pay. Planning against the gross figure overstates what you can actually spend or save each month.",
      },
    ],
  },
  {
    slug: "how-to-calculate-roi",
    title: "How to Calculate ROI",
    description:
      "Return on investment turns a profit into a comparable percentage — but the simple formula hides two traps: time and total cost. Here's how to get it right.",
    category: "finance",
    updated: "2026-08",
    readMins: 4,
    calcSlugs: ["roi-calculator", "compound-interest-calculator"],
    body: [
      {
        t: "p",
        text: "Return on investment (ROI) measures how much you gained relative to what you put in, expressed as a percentage so you can compare very different investments on the same scale. It's the go-to metric for judging whether something was worth the money.",
      },
      { t: "h2", text: "The basic formula" },
      {
        t: "callout",
        text: "ROI = (final value − initial cost) ÷ initial cost × 100%. Invest $1,000, end with $1,250, and your ROI is 25%.",
      },
      {
        t: "p",
        text: "The number is only as honest as the two figures you feed it. The 'initial cost' should include every cost — fees, taxes, time and money spent along the way — not just the headline purchase price. Leave costs out and the ROI looks better than reality.",
      },
      { t: "h2", text: "The time trap" },
      {
        t: "p",
        text: "Plain ROI ignores how long the money was tied up. A 25% return in one year is excellent; the same 25% over ten years is mediocre. To compare fairly, convert to an annualized return — otherwise a slow winner can masquerade as a strong one.",
      },
      {
        t: "callout",
        text: "Annualized ROI = (1 + total ROI)^(1 ÷ years) − 1. It puts investments of different lengths on equal footing.",
      },
      { t: "h2", text: "What ROI doesn't tell you" },
      {
        t: "ul",
        items: [
          "Risk — a high ROI can come with a high chance of loss.",
          "Timing of cash flows — money returned early is worth more than money returned late.",
          "Scale — a 100% ROI on $50 is less meaningful than 10% on $50,000.",
        ],
      },
      {
        t: "steps",
        items: [
          "Add up the full initial cost, including fees and extras.",
          "Record the final value you received or expect.",
          "Apply the ROI formula for the raw percentage.",
          "Annualize it if the holding periods you're comparing differ.",
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
