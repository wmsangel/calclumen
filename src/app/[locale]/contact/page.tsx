import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, Bug, Lightbulb, Megaphone } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE_NAME } from "@/lib/seo/site";

const EMAIL = "contact@calclumen.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({
    locale,
    path: "contact",
    title: `Contact ${SITE_NAME}`,
    description: `Get in touch with ${SITE_NAME} — report a mistake, suggest a calculator, or ask about advertising.`,
  });
}

const reasons = [
  {
    icon: Bug,
    title: "Report a mistake",
    text: "If a calculator gives a wrong or confusing result, tell us the tool and the numbers you entered so we can fix it fast.",
  },
  {
    icon: Lightbulb,
    title: "Suggest a calculator",
    text: "Missing a tool you'd use? Send the idea — a lot of what we build comes straight from requests.",
  },
  {
    icon: Megaphone,
    title: "Advertising & business",
    text: "For partnership or advertising enquiries, drop us a line with a few details.",
  },
];

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="display text-3xl sm:text-4xl">Contact us</h1>
      <p className="mt-4 text-lg text-[var(--ink-soft)] leading-relaxed">
        We&rsquo;re a small, independent project and we read every message.
        The best way to reach us is by email.
      </p>

      <a
        href={`mailto:${EMAIL}`}
        className="mt-6 inline-flex items-center gap-2 btn-primary"
      >
        <Mail size={18} /> {EMAIL}
      </a>

      <h2 className="text-xl font-semibold mt-12 mb-4">What to write about</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {reasons.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.title} className="card p-5">
              <span
                className="grid place-items-center w-10 h-10 rounded-xl"
                style={{
                  background: "var(--accent-soft)",
                  color: "var(--accent-2)",
                }}
              >
                <Icon size={20} />
              </span>
              <h3 className="font-semibold mt-3">{r.title}</h3>
              <p className="mt-1.5 text-sm text-[var(--ink-soft)] leading-snug">
                {r.text}
              </p>
            </div>
          );
        })}
      </div>

      <h2 className="text-xl font-semibold mt-12 mb-2">Response time</h2>
      <p className="text-[var(--ink-soft)] leading-relaxed mt-3">
        We usually reply within a couple of business days. Corrections to a
        calculator are our top priority — if something&rsquo;s wrong, we want to
        know.
      </p>

      <p className="text-sm text-[var(--ink-soft)] mt-8">
        Looking for how we handle your data? See our{" "}
        <Link href={`/${locale}/privacy`} className="prose-link">
          privacy policy
        </Link>
        .
      </p>
    </div>
  );
}
