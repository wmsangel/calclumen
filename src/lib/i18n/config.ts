// Single-language site for now (English, Western SEO traffic), but the URL keeps a
// [locale] segment so more languages can be switched on later without a re-architecture.
export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
