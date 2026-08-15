import type { LucideIcon } from "lucide-react";
import {
  Landmark,
  TrendingUp,
  Wallet,
  HandCoins,
  RefreshCw,
  PiggyBank,
  Briefcase,
  CreditCard,
  TrendingDown,
  BadgePercent,
  Target,
  Banknote,
  Percent,
  Home,
  Flame,
  Receipt,
  Coins,
  Car,
  CarFront,
  Tag,
  Scale,
  PersonStanding,
  Gauge,
  Ruler,
  Apple,
  HeartPulse,
  Baby,
  Dumbbell,
  Droplet,
  CalendarRange,
  Cake,
  Timer,
  CalendarCheck,
  Clock,
  GraduationCap,
  Divide,
  Sigma,
  Hash,
  ArrowLeftRight,
  Fuel,
  CookingPot,
  PaintRoller,
  Square,
  CalendarClock,
  Calculator,
  Repeat,
} from "lucide-react";
import {
  getCategory,
  type CalcDef,
  type CategoryDef,
  type CategoryId,
} from "@/lib/calculators/registry";

const CALC_ICONS: Record<string, LucideIcon> = {
  // finance
  "loan-calculator": Landmark,
  "compound-interest-calculator": TrendingUp,
  "salary-to-hourly-calculator": Wallet,
  "tip-calculator": HandCoins,
  "mortgage-refinance-calculator": RefreshCw,
  "retirement-savings-calculator": PiggyBank,
  "401k-calculator": Briefcase,
  "credit-card-payoff-calculator": CreditCard,
  "debt-payoff-calculator": TrendingDown,
  "roi-calculator": BadgePercent,
  "savings-goal-calculator": Target,
  "cd-calculator": Banknote,
  "simple-interest-calculator": Percent,
  "home-affordability-calculator": Home,
  "inflation-calculator": Flame,
  "sales-tax-calculator": Receipt,
  "vat-calculator": Coins,
  // auto
  "auto-loan-calculator": Car,
  "auto-lease-calculator": CarFront,
  // business
  "margin-markup-calculator": Percent,
  "break-even-calculator": Scale,
  "discount-calculator": Tag,
  // health
  "bmi-calculator": Scale,
  "calorie-calculator": Flame,
  "body-fat-calculator": PersonStanding,
  "bmr-calculator": Gauge,
  "ideal-weight-calculator": Ruler,
  "macro-calculator": Apple,
  "ovulation-calculator": HeartPulse,
  "due-date-calculator": Baby,
  "one-rep-max-calculator": Dumbbell,
  "water-intake-calculator": Droplet,
  // datetime
  "date-difference-calculator": CalendarRange,
  "age-calculator": Cake,
  "countdown-calculator": Timer,
  "business-days-calculator": CalendarCheck,
  "time-duration-calculator": Clock,
  // math
  "percentage-calculator": Percent,
  "gpa-calculator": GraduationCap,
  "fraction-calculator": Divide,
  "standard-deviation-calculator": Sigma,
  "roman-numeral-converter": Hash,
  // conversions
  "unit-converter": Ruler,
  "currency-converter": ArrowLeftRight,
  "fuel-economy-converter": Fuel,
  "cooking-conversion-calculator": CookingPot,
  // home & diy
  "paint-calculator": PaintRoller,
  "square-footage-calculator": Square,
};

const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  finance: Landmark,
  auto: Car,
  business: Briefcase,
  health: HeartPulse,
  datetime: CalendarClock,
  math: Calculator,
  conversions: Repeat,
  homediy: Home,
};

export function iconForCalc(calc: CalcDef): LucideIcon {
  return CALC_ICONS[calc.slug] ?? CATEGORY_ICONS[calc.category] ?? Calculator;
}

/** Tinted rounded-square icon tile for a calculator, using its category accent. */
export function CalcBadge({
  calc,
  size = 18,
  tile = 38,
}: {
  calc: CalcDef;
  size?: number;
  tile?: number;
}) {
  const Icon = iconForCalc(calc);
  const accent = getCategory(calc.category).accent;
  return (
    <span
      className="grid place-items-center rounded-xl shrink-0"
      style={{
        width: tile,
        height: tile,
        background: `${accent}1a`,
        color: accent,
      }}
    >
      <Icon size={size} strokeWidth={2} aria-hidden />
    </span>
  );
}

/** Tinted rounded-square icon tile for a category. */
export function CategoryBadge({
  cat,
  size = 22,
  tile = 48,
}: {
  cat: CategoryDef;
  size?: number;
  tile?: number;
}) {
  const Icon = CATEGORY_ICONS[cat.id] ?? Calculator;
  return (
    <span
      className="grid place-items-center rounded-2xl shrink-0"
      style={{
        width: tile,
        height: tile,
        background: `${cat.accent}1a`,
        color: cat.accent,
      }}
    >
      <Icon size={size} strokeWidth={2} aria-hidden />
    </span>
  );
}
