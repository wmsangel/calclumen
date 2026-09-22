import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Heart } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE_NAME } from "@/lib/seo/site";
import { SupportPanel } from "@/components/support-panel";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({
    locale,
    path: "support",
    title: `Support ${SITE_NAME}`,
    description: `${SITE_NAME} is free and ad-supported. If a calculator saved you time, you can leave a crypto tip — or help for free by sharing or linking to us.`,
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
      <span
        className="grid place-items-center w-12 h-12 rounded-2xl"
        style={{ background: "var(--accent-soft)", color: "var(--accent-2)" }}
      >
        <Heart size={24} />
      </span>
      <h1 className="display text-3xl sm:text-4xl mt-4">Support {SITE_NAME}</h1>
      <p className="mt-4 text-lg text-[var(--ink-soft)] leading-relaxed">
        {SITE_NAME}{" "}is a small, independent project. Every calculator is free,
        with no signup and no paywall. If one saved you time and you&rsquo;d
        like to say thanks, you can leave a crypto tip below — but there are
        free ways to help too, and they matter just as much.
      </p>

      <SupportPanel />

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Where your support goes</h2>
        <p className="mt-3 text-[var(--ink-soft)] leading-relaxed">
          Tips go straight back into the site: hosting and domain costs,
          building new calculators, and keeping everything fast, free and free
          of signups. There&rsquo;s no team and no investors — it&rsquo;s a
          one-person project, so even a small tip is genuinely appreciated.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Good to know</h2>
        <ul className="mt-3 space-y-2 text-[var(--ink-soft)] leading-relaxed list-disc pl-5">
          <li>
            Tips are completely voluntary. They don&rsquo;t unlock features or
            remove ads — everything on the site is already free for everyone.
          </li>
          <li>
            Crypto transfers are irreversible. Double-check the network and
            address, and send a small test amount first.
          </li>
          <li>
            Send only the asset shown for each network. A transfer on the wrong
            network cannot be recovered.
          </li>
          <li>
            In some countries, gifting or receiving crypto can be a taxable
            event. If in doubt, check your local rules.
          </li>
        </ul>
      </section>
    </div>
  );
}
