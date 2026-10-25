# Cursor prompts — not-yet-implemented plan tasks

Self-contained prompts for Cursor, one file per open plan task that is cheap to delegate
(`→cursor`, or the replication half of a `→гибрид` task whose reference sample is already
built). Each prompt carries repo context, the exact pattern file to copy, what to build,
done criteria, and how to verify the build. **Cursor implements; this session only writes
the prompts.** Source of truth for tasks stays `research/PLAN.md`.

| File | Plan item | What it does |
|------|-----------|--------------|
| [08-oven-temperature-converter.md](08-oven-temperature-converter.md) | #8 `→cursor` | New standalone `oven-temperature-converter` page (°C/°F/UK gas marks + fan −20 °C), modeled on `cooking-conversion-calculator`. |

### Not included (and why)

- **#1–#6, #9** — all `→сам` (coordination/judgement/external accounts/content/non-standard
  stack); not Cursor work.
- **#7** (`→гибрид`, geo take-home pay) — the reference sample isn't built yet (data source +
  template + first state are still `→сам` and deferred until Google recovers), so there's
  nothing for Cursor to replicate. Revisit once the first state page exists.
