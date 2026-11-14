import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE_NAME } from "@/lib/seo/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({
    locale,
    path: "advertising",
    title: `Advertising Disclosure — How ${SITE_NAME} Makes Money`,
    description: `${SITE_NAME} is free and funded by display ads and labelled affiliate links. What that means for you, how offers are chosen and why they never affect a calculator's results.`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="display text-3xl sm:text-4xl">Advertising disclosure</h1>
      <p className="text-[var(--ink-soft)] text-sm mt-2">Last updated: November 14, 2026</p>

      <p className="text-[var(--ink-soft)] leading-relaxed mt-6">
        All of {SITE_NAME}&rsquo;s calculators are free, with no account and no
        paywall. The site is paid for in two ways, both of which you can see on
        the page: display advertising and affiliate links. This page explains
        each one and the rules we follow.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Display advertising</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        We show display ads served by Google AdSense. Google selects the ads
        based on the page content and, where you have given consent, on your
        interests; we do not choose individual advertisers and have no
        relationship with them. Ads are shown in fixed slots and are never
        placed inside a calculator or its results. How advertising cookies and
        consent work is described in our{" "}
        <Link href={`/${locale}/privacy`} className="prose-link">
          privacy policy
        </Link>{" "}
        and{" "}
        <Link href={`/${locale}/cookies`} className="prose-link">
          cookie policy
        </Link>
        .
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Affiliate links</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        Some pages include a block of related products or services (for
        example &ldquo;Financial services you may like&rdquo; or &ldquo;Materials
        for this project&rdquo;). If you click one of those links and sign up or
        buy something, we may earn a commission from the partner at no extra cost
        to you. These blocks are always labelled, sit below the calculator and
        its explanation, and are chosen for topical fit — a loan comparison on a
        loan page, tools on a DIY page — not by who pays the most.
      </p>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        {SITE_NAME} participates in the Amazon Associates Program and in
        affiliate programs run by Admitad, Indoleads and individual merchants.
        As an Amazon Associate we earn from qualifying purchases.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">What advertising never changes</h2>
      <ul className="text-[var(--ink-soft)] leading-relaxed mt-3 list-disc pl-5 space-y-2">
        <li>The formula, default values or results of any calculator.</li>
        <li>Which calculators we build, or the order and wording of our explanations.</li>
        <li>The sources we cite — these are always primary, official sources.</li>
        <li>Your inputs: calculations run in your browser and are not shared with advertisers.</li>
      </ul>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        Our{" "}
        <Link href={`/${locale}/editorial-policy`} className="prose-link">
          editorial policy
        </Link>{" "}
        describes how calculators are built and checked. Questions about an ad or
        a partner link? Write to us via the{" "}
        <Link href={`/${locale}/contact`} className="prose-link">
          contact page
        </Link>
        .
      </p>
    </div>
  );
}
