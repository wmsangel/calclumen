// Submit every URL in the sitemap to IndexNow (Bing, Yandex, Seznam, Naver,
// DuckDuckGo). Run once after a deploy:  node scripts/indexnow.mjs
//
// Requires the key file public/<KEY>.txt to be live on the domain.

const HOST = "calclumen.com";
const KEY = "bdb31efbfd917f16bce05719fc9532b6";
const SITEMAP = `https://${HOST}/sitemap.xml`;

const res = await fetch(SITEMAP);
if (!res.ok) {
  console.error(`Could not fetch sitemap (${res.status}).`);
  process.exit(1);
}
const xml = await res.text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`Found ${urls.length} URLs in the sitemap.`);

for (let i = 0; i < urls.length; i += 10000) {
  const urlList = urls.slice(i, i + 10000);
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  };
  const r = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  console.log(`Submitted ${urlList.length} URLs → HTTP ${r.status}`);
}
console.log("Done. Bing/Yandex/Seznam/Naver will crawl these soon.");
