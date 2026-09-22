"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  Link as LinkIcon,
  Share2,
  Star,
} from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

const REPO_URL = "https://github.com/wmsangel/calclumen";

// Addresses are validated at build time (base58check / length / regex) — see
// the commit that added this page. Do not edit by hand.
const WALLETS = [
  {
    id: "tron",
    chain: "TRON (TRC-20)",
    assets: "USDT",
    address: "TTYkkhf3Pbc3Vw8h8wt2Y1uEGfxmT1TcL6",
    qr: "/support/qr-tron.svg",
  },
  {
    id: "solana",
    chain: "Solana (SPL)",
    assets: "SOL, USDT",
    address: "He8CCQNSxyeGTiBG1EwxjbfNnQJndYB58jY15fBezyLX",
    qr: "/support/qr-solana.svg",
  },
  {
    id: "eth",
    chain: "Ethereum (ERC-20)",
    assets: "ETH, USDT, USDC",
    address: "0x80cda3f917b5cb07217bacc5d81605d406cbcfb8",
    qr: "/support/qr-eth.svg",
  },
];

const SHARE_URL = SITE_URL;
const SHARE_TEXT =
  "Free calculators for money, health and everyday math — fast and no signup.";

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          /* clipboard blocked — user can select manually */
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--rule)] px-3 py-1.5 text-sm font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
      aria-label={copied ? "Copied" : label}
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? "Copied!" : label}
    </button>
  );
}

export function SupportPanel() {
  const embed = `<a href="${SITE_URL}">${SITE_NAME} — free calculators</a>`;

  return (
    <div className="mt-8 space-y-8">
      {/* Network safety warning */}
      <div
        className="rounded-xl border p-4 flex gap-3"
        style={{ borderColor: "var(--warn, #d97706)", background: "var(--accent-soft)" }}
      >
        <AlertTriangle size={20} className="shrink-0 mt-0.5 text-[var(--accent-2)]" />
        <div className="text-sm leading-relaxed">
          <strong>Send only the listed asset on the listed network.</strong> A
          transfer on the wrong network is <strong>irreversible</strong> and the
          funds are lost. Always send a small test amount first. Do{" "}
          <strong>not</strong> use OKX &ldquo;X Layer&rdquo; — ordinary wallets
          cannot send to it.
        </div>
      </div>

      {/* Wallet cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {WALLETS.map((w) => (
          <div key={w.id} className="card p-5 flex flex-col items-center text-center">
            <div className="font-semibold">{w.chain}</div>
            <div className="text-xs text-[var(--ink-soft)] mt-0.5">
              Send: {w.assets}
            </div>
            <img
              src={w.qr}
              alt={`${w.chain} wallet QR code`}
              width={160}
              height={160}
              className="mt-4 rounded-lg bg-white p-2"
            />
            <code className="mt-4 block w-full break-all text-xs text-[var(--ink-soft)] font-mono">
              {w.address}
            </code>
            <div className="mt-3">
              <CopyButton text={w.address} label="Copy address" />
            </div>
          </div>
        ))}
      </div>

      {/* Free ways to help — drives backlinks (our #1 SEO gap) */}
      <div className="offer-panel">
        <h2 className="text-lg font-semibold">Free ways to help</h2>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          No money needed — a link or a share helps people find us and means a
          lot to a small independent project.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              SHARE_TEXT,
            )}&url=${encodeURIComponent(SHARE_URL)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--rule)] px-3 py-1.5 text-sm font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            <Share2 size={15} /> Share on X
          </a>
          <a
            href={`https://www.reddit.com/submit?url=${encodeURIComponent(
              SHARE_URL,
            )}&title=${encodeURIComponent(SHARE_TEXT)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--rule)] px-3 py-1.5 text-sm font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            <Share2 size={15} /> Share on Reddit
          </a>
          <CopyButton text={SHARE_URL} label="Copy link" />
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--rule)] px-3 py-1.5 text-sm font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            <Star size={15} /> Star on GitHub
          </a>
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-2 text-sm font-medium">
            <LinkIcon size={15} /> Link to us from your site
          </div>
          <div className="mt-2 flex items-start gap-2">
            <code className="flex-1 rounded-lg border border-[var(--rule)] bg-[var(--paper-2)] p-3 text-xs font-mono break-all">
              {embed}
            </code>
            <CopyButton text={embed} label="Copy" />
          </div>
        </div>
      </div>
    </div>
  );
}
