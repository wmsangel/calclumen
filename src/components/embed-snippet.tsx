"use client";

import { useState } from "react";
import { Code2, Check, Copy } from "lucide-react";

/**
 * "Embed this calculator" panel. Shows a copy-paste snippet whose visible
 * do-follow <a> lives in the HOST page's HTML (that anchor passes link equity
 * to us; the iframe itself does not). Rendered only for embeddable calculators.
 */
export function EmbedSnippet({
  heading,
  src,
  canonical,
  height,
}: {
  heading: string;
  src: string;
  canonical: string;
  height: number;
}) {
  const [copied, setCopied] = useState(false);

  const snippet =
    `<iframe src="${src}" title="${heading} by CalcLumen" ` +
    `width="100%" height="${height}" loading="lazy" ` +
    `style="border:0;width:100%;max-width:680px"></iframe>\n` +
    `<p style="font:13px/1.5 system-ui,sans-serif;margin:8px 0 0">Powered by ` +
    `<a href="${canonical}" target="_blank" rel="noopener">${heading} — CalcLumen</a></p>`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context) — select-all fallback.
      const el = document.getElementById("embed-code") as HTMLTextAreaElement | null;
      el?.select();
    }
  }

  return (
    <details className="mt-12 card p-0 overflow-hidden no-print">
      <summary className="cursor-pointer list-none flex items-center gap-2.5 p-4 font-semibold">
        <span className="grid place-items-center w-9 h-9 rounded-xl bg-[var(--accent-soft)] text-[var(--accent-2)] shrink-0">
          <Code2 size={18} />
        </span>
        <span className="flex-1">Embed this calculator on your site</span>
        <span className="text-[var(--accent)] text-sm">Free</span>
      </summary>

      <div className="border-t border-[var(--rule)] p-4">
        <p className="text-sm text-[var(--ink-soft)]">
          Copy this code into your page — your readers get the live calculator,
          and it&apos;s free to use. Keeping the credit link is required.
        </p>

        <div className="relative mt-3">
          <textarea
            id="embed-code"
            readOnly
            value={snippet}
            rows={4}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full resize-none rounded-xl border border-[var(--rule)] bg-[var(--paper)] p-3 pr-24 font-mono text-xs leading-relaxed text-[var(--ink)]"
          />
          <button
            type="button"
            onClick={copy}
            className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </details>
  );
}
