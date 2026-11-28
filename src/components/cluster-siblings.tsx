import Link from "next/link";
import { coreSiblings, isCoreCluster, type CoreCluster } from "@/lib/cluster-core";

/** Crawlable "values people look up next" — only on allowlisted cluster pages. */
export function ClusterSiblings({
  cluster,
  slug,
  locale,
  parent,
}: {
  cluster: CoreCluster;
  slug: string;
  locale: string;
  parent: { href: string; label: string };
}) {
  if (!isCoreCluster(cluster, slug)) return null;
  const sibs = coreSiblings(cluster, slug);
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">Values people look up next</h2>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">
        Need a different number? Use the full{" "}
        <Link href={`/${locale}${parent.href}`} className="prose-link">
          {parent.label}
        </Link>
        , or jump to a common value:
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {sibs.map((s) => (
          <Link key={s} href={`/${locale}/${cluster}/${s}`} className="chip">
            {s.replace(/-/g, " ")}
          </Link>
        ))}
      </div>
    </section>
  );
}
