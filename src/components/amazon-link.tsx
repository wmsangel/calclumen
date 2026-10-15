"use client";

import { track } from "@/lib/track";

/**
 * Client wrapper for a single Amazon Associates link so the click can fire the
 * network-standard `affiliate_click` event (the parent card is a server
 * component). `item` = a short stable product slug (the breakdown key),
 * `placement` = "materials", `platform` = "amazon". The link itself stays
 * rel="sponsored nofollow" exactly as before.
 */
export function AmazonLink({
  href,
  item,
  children,
  className,
}: {
  href: string;
  item: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className={className}
      onClick={() =>
        track("affiliate_click", {
          item,
          placement: "materials",
          platform: "amazon",
        })
      }
    >
      {children}
    </a>
  );
}
