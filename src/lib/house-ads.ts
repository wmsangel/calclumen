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
    tagline: "69+ free crypto calculators — profit, fees, DCA and more.",
    url: "https://thecryptotools.com/",
    accent: "#f59e0b",
  },
  {
    id: "izngames",
    name: "izn.games",
    tagline: "Free browser games — 2048, Tetris, Sudoku and dozens more.",
    url: "https://izngames.com/",
    accent: "#2563eb",
  },
  {
    id: "costtrek",
    name: "CostTrek",
    tagline: "Compare the cost of living between cities worldwide.",
    url: "https://costtrek.com/",
    accent: "#0d9488",
  },
  {
    id: "iznkit",
    name: "iznkit",
    tagline: "Free tools that generate clean, ready-to-send PDFs.",
    url: "https://iznkit.com/",
    accent: "#7c3aed",
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
    tagline: "Practical home-renovation advice and guides.",
    url: "https://prodom-expert.ru/",
    accent: "#ea580c",
    lang: "RU",
  },
];
