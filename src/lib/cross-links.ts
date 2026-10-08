// Permanent in-content do-follow links from a few money pages to topically
// adjacent sites in our own network. Unlike the footer "network" row (which
// search engines discount as sitewide boilerplate) and unlike the affiliate
// offers (rel="sponsored nofollow"), these are editorial, in-body, DO-FOLLOW
// links with a natural anchor — the one kind of cross-link that actually passes
// authority. Kept deliberately small (one per page, only where it genuinely
// helps the reader) so it reads as a recommendation, not a link scheme.
//
// Rendered as a normal prose paragraph right after the calculator's intro by
// <CalcShell>. Links are do-follow (rel="noopener" only — NOT nofollow).

export interface CrossLink {
  href: string;
  /** Sentence lead-in before the linked anchor. */
  before: string;
  /** The natural anchor text. */
  anchor: string;
  /** Sentence tail after the anchor. */
  after: string;
}

export const CROSS_LINKS: Record<string, CrossLink> = {
  "home-affordability-calculator": {
    href: "https://costtrek.com/en",
    before: "Thinking about moving for the home you can afford? It's worth comparing the ",
    anchor: "cost of living between two cities",
    after: " first — rent, groceries, transport and taxes can shift your budget more than the asking price does.",
  },
  "capital-gains-tax-calculator": {
    href: "https://thecryptotools.com",
    before: "If some of your gains come from crypto, a set of dedicated ",
    anchor: "crypto profit and DCA calculators",
    after: " can help you work out cost basis and returns across trades before you bring the totals here.",
  },
  "budget-calculator": {
    href: "https://ocrsnip.com",
    before: "Building a budget is far easier with real numbers: a tool that can ",
    anchor: "turn a bank or card statement into a spreadsheet",
    after: " lets you pull your actual spending by category instead of guessing.",
  },
  "margin-markup-calculator": {
    href: "https://iznkit.com/en",
    before: "Once your pricing is set, you can ",
    anchor: "generate an invoice or quote as a PDF",
    after: " to send the figures straight to a client.",
  },
};

export function crossLinkFor(slug: string): CrossLink | null {
  return CROSS_LINKS[slug] ?? null;
}
