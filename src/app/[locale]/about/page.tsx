import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { calculators, categories } from "@/lib/calculators/registry";
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
    path: "about",
    title: `About ${SITE_NAME}`,
    description: `What ${SITE_NAME} is, how our calculators work, and how we keep them accurate.`,
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
      <h1 className="display text-3xl sm:text-4xl">About {SITE_NAME}</h1>
      <p className="mt-4 text-lg text-[var(--ink-soft)] leading-relaxed">
        {SITE_NAME} is a free collection of {calculators.length} calculators and
        converters for money, health, dates, math and everyday conversions — no
        signup, no clutter, just a clear answer the moment you type.
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-2">What we do</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        Every tool lives on its own page and does one job well — from a mortgage
        payment or compound-interest projection to BMI, a due date, or a unit
        conversion. Each page explains the formula in plain English and answers
        the questions people actually ask, so you understand the result and not
        just the number.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/${locale}/${cat.slug}`}
            className="chip"
          >
            {cat.title}
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-10 mb-2">How we keep it accurate</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        Our calculators use established, published formulas — standard loan
        amortization, the Mifflin-St Jeor equation for calories, the US Navy
        method for body fat, Naegele&rsquo;s rule for due dates, and so on. We
        show the method on each page so you can check the math yourself. When a
        tool relies on a reference table (tax rates, unit factors, indicative
        currency rates), we label it clearly and note when it was last updated.
      </p>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        That said, results are estimates for general information only and are not
        professional financial, medical, tax or legal advice. For decisions that
        matter, please check with a qualified professional.
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-2">Privacy first</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        {SITE_NAME} runs entirely in your browser — you don&rsquo;t need an
        account, and your inputs never leave your device. Favorites and
        preferences are stored locally on your device, not on our servers. See
        our{" "}
        <Link href={`/${locale}/privacy`} className="prose-link">
          privacy policy
        </Link>{" "}
        for the details.
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-2">Get in touch</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        Spotted a mistake, or want a calculator we don&rsquo;t have yet? We read
        every message — head to our{" "}
        <Link href={`/${locale}/contact`} className="prose-link">
          contact page
        </Link>
        .
      </p>
    </div>
  );
}
