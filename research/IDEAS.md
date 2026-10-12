# Идеи

Инбокс — только то, что ещё не взято в работу. Взятое переносится в `## Очередь` (PLAN.md).

- [ ] Инфра: миграция Vercel → Cloudflare Pages — после восстановления Google; CF почти
      бесплатен для статики и уже наш DNS/email/analytics. Чеклист: выбрать путь (OpenNext-
      адаптер vs `output:"export"`); перенести security-заголовки → `_headers`; редиректы
      (apex↔www, не-/en→/en) → `_redirects`/Pages Function; `/api/og` → пре-ген/Worker;
      собрать на CF Pages preview и сверить заголовки/301/robots/sitemap/OG ДО переключения DNS.
- [ ] Гео take-home pay / income-tax по штатам US + UK — крупный programmatic, топ-CPM; после
      восстановления (источник налоговых данных + объём на согласование).
- [ ] Cooking/baking конверсии (cups↔grams, oven temps) — только топ-спрос, не массово (низкий CPM).

<!-- Сделано 12.10: Spotlight в тело calc-страниц; embeddable 8→16; health BAC + pregnancy-weight-gain
     (TDEE пропущен — уже покрыт calorie-calculator). См. PLAN.md → Сделано. -->
