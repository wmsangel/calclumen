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

const FITNESS: OfferGroup = {
  label: "Fitness picks you may like",
  offers: [
    // e.g. meal-plan / macro apps, workout apps, smart scales,
    // fitness trackers, supplement brands.
  ],
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

const BUSINESS: OfferGroup = {
  label: "Tools you may like",
  offers: [
    {
      id: "nordvpn",
      name: "NordVPN",
      blurb:
        "Keep your work and financial data private with one of the most trusted VPNs — secure browsing on any network.",
      url: "https://qwpeg.com/g/mai1uhgx1645d9374ef3004ed038cb/",
      cta: "Get NordVPN",
    },
    {
      id: "lenovo",
      name: "Lenovo",
      blurb:
        "Laptops, desktops and accessories for work and business, direct from the world's #1 PC maker.",
      url: "https://bednari.com/g/6iia5dppfe45d9374ef3cc01b591a8/",
      cta: "Shop Lenovo",
    },
  ],
};

const HOME: OfferGroup = {
  label: "For your project",
  offers: [
    // e.g. home-improvement retailers, material suppliers, contractor lead-gen.
  ],
};

const TECH: OfferGroup = {
  label: "Online privacy & security",
  offers: [
    {
      id: "purevpn",
      name: "PureVPN",
      blurb:
        "Encrypt your connection and protect your data on any network with a fast, no-logs VPN.",
      url: "https://plrvq.com/c/ayvzzawv4045d9374ef3dd63dd688c/",
      cta: "Get PureVPN",
    },
  ],
};

const EDUCATION: OfferGroup = {
  label: "Level up your skills",
  offers: [
    {
      id: "coursera",
      name: "Coursera",
      blurb:
        "Earn certificates and specializations from top universities and companies like Yale, Google and IBM.",
      url: "https://thevospad.com/g/e7zq1rwhrg45d9374ef348547b1485/",
      cta: "Explore Coursera",
    },
  ],
};

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
