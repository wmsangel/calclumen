"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/track";

/**
 * Wraps a calculator and fires a single `calculator_use` event the first time
 * the visitor changes any input inside it — a real-engagement signal (not just
 * a page view). Uses a native capturing-free listener on the wrapper so it
 * catches input/change from any field in the calculator subtree. Fires at most
 * once per mount; safe no-op when analytics isn't loaded.
 */
export function CalcUseTracker({ slug, children }: { slug: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onUse = () => {
      if (fired.current) return;
      fired.current = true;
      track("calculator_use", { calc: slug });
    };
    el.addEventListener("input", onUse);
    el.addEventListener("change", onUse);
    return () => {
      el.removeEventListener("input", onUse);
      el.removeEventListener("change", onUse);
    };
  }, [slug]);

  return <div ref={ref}>{children}</div>;
}
