// Our own network of sister sites. These render as normal FOLLOW links
// (not sponsored/nofollow like affiliate offers) so the cross-links pass
// SEO value between the sites we own — reciprocal promotion + backlinks.

export interface NetworkSite {
  name: string;
  url: string;
  blurb: string;
  cta?: string;
}

export const NETWORK_SITES: NetworkSite[] = [
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
    // TODO: confirm exact positioning with the owner.
    blurb:
      "Quick online testing and checkup tools that run right in your browser.",
    cta: "Visit TestSweep",
  },
];
