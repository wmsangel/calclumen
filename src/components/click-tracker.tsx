"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";
import { goUrl } from "@/lib/gotoken";

/**
 * Delegated click handler for affiliate links (`a[data-go]`). The HTML carries
 * no partner or /go URL — only href="#" and data-go="<offer id>" (+ data-go-s
 * page slug). On a TRUSTED press (pointerdown/keydown/contextmenu/click/auxclick)
 * the tokenized /go URL is written into href just before the browser follows
 * it, so the navigation is still a real user-activated link click. Scripted
 * clicks keep "#" and are cancelled. Fires `affiliate_click` with the link's
 * data-aff-* attributes. See src/lib/gotoken.ts.
 */
function goAnchor(e: Event): HTMLAnchorElement | null {
  const el = e.target as HTMLElement | null;
  return (el?.closest?.("a[data-go]") as HTMLAnchorElement | null) ?? null;
}

function arm(e: Event): HTMLAnchorElement | null {
  const a = goAnchor(e);
  if (!a) return null;
  const id = a.dataset.go;
  if (!e.isTrusted || !id) return a;
  a.setAttribute("href", goUrl(id, a.dataset.goS));
  return a;
}

export function ClickTracker() {
  useEffect(() => {
    const onArm = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== "Enter") return;
      arm(e);
    };
    const onClick = (e: MouseEvent) => {
      if (e.type === "auxclick" && e.button !== 1) return;
      const a = arm(e);
      if (!a) return;
      if ((a.getAttribute("href") || "#") === "#") {
        e.preventDefault();
        return;
      }
      const d = a.dataset;
      track("affiliate_click", {
        item: d.affItem || d.go || "unknown",
        network: d.affNetwork,
        placement: d.affPlacement,
        tool: d.goS,
      });
    };
    const opts = { capture: true } as const;
    const armEvents = ["pointerdown", "mousedown", "touchstart", "keydown", "contextmenu"];
    for (const t of armEvents) document.addEventListener(t, onArm, opts);
    document.addEventListener("click", onClick, opts);
    document.addEventListener("auxclick", onClick, opts);
    return () => {
      for (const t of armEvents) document.removeEventListener(t, onArm, opts);
      document.removeEventListener("click", onClick, opts);
      document.removeEventListener("auxclick", onClick, opts);
    };
  }, []);
  return null;
}
