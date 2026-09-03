"use client";

import { useState } from "react";
import { Field, Stat, ToolCard } from "@/components/ui";

const ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen",
];
const TENS = [
  "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty",
  "ninety",
];
const SCALES = [
  "", "thousand", "million", "billion", "trillion", "quadrillion",
  "quintillion", "sextillion", "septillion", "octillion", "nonillion",
  "decillion",
];

const MAX_INT_DIGITS = SCALES.length * 3; // 36

function twoToWords(n: number): string {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return TENS[t] + (o ? `-${ONES[o]}` : "");
}

function threeToWords(n: number): string {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (h) parts.push(`${ONES[h]} hundred`);
  if (rest) parts.push(twoToWords(rest));
  return parts.join(" ");
}

/** Convert a string of digits (no sign) to English words. */
function intToWords(digits: string): string {
  const s = digits.replace(/^0+(?=\d)/, ""); // strip leading zeros
  if (s === "0" || s === "") return "zero";
  // pad to a multiple of 3
  const padded = s.padStart(Math.ceil(s.length / 3) * 3, "0");
  const groups: string[] = [];
  const groupCount = padded.length / 3;
  for (let i = 0; i < groupCount; i++) {
    const val = Number(padded.slice(i * 3, i * 3 + 3));
    if (val === 0) continue;
    const scale = SCALES[groupCount - 1 - i];
    groups.push(threeToWords(val) + (scale ? ` ${scale}` : ""));
  }
  return groups.join(" ");
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface Result {
  words: string;
  capitalized: string;
  cheque: string;
}

function convert(input: string): Result | null {
  const s = input.replace(/[,\s]/g, "");
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  const neg = s.startsWith("-");
  const body = neg ? s.slice(1) : s;
  const [intPart, fracPart = ""] = body.split(".");
  if (intPart.length > MAX_INT_DIGITS) return null;

  let words = intToWords(intPart);
  if (fracPart) {
    const spoken = fracPart
      .split("")
      .map((d) => ONES[Number(d)])
      .join(" ");
    words += ` point ${spoken}`;
  }
  if (neg) words = `negative ${words}`;

  // Cheque / currency (USD) style: "<Words> and NN/100"
  const cents = (fracPart + "00").slice(0, 2);
  const cheque = `${cap(neg ? `negative ${intToWords(intPart)}` : intToWords(intPart))} and ${cents}/100`;

  return { words, capitalized: cap(words), cheque };
}

export function NumberToWordsCalculator() {
  const [input, setInput] = useState("1234.56");
  const result = convert(input);

  return (
    <ToolCard>
      <div className="grid gap-4">
        <Field label="Number">
          <input
            className="field"
            type="text"
            inputMode="decimal"
            value={input}
            placeholder="e.g. 1,234.56"
            onChange={(e) => setInput(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-3">
        <Stat
          label="In words"
          accent
          value={result ? result.words : "—"}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat
            label="Capitalized"
            value={result ? result.capitalized : "—"}
          />
          <Stat
            label="Cheque style (USD)"
            value={result ? result.cheque : "—"}
          />
        </div>
      </div>

      {!result ? (
        <p className="mt-4 text-sm text-[var(--ink-soft)]">
          Enter a number (up to {MAX_INT_DIGITS} digits before the decimal).
        </p>
      ) : null}
    </ToolCard>
  );
}
