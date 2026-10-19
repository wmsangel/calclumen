"use client";

import { track } from "@/lib/track";

/**
 * Client wrapper for a single Amazon Associates link so the click can fire the
 * network-standard `affiliate_click` event (the parent card is a server
 * component). `item` = a short stable product slug (the breakdown key),
 * `placement` = "materials", `platform` = "amazon". `href` is our internal
 * /go/<slug> cloak, which 302-redirects to the tagged amazon.com URL (see
 * next.config.ts + robots Disallow:/go/) so crawlers stop inflating the
 * Associates click count. Link is rel="sponsored nofollow noopener".
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
      rel="sponsored nofollow noopener"
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
