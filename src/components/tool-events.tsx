"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

/**
 * Fires `tool_opened` once per mount for pages that are tools but don't use
 * CalcShell (the programmatic converters/math pages). `tool` is the cluster
 * (units, data, combinations…), `item` the page slug — so funnels aggregate per
 * cluster without a 2,900-value dimension. Weekly events review 24.11: these
 * pages were ~half of landings and had no events at all.
 */
export function ToolEvents({ tool, item }: { tool: string; item: string }) {
  useEffect(() => {
    track("tool_opened", { tool, item });
  }, [tool, item]);
  return null;
}
