export function balanceAt(
  principal: number,
  annualRatePct: number,
  y: number,
  n: number,
  monthly: number,
) {
  const fvPrincipal = principal * Math.pow(1 + annualRatePct / 100 / n, n * y);
  const i = annualRatePct / 100 / 12;
  const N = 12 * y;
  const fvContributions =
    i === 0 ? monthly * N : monthly * ((Math.pow(1 + i, N) - 1) / i);
  return fvPrincipal + fvContributions;
}
