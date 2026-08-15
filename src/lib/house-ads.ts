// House ads: cross-promotion for our own network of sites, shown in the ad
// slots until real (AdSense) ads are live. Edit this list freely — remove or
// reorder to change what appears. `lang` just adds a small marker.

export interface Promo {
  id: string;
  name: string;
  tagline: string;
  url: string;
  accent: string;
  /** shown as a small marker when the target site is not in English */
  lang?: string;
}

export const PROMOS: Promo[] = [
  {
    id: "cryptotools",
    name: "The Crypto Tools",
    tagline: "Free crypto calculators & converters — profit, fees, and rates.",
    url: "https://thecryptotools.com/",
    accent: "#f59e0b",
  },
  {
    id: "zdorovie",
    name: "24 Zdorovie",
    tagline: "Health, nutrition and wellness guides.",
    url: "https://24zdorovie.com/",
    accent: "#e11d48",
    lang: "RU",
  },
  {
    id: "prodom",
    name: "ProDom Expert",
    tagline: "Practical real-estate advice and guides.",
    url: "https://prodom-expert.ru/",
    accent: "#2563eb",
    lang: "RU",
  },
];
