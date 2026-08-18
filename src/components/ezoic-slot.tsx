"use client";

import { useEffect } from "react";

// A single Ezoic ad placeholder. `id` is the numeric placeholder ID you create
// in the Ezoic dashboard (Ad Settings -> Placeholders), e.g. 101, 102.
// Renders <div id="ezoic-pub-ad-placeholder-101"/> and asks Ezoic to fill it,
// tearing it down on unmount so client-side route changes don't double-load.
declare global {
  interface Window {
    ezstandalone?: {
      cmd: Array<() => void>;
      showAds: (...ids: number[]) => void;
      destroyPlaceholders?: (...ids: number[]) => void;
    };
  }
}

export function EzoicSlot({ id, className = "" }: { id: number; className?: string }) {
  useEffect(() => {
    const ez = window.ezstandalone;
    if (!ez) return;
    ez.cmd.push(() => ez.showAds(id));
    return () => {
      const e = window.ezstandalone;
      if (e?.destroyPlaceholders) e.cmd.push(() => e.destroyPlaceholders!(id));
    };
  }, [id]);

  return <div id={`ezoic-pub-ad-placeholder-${id}`} className={className} />;
}
