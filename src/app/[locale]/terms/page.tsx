import type { Metadata } from "next";
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
    path: "terms",
    title: `Terms of Use — ${SITE_NAME}`,
    description: `The terms that apply when you use ${SITE_NAME}: our calculators are for general information only, with no warranty, and are not professional advice.`,
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
      <h1 className="display text-3xl sm:text-4xl">Terms of Use</h1>
      <p className="text-[var(--ink-soft)] text-sm mt-2">
        Last updated: August 2026
      </p>

      <p className="text-[var(--ink-soft)] leading-relaxed mt-6">
        These Terms of Use govern your access to and use of {SITE_NAME}. By using
        the site, you agree to these terms. If you do not agree, please do not
        use the site.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        Information only, not professional advice
      </h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        Our calculators are provided for general information and educational
        purposes only. Results are estimates and simplifications. They are not
        financial, investment, tax, legal, medical, or other professional
        advice, and they should not be relied on as a substitute for the advice
        of a qualified professional. Always consult an appropriate professional
        before making decisions that depend on these calculations.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        No warranty or accuracy guarantee
      </h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        {SITE_NAME} is provided &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo; without warranties of any kind, express or implied. While
        we work to keep our calculators correct and up to date, we do not
        guarantee that results, content, or the site itself are accurate,
        complete, current, or error-free, or that the site will be available
        without interruption.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        Limitation of liability
      </h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        To the fullest extent permitted by law, {SITE_NAME} and its operators
        will not be liable for any loss or damage arising from your use of, or
        reliance on, the site or its calculators, including any direct, indirect,
        incidental, or consequential damages. You use the site and its results at
        your own risk.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Acceptable use</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        You agree to use {SITE_NAME} lawfully and not to:
      </p>
      <ul className="text-[var(--ink-soft)] leading-relaxed mt-3 list-disc pl-5 space-y-2">
        <li>
          interfere with, disrupt, or place an unreasonable load on the site or
          its infrastructure;
        </li>
        <li>
          attempt to gain unauthorized access to any part of the site or its
          systems;
        </li>
        <li>
          scrape, copy, or republish substantial parts of the site in a way that
          competes with it or misleads others; or
        </li>
        <li>
          use the site in any way that is unlawful or infringes the rights of
          others.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        Intellectual property
      </h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        The name {SITE_NAME}, the site design, text, and the calculators are
        owned by us or our licensors and are protected by applicable laws. You
        may use the calculators for your own personal or business decision-making,
        but you may not copy, redistribute, or create derivative works from the
        site&rsquo;s content without our permission, except as allowed by law.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Changes to these terms</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        We may update these Terms of Use from time to time. When we do, we will
        revise the &ldquo;Last updated&rdquo; date above. Your continued use of
        the site after changes take effect means you accept the revised terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Contact</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        If you have questions about these Terms of Use, email us at{" "}
        <a href="mailto:contact@calclumen.com" className="prose-link">
          contact@calclumen.com
        </a>
        .
      </p>
    </div>
  );
}
