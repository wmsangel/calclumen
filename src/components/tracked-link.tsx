"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track } from "@/lib/track";

/** next/link that fires the network-standard `cta_click` {placement, tool}. */
export function TrackedLink({
  placement,
  tool,
  onClick,
  ...props
}: ComponentProps<typeof Link> & { placement: string; tool?: string }) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        track("cta_click", { placement, tool, item: placement });
        onClick?.(e);
      }}
    />
  );
}
