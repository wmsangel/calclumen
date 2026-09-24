"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Heart, MessageSquare, Send, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

const FEEDBACK_EMAIL = "info@calclumen.com";

/**
 * Small floating "Feedback" button (bottom-right). Opens a panel to report a
 * bug or suggest a calculator — delivered via a prefilled mailto that includes
 * the current page URL (no backend, uses the site's own email routing). A
 * quiet secondary link points to the Support page. Sits at z-40 so the cookie
 * consent bar (z-50) covers it on first visit, then it's clear in the corner.
 */
export function FeedbackFab({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function send() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const subject = `CalcLumen feedback${url ? ` — ${new URL(url).pathname}` : ""}`;
    const body = `${msg}\n\n—\nPage: ${url}`;
    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setOpen(false);
    setMsg("");
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 no-print flex flex-col items-end gap-3">
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Send feedback"
          className="card p-4 shadow-lg w-[min(20rem,calc(100vw-2rem))]"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Send feedback</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-[var(--ink-soft)] hover:text-[var(--ink)]"
            >
              <X size={16} />
            </button>
          </div>
          <p className="mt-1 text-xs text-[var(--ink-soft)] leading-snug">
            Found a wrong result, or want a calculator we don&rsquo;t have? Tell
            us — it really helps.
          </p>
          <textarea
            className="field mt-3 w-full h-24 resize-none text-sm"
            placeholder="What's wrong, or what would you like to see?"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            autoFocus
          />
          <button
            type="button"
            onClick={send}
            disabled={msg.trim() === ""}
            className="btn-primary mt-2 w-full justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} /> Send
          </button>
          <div className="mt-3 pt-3 border-t border-[var(--rule)] text-xs text-[var(--ink-soft)]">
            Enjoying CalcLumen?{" "}
            <Link
              href={`/${locale}/support`}
              className="prose-link inline-flex items-center gap-1"
              onClick={() => setOpen(false)}
            >
              Support us <Heart size={12} />
            </Link>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Send feedback"
        className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] text-[var(--on-accent)] pl-3.5 pr-4 py-2.5 shadow-lg hover:brightness-110 transition text-sm font-medium"
      >
        <MessageSquare size={16} />
        <span className="hidden sm:inline">Feedback</span>
      </button>
    </div>
  );
}
