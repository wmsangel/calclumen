import type { CalcDef } from "@/lib/calculators/registry";

// Intent-based affiliate recommendations. Each calculator maps to a
// monetization "cluster" (financial, fitness, pregnancy, auto, business,
// home). Add real affiliate offers to the arrays below as you join programs
// — the block only renders on a page when its cluster has ≥1 offer, so this
// is safe to ship empty.
//
// Compliance: links render with rel="sponsored nofollow", and the block
// shows an FTC affiliate disclosure. Affiliate links are allowed alongside
// Google AdSense.

export interface Offer {
  id: string;
  name: string;
  blurb: string;
  url: string;
  cta?: string;
  /** optional promo/deal pill, e.g. "15% OFF" */
  badge?: string;
}

export interface OfferGroup {
  /** heading shown above the offers */
  label: string;
  offers: Offer[];
}

// ── Clusters ─────────────────────────────────────────────────────
// Fill `offers` with your real affiliate links. Suggested programs are in
// the comments; leave empty to show nothing.
const FINANCIAL: OfferGroup = {
  label: "Financial services you may like",
  offers: [
    // e.g. mortgage/refi marketplaces, brokerages/robo-advisors,
    // high-yield savings, credit-card marketplaces, credit monitoring.
  ],
};

const DOCTRONIC: Offer = {
  id: "doctronic",
  name: "Doctronic",
  blurb:
    "Free AI health consults 24/7, or talk to a licensed U.S. doctor online — telehealth visits from $39.",
  url: "https://tsygg.com/g/7r1pt1n1fo45d9374ef3abb0242f2d/",
  cta: "Try Doctronic",
};

const FITNESS: OfferGroup = {
  label: "Health & wellness",
  offers: [DOCTRONIC],
};

const PREGNANCY: OfferGroup = {
  label: "For your pregnancy",
  offers: [
    // e.g. baby registries, prenatal vitamins, pregnancy apps.
  ],
};

const AUTO: OfferGroup = {
  label: "Car & driving services",
  offers: [
    // e.g. auto-loan / refi marketplaces, car insurance comparison.
  ],
};

// ── Live offers (named so the homepage pool can reuse them) ──────
const NORDVPN: Offer = {
  id: "nordvpn",
  name: "NordVPN",
  blurb:
    "Keep your work and financial data private with one of the most trusted VPNs — secure browsing on any network.",
  url: "https://qwpeg.com/g/mai1uhgx1645d9374ef3004ed038cb/",
  cta: "Get NordVPN",
};
const LENOVO: Offer = {
  id: "lenovo",
  name: "Lenovo",
  blurb:
    "Laptops, desktops and accessories for work and business, direct from the world's #1 PC maker.",
  url: "https://bednari.com/g/6iia5dppfe45d9374ef3cc01b591a8/",
  cta: "Shop Lenovo",
};
const PUREVPN: Offer = {
  id: "purevpn",
  name: "PureVPN",
  blurb:
    "Encrypt your connection and protect your data on any network with a fast, no-logs VPN.",
  url: "https://plrvq.com/c/ayvzzawv4045d9374ef3dd63dd688c/",
  cta: "Get PureVPN",
};
const COURSERA: Offer = {
  id: "coursera",
  name: "Coursera",
  blurb:
    "Earn certificates and specializations from top universities and companies like Yale, Google and IBM.",
  url: "https://thevospad.com/g/e7zq1rwhrg45d9374ef348547b1485/",
  cta: "Explore Coursera",
};
const OPENART: Offer = {
  id: "openart",
  name: "OpenArt AI",
  blurb:
    "Create images and video with fast AI generation tools — 15% off with code LEADS15.",
  url: "https://io0.xyz/6a885e9645132",
  cta: "Try OpenArt",
  badge: "15% OFF",
};
const EASEUS: Offer = {
  id: "easeus",
  name: "EaseUS",
  blurb:
    "Recover lost files, manage disks and back up data — trusted by 100M+ users.",
  url: "https://i0x.xyz/6a885f89c22cd",
  cta: "Get EaseUS",
  badge: "20% OFF",
};
const ADGUARD: Offer = {
  id: "adguard",
  name: "AdGuard",
  blurb:
    "Block ads and trackers and browse privately with AdGuard's ad blocker and VPN.",
  url: "https://dhwnh.com/g/xc497owldv45d9374ef3a9584d7a68/",
  cta: "Get AdGuard",
};
const PROHOSTER: Offer = {
  id: "prohoster",
  name: "ProHoster",
  blurb:
    "Reliable web hosting, VPS and dedicated servers from $2.5/mo with 24/7 support.",
  url: "https://ntzgd.com/g/gaetfoqpj745d9374ef3934d4157fe/",
  cta: "Try ProHoster",
};

const BUSINESS: OfferGroup = {
  label: "Tools you may like",
  offers: [NORDVPN, LENOVO, OPENART],
};

const HOME: OfferGroup = {
  label: "For your project",
  offers: [
    // e.g. home-improvement retailers, material suppliers, contractor lead-gen.
  ],
};

const TECH: OfferGroup = {
  label: "Tools & software you may like",
  offers: [EASEUS, PUREVPN],
};

const EDUCATION: OfferGroup = {
  label: "Level up your skills",
  offers: [COURSERA],
};

/**
 * Curated pool for the homepage. One offer per vertical (no duplicate
 * categories, so two VPNs never appear together). <HomeOffers/> shuffles it
 * client-side so the block rotates across visits. Safe to leave empty.
 */
export const HOME_OFFERS_LABEL = "Handpicked tools & deals";
export const HOME_FEATURED: Offer[] = [NORDVPN, COURSERA, LENOVO, OPENART, EASEUS, ADGUARD, PROHOSTER];

const PREGNANCY_SLUGS = new Set(["due-date-calculator", "ovulation-calculator"]);
// Tech-leaning converters: a developer/IT audience, the likeliest VPN buyers.
const TECH_SLUGS = new Set([
  "data-storage-converter",
  "number-base-converter",
]);
// Student / education pages.
const EDUCATION_SLUGS = new Set(["gpa-calculator", "grade-calculator"]);

/** The affiliate offer group for a calculator, or null (ads-only). */
export function offersForCalc(calc: CalcDef): OfferGroup | null {
  if (PREGNANCY_SLUGS.has(calc.slug)) return PREGNANCY;
  if (EDUCATION_SLUGS.has(calc.slug)) return EDUCATION;
  if (TECH_SLUGS.has(calc.slug)) return TECH;
  switch (calc.category) {
    case "finance":
      return FINANCIAL;
    case "auto":
      return AUTO;
    case "health":
      return FITNESS;
    case "business":
      return BUSINESS;
    case "homediy":
      return HOME;
    default:
      // math / datetime / conversions → AdSense only
      return null;
  }
}
