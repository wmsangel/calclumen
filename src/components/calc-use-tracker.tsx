"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/track";

const DEBOUNCE_MS = 1500;

/**
 * Wraps a calculator and fires the network-standard tool events:
 *  - `tool_opened` {tool} once on mount (the calculator rendered for a visitor);
 *  - `tool_used` {tool} when the visitor calculates — any input/change inside
 *    the calculator, debounced so a burst of typing counts as one use.
 * `item` duplicates `tool` for the older breakdown convention. Safe no-op when
 * analytics isn't loaded (server, dev, /embed).
 */
export function CalcUseTracker({ slug, children }: { slug: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    track("tool_opened", { tool: slug, item: slug });
  }, [slug]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onUse = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        timer.current = null;
        track("tool_used", { tool: slug, item: slug, action: "calculate" });
      }, DEBOUNCE_MS);
    };
    el.addEventListener("input", onUse);
    el.addEventListener("change", onUse);
    return () => {
      el.removeEventListener("input", onUse);
      el.removeEventListener("change", onUse);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [slug]);

  return <div ref={ref}>{children}</div>;
}
