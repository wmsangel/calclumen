import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { spotlightOfWeek } from "@/lib/spotlight";

/**
 * "Spotlight this week" — one rotating internal link to a flagship money page,
 * pillar guide or new tool. Server-rendered so the link is in the static HTML
 * (crawlable internal link), rotating weekly by ISO week. See @/lib/spotlight.
 */
export function Spotlight({ locale }: { locale: Locale }) {
  const item = spotlightOfWeek();
  return (
    <section className="py-8 border-b border-[var(--rule)]">
      <Link
        href={`/${locale}${item.path}`}
        className="group block rounded-2xl border border-[var(--rule)] bg-[var(--accent-soft)] p-5 sm:p-6 transition hover:border-[var(--accent)]"
      >
        <div className="flex items-center gap-2 text-[var(--accent-2)]">
          <Sparkles size={16} />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Spotlight this week
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2.5 flex-wrap">
          <h2 className="display text-xl sm:text-2xl text-[var(--ink)]">
            {item.title}
          </h2>
          <span className="badge-new">{item.badge}</span>
        </div>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)] leading-relaxed">
          {item.blurb}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
          Open it
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </Link>
    </section>
  );
}
