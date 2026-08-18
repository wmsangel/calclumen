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
  label: "Business tools you may like",
  offers: [
    // e.g. accounting/invoicing SaaS, payment processors, POS.
  ],
};

const HOME: OfferGroup = {
  label: "For your project",
  offers: [
    // e.g. home-improvement retailers, material suppliers, contractor lead-gen.
  ],
};

const PREGNANCY_SLUGS = new Set(["due-date-calculator", "ovulation-calculator"]);

/** The affiliate offer group for a calculator, or null (ads-only). */
export function offersForCalc(calc: CalcDef): OfferGroup | null {
  if (PREGNANCY_SLUGS.has(calc.slug)) return PREGNANCY;
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
