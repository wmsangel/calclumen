// Our own network of sister sites. These render as normal FOLLOW links
// (not sponsored/nofollow like affiliate offers) so the cross-links pass
// SEO value between the sites we own — reciprocal promotion + backlinks.
//
// Scope: only the English, topically-adjacent tool/calculator sites are
// linked from CalcLumen — keeping the footer relevant to our audience and
// avoiding a cross-language sitewide-footer footprint. The Russian
// (prodom-expert.ru, 24zdorovie.com) and Kazakh (bilimjol.com) sites, and
// izngames.com, are deliberately left out here.

export interface NetworkSite {
  name: string;
  url: string;
  blurb: string;
  cta?: string;
}

export const NETWORK_SITES: NetworkSite[] = [
  {
    name: "CostTrek",
    url: "https://costtrek.com/en",
    blurb:
      "Compare the cost of living between cities and find the salary you'd need to keep your standard of living.",
    cta: "Open CostTrek",
  },
  {
    name: "TheCryptoTools",
    url: "https://thecryptotools.com/",
    blurb:
      "69+ free crypto calculators — profit/ROI, position size, liquidation, DCA and more. No signup.",
    cta: "Open TheCryptoTools",
  },
  {
    name: "iznkit",
    url: "https://iznkit.com/en",
    blurb:
      "30+ calculators and document generators that hand you a clean, branded PDF — invoices, quotes and more.",
    cta: "Open iznkit",
  },
  {
    name: "IZN Tools",
    url: "https://izntools.com/",
    blurb:
      "100 fast, private browser tools — image, SEO, developer and everyday utilities. No uploads, no signup.",
    cta: "Open IZN Tools",
  },
  {
    name: "TestSweep",
    url: "https://testsweep.com/",
    blurb:
      "Test your computer one part at a time — check your monitor, keyboard, mouse, mic, speakers and webcam right in the browser.",
    cta: "Try TestSweep",
  },
];
