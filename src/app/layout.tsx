import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/seo/site";
// AdSense / Google Analytics / Cloudflare beacon / PWA register are mounted in
// the [locale] layout, NOT here — so they load on the public site but never on
// the chrome-less /embed/* pages (AdSense auto-ads must not run inside an iframe
// on third-party sites, and embed loads shouldn't pollute our analytics).
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  formatDetection: { telephone: false },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "default" },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
    // Let search engines show large image thumbnails and full-length text
    // snippets for our pages (better SERP appearance and CTR).
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "0cUYNZmd0xq1DTEIVY6InfTyVaBldVyBVGgtQaSMpjE",
    // Optional: set these in Vercel env to verify Yandex / Bing without a redeploy.
    ...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION
      ? { yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION }
      : {}),
    other: {
      // Mitgo / Admitad publisher verification.
      "mitgo-verification": "9a011d91-558b-4e4a-a57a-b44f7dd37247",
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION }
        : {}),
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f3" },
    { media: "(prefers-color-scheme: dark)", color: "#17181b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[var(--paper)] text-[var(--ink)]">
        <Script id="ec-theme-init" strategy="beforeInteractive">
          {"try{var t=localStorage.getItem('ec-theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t}}catch(e){}"}
        </Script>
        {children}
      </body>
    </html>
  );
}
