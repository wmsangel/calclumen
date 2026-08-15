"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/** Light/dark toggle. Overrides the system preference and persists the choice. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const forced = document.documentElement.dataset.theme as Theme | "" | undefined;
    const current =
      forced === "dark" || forced === "light"
        ? forced
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    setTheme(current);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("ec-theme", next);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title="Toggle theme"
      className="grid place-items-center w-9 h-9 rounded-lg border border-[var(--rule-strong)] bg-[var(--paper-2)] text-[var(--ink-soft)] hover:text-[var(--ink)] hover:border-[var(--accent)] transition-colors"
      style={{ visibility: mounted ? "visible" : "hidden" }}
    >
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
