// Per-calculator "last updated" dates from git history — honest freshness
// instead of a build timestamp. For every calculator page we take the latest
// commit touching the page file, its calculator component and its math module.
// Writes src/lib/generated/calc-updated.json ({ slug: "YYYY-MM-DD" }).
// Run before `next build` (prebuild + CI step). Needs full git history
// (actions/checkout fetch-depth: 0); with no git, existing values are kept.
import { execSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const APP = join(ROOT, "src/app/[locale]");
const OUT = join(ROOT, "src/lib/generated/calc-updated.json");

const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
const today = new Date().toISOString().slice(0, 10);

function gitDate(files) {
  try {
    const out = execSync(
      `git log -1 --format=%cI -- ${files.map((f) => JSON.stringify(f)).join(" ")}`,
      { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] },
    )
      .toString()
      .trim();
    return out ? out.slice(0, 10) : null;
  } catch {
    return null;
  }
}

function resolveImport(spec) {
  const rel = spec.replace(/^@\//, "src/");
  for (const ext of ["", ".ts", ".tsx", "/index.ts"]) {
    const p = join(ROOT, rel + ext);
    if (existsSync(p) && !readdirSafe(p)) return p;
  }
  return null;
}
function readdirSafe(p) {
  try {
    readdirSync(p);
    return true;
  } catch {
    return false;
  }
}

const result = {};
let fromGit = 0;
for (const dir of readdirSync(APP, { withFileTypes: true })) {
  if (!dir.isDirectory() || dir.name.startsWith("[")) continue;
  const page = join(APP, dir.name, "page.tsx");
  if (!existsSync(page)) continue;
  const src = readFileSync(page, "utf8");
  if (!src.includes("CalcShell")) continue; // calculators only
  const files = [page];
  for (const m of src.matchAll(/from\s+"(@\/(?:components\/calculators|lib\/math)\/[^"]+)"/g)) {
    const f = resolveImport(m[1]);
    if (f) files.push(f);
  }
  const d = gitDate(files);
  if (d) fromGit++;
  result[dir.name] = d ?? previous[dir.name] ?? today;
}

const sorted = Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(OUT, JSON.stringify(sorted, null, 2) + "\n");
console.log(`calc-updated: ${Object.keys(sorted).length} calculators, ${fromGit} dated from git`);
