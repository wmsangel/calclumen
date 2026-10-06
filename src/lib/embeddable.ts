// Calculators offered as an embeddable widget. Each embed gives the host site
// a copy-paste snippet: an <iframe> of the chrome-less /embed/<slug> page plus a
// visible do-follow "Powered by CalcLumen" link in the HOST page's own HTML.
// That anchor — not the iframe — is what passes link equity back to us, which
// directly attacks our #1 deficit (backlinks / authority). Model: Omni.
//
// Curated to flagship, broadly-embeddable tools (the kind a finance/DIY blog
// actually drops into a post), and the heights are tuned per tool so the iframe
// doesn't clip. Add a calculator here only after confirming it renders well
// standalone at the given height.

export interface Embeddable {
  slug: string;
  /** iframe height in px (tools with charts/tables need more room). */
  height: number;
}

export const EMBEDDABLE: Embeddable[] = [
  { slug: "loan-calculator", height: 580 },
  { slug: "mortgage-calculator", height: 780 },
  { slug: "compound-interest-calculator", height: 740 },
  { slug: "percentage-calculator", height: 560 },
  { slug: "tip-calculator", height: 600 },
  { slug: "bmi-calculator", height: 600 },
  { slug: "auto-loan-calculator", height: 640 },
  { slug: "salary-to-hourly-calculator", height: 580 },
];

const BY_SLUG = new Map(EMBEDDABLE.map((e) => [e.slug, e]));

export function embeddableFor(slug: string): Embeddable | null {
  return BY_SLUG.get(slug) ?? null;
}

export function isEmbeddable(slug: string): boolean {
  return BY_SLUG.has(slug);
}
