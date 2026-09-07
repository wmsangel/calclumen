// Incremental IndexNow submission for Bing / Yandex / Seznam / Naver.
//
// Bing flags large "batch mode" submissions (dumping the whole sitemap), so
// this only sends URLs that are NEW since the last run — tracked in
// scripts/indexnow-state.json — in small batches.
//
//   node scripts/indexnow.mjs           submit URLs new since the last run
//   node scripts/indexnow.mjs --init    record the current sitemap as already
//                                       submitted WITHOUT sending anything
//                                       (baseline — run once after a bulk send)
//   node scripts/indexnow.mjs --urls a,b,c   submit specific URLs (e.g. pages
//                                            whose content changed)
//
// Requires the key file public/<KEY>.txt to be live on the domain.

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const HOST = "calclumen.com";
const KEY = "bdb31efbfd917f16bce05719fc9532b6";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP = `https://${HOST}/sitemap.xml`;
const STATE = new URL("./indexnow-state.json", import.meta.url);
const BATCH = 500; // keep each POST small — never dump thousands at once
const MAX_INCREMENTAL = 2000; // safety: refuse a giant "incremental" run

const arg = process.argv[2] ?? "";

async function fetchSitemapUrls() {
  const res = await fetch(SITEMAP);
  if (!res.ok) {
    console.error(`Could not fetch sitemap (${res.status}).`);
    process.exit(1);
  }
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function loadSubmitted() {
  if (!existsSync(STATE)) return new Set();
  try {
    return new Set(JSON.parse(readFileSync(STATE, "utf8")).submitted ?? []);
  } catch {
    return new Set();
  }
}

function saveSubmitted(urls) {
  const data = { updated: new Date().toISOString(), submitted: [...urls].sort() };
  writeFileSync(STATE, JSON.stringify(data, null, 2) + "\n");
}

async function submit(urls) {
  for (let i = 0; i < urls.length; i += BATCH) {
    const urlList = urls.slice(i, i + BATCH);
    const r = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
    });
    console.log(`Submitted ${urlList.length} URLs → HTTP ${r.status}`);
  }
}

const current = await fetchSitemapUrls();

// --init: baseline the current sitemap as submitted, send nothing.
if (arg === "--init") {
  saveSubmitted(new Set(current));
  console.log(`Baseline recorded: ${current.length} URLs marked submitted (nothing sent).`);
  process.exit(0);
}

// --urls a,b,c: submit specific URLs (e.g. content that changed).
if (arg === "--urls") {
  const urls = (process.argv[3] ?? "").split(",").map((u) => u.trim()).filter(Boolean);
  if (urls.length === 0) {
    console.error("No URLs given. Usage: --urls https://…,https://…");
    process.exit(1);
  }
  await submit(urls);
  const merged = new Set([...loadSubmitted(), ...urls, ...current]);
  saveSubmitted(merged);
  console.log("Done (specific URLs).");
  process.exit(0);
}

// Default: submit only URLs new since the last run.
const submitted = loadSubmitted();
const isNew = current.filter((u) => !submitted.has(u));
console.log(`Sitemap: ${current.length} URLs, ${isNew.length} new since last run.`);

if (isNew.length === 0) {
  console.log("Nothing new to submit.");
  process.exit(0);
}
if (isNew.length > MAX_INCREMENTAL) {
  console.error(
    `Refusing to submit ${isNew.length} URLs incrementally — this looks like a first run with no baseline. ` +
      `Run "node scripts/indexnow.mjs --init" once to set the baseline, then re-run.`,
  );
  process.exit(1);
}

await submit(isNew);
saveSubmitted(new Set(current));
console.log("Done. Only the newly published URLs were submitted.");
