"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getCalc, type CalcDef } from "@/lib/calculators/registry";
import { FAV_EVENT, getFavorites, getRecent } from "@/lib/favorites";
import { CalcBadge } from "./calc-icon";

function resolve(slugs: string[]): CalcDef[] {
  return slugs.map(getCalc).filter((c): c is CalcDef => Boolean(c));
}

function Row({ locale, calcs }: { locale: Locale; calcs: CalcDef[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {calcs.map((calc) => (
        <Link
          key={calc.slug}
          href={`/${locale}/${calc.slug}`}
          className="card card-hover p-4 flex items-center gap-3"
        >
          <CalcBadge calc={calc} size={16} tile={34} />
          <span className="font-medium text-sm">{calc.title}</span>
        </Link>
      ))}
    </div>
  );
}

/** Home section showing the visitor's saved and recently used calculators. */
export function MyCalculators({ locale }: { locale: Locale }) {
  const [favs, setFavs] = useState<CalcDef[]>([]);
  const [recent, setRecent] = useState<CalcDef[]>([]);

  useEffect(() => {
    const load = () => {
      const favSlugs = getFavorites();
      setFavs(resolve(favSlugs));
      setRecent(resolve(getRecent(6).filter((s) => !favSlugs.includes(s))));
    };
    load();
    window.addEventListener(FAV_EVENT, load);
    return () => window.removeEventListener(FAV_EVENT, load);
  }, []);

  if (favs.length === 0 && recent.length === 0) return null;

  return (
    <section className="py-8 border-b border-[var(--rule)]">
      {favs.length > 0 && (
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <span className="text-[var(--accent)]">★</span> Your favorites
          </h2>
          <Row locale={locale} calcs={favs} />
        </div>
      )}
      {recent.length > 0 && (
        <div className={favs.length > 0 ? "mt-8" : ""}>
          <h2 className="text-lg font-semibold mb-4">Recently used</h2>
          <Row locale={locale} calcs={recent} />
        </div>
      )}
    </section>
  );
}
