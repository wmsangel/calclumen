import { ShoppingCart } from "lucide-react";
import { amazonFor, amazonSearchUrl } from "@/lib/amazon";
import { AmazonLink } from "./amazon-link";

/** Short, stable slug for the affiliate_click `item` param (the breakdown key). */
function productSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Native "materials / gear for this project" card for pages where a real
 * product is genuinely useful. Amazon Associates search links (tagged), text
 * only — no prices, no images (Amazon policy without the PA-API). Renders
 * nothing when the page has no mapped products. Links are rel="sponsored
 * nofollow" and the card carries the required Amazon disclosure.
 */
export function AmazonMaterials({ slug }: { slug: string }) {
  const block = amazonFor(slug);
  if (!block) return null;

  return (
    <section className="mt-12 no-print">
      <div className="offer-panel">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-7 h-7 rounded-lg bg-[var(--accent)] text-[var(--on-accent)] shrink-0">
            <ShoppingCart size={15} />
          </span>
          <h2 className="text-lg font-semibold">{block.label}</h2>
        </div>
        <p className="mt-1 text-xs text-[var(--ink-soft)]">
          As an Amazon Associate, {""}
          CalcLumen earns from qualifying purchases — at no extra cost to you.
        </p>

        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {block.items.map((item) => (
            <li key={item.name}>
              <AmazonLink
                href={amazonSearchUrl(item.q)}
                item={productSlug(item.name)}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--rule)] p-3 hover:border-[var(--accent)] transition"
              >
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-[var(--accent)] text-sm font-medium whitespace-nowrap">
                  on Amazon →
                </span>
              </AmazonLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
