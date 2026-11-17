"use client";

import { useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { track } from "@/lib/track";

/** "Copy result" (a text summary) + "Copy link" (the current shareable URL). */
export function ResultActions({ summary }: { summary: string }) {
  const [copied, setCopied] = useState(false);
  const [linked, setLinked] = useState(false);

  async function write(text: string, mark: (v: boolean) => void, method: "copy_result" | "copy_link") {
    const tool = window.location.pathname.split("/").pop();
    track("share", { method, tool, item: tool });
    try {
      await navigator.clipboard.writeText(text);
      mark(true);
      setTimeout(() => mark(false), 1600);
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  const btn =
    "inline-flex items-center gap-1.5 rounded-lg border border-[var(--rule-strong)] bg-[var(--paper-2)] px-3 py-1.5 text-sm font-medium hover:border-[var(--accent)] transition-colors";

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className={btn} onClick={() => write(summary, setCopied, "copy_result")}>
        {copied ? (
          <Check size={15} className="text-[var(--good)]" />
        ) : (
          <Copy size={15} className="text-[var(--ink-soft)]" />
        )}
        {copied ? "Copied" : "Copy result"}
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => write(window.location.href, setLinked, "copy_link")}
      >
        {linked ? (
          <Check size={15} className="text-[var(--good)]" />
        ) : (
          <Link2 size={15} className="text-[var(--ink-soft)]" />
        )}
        {linked ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
