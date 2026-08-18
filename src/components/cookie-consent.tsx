"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { updateConsent } from "@/lib/consent";

const STORAGE_KEY = "ec-consent";

export function CookieConsent({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== "all" && stored !== "essential") {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable — show the banner so consent can still be given
      setVisible(true);
    }
  }, []);

  function choose(value: "all" | "essential") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore write failures (e.g. private mode)
    }
    // Google Consent Mode v2: unlock analytics/ads only on "Accept all".
    updateConsent(value === "all");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 no-print bg-[var(--paper-2)] border-t border-[var(--rule)] shadow-lg">
      <div className="mx-auto max-w-6xl px-5 py-4 flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-[var(--ink-soft)] leading-relaxed flex-1">
          We use cookies for analytics and ads. See our{" "}
          <Link href={`/${locale}/cookies`} className="prose-link">
            cookie
          </Link>{" "}
          policy.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => choose("essential")}
          >
            Reject non-essential
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => choose("all")}
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
