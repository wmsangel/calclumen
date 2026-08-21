import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { typesForConverter, popularValues } from "@/lib/programmatic/units";

/**
 * "Popular conversions" hub for a converter page. Links to the most-searched
 * programmatic /units/ pages so search engines (and users) can reach them from
 * an indexable calculator page. Renders nothing if the converter has no
 * programmatic conversion types.
 */
export function ConversionLinks({
  locale,
  converterSlug,
}: {
  locale: Locale;
  converterSlug: string;
}) {
  const types = typesForConverter(converterSlug);
  if (types.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold">Popular conversions</h2>
      <div className="mt-4 space-y-5">
        {types.map((t) => {
          const fLabel = t.fromLabel ?? t.fromUnit;
          const tLabel = t.toLabel ?? t.toUnit;
          return (
            <div key={t.id}>
              <div className="text-sm font-medium text-[var(--ink-soft)] mb-2">
                {t.fromName} to {t.toName}
              </div>
              <div className="flex flex-wrap gap-2">
                {popularValues(t).map((v) => (
                  <Link
                    key={v}
                    href={`/${locale}/units/${v}-${t.fromUnit}-to-${t.toUnit}`}
                    className="chip"
                  >
                    {v} {fLabel} to {tLabel}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
