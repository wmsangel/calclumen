"use client";

// A money/amount input that shows thousands separators as you type
// ("250,000") while keeping the raw numeric string in state, so existing
// calculator math (Number(value)) works unchanged.

function withCommas(raw: string): string {
  if (raw === "" || raw === "-") return raw;
  const neg = raw.startsWith("-");
  const body = neg ? raw.slice(1) : raw;
  const [int, ...rest] = body.split(".");
  const intGrouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const hasDot = body.includes(".");
  const dec = rest.join("");
  return (neg ? "-" : "") + intGrouped + (hasDot ? "." + dec : "");
}

export function NumberInput({
  value,
  onChange,
  className = "field",
  ...rest
}: {
  value: string;
  onChange: (raw: string) => void;
  className?: string;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type"
>) {
  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/,/g, "");
    if (raw === "" || /^-?\d*\.?\d*$/.test(raw)) onChange(raw);
  }
  return (
    <input
      {...rest}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      className={className}
      value={withCommas(value)}
      onChange={handle}
    />
  );
}
