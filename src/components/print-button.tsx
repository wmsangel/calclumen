"use client";

import { Printer } from "lucide-react";
import { track } from "@/lib/track";

/** Print / Save as PDF the current calculator (uses the browser print dialog). */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => {
        const tool = window.location.pathname.split("/").pop() || "page";
        track("print", { tool, item: tool });
        window.print();
      }}
      aria-label="Print or save as PDF"
      title="Print / Save as PDF"
      className="grid place-items-center w-9 h-9 rounded-lg border border-[var(--rule-strong)] bg-[var(--paper-2)] text-[var(--ink-soft)] hover:text-[var(--ink)] hover:border-[var(--accent)] transition-colors"
    >
      <Printer size={16} />
    </button>
  );
}
