const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  JPY: "¥",
  CNY: "¥",
  INR: "₹",
  CHF: "CHF ",
  MXN: "MX$",
  BRL: "R$",
  ZAR: "R",
};

export const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "JPY",
  "CNY",
  "INR",
  "CHF",
  "MXN",
  "BRL",
  "ZAR",
] as const;

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** 1234.5 -> "1,234.50" (or custom fraction digits). */
export function formatNumber(n: number, digits = 2): string {
  return (Number.isFinite(n) ? n : 0).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatMoney(amount: number, currency = "USD"): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? "";
  const digits = currency === "JPY" ? 0 : 2;
  const formatted = formatNumber(Number(amount) || 0, digits);
  return symbol ? `${symbol}${formatted}` : `${formatted} ${currency}`;
}

export function formatPercent(value: number, digits = 1): string {
  return `${(Number.isFinite(value) ? value : 0).toFixed(digits)}%`;
}

export function currencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] ?? "";
}
