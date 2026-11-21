"use client";

import { track } from "@/lib/track";

/** Modest studio signature next to the copyright (network rule 20.11.2026):
 *  brand anchor only, rel="nofollow noopener", outbound_click event. */
export function StudioCredit() {
  return (
    <span>
      Made by{" "}
      <a
        href="https://izagorodnyi.dev"
        target="_blank"
        rel="nofollow noopener"
        className="hover:text-[var(--accent)]"
        onClick={() => track("outbound_click", { host: "izagorodnyi.dev", placement: "footer" })}
      >
        izagorodnyi.dev
      </a>
    </span>
  );
}
